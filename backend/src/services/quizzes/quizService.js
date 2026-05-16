import { AppError } from "../../models/common/appError.js";
import { findSkillById } from "../../repositories/skills/skillRepository.js";
import {
  createQuizWithQuestions,
  findQuizById,
  getQuizQuestions,
  getQuizzes
} from "../../repositories/quizzes/quizRepository.js";
import { generateQuizDraft } from "../ai/aiServiceClient.js";

const buildFallbackQuestion = (skillName, difficultyLevel, order) => ({
  question_text: `Câu hỏi ${order} về kỹ năng ${skillName} ở mức ${difficultyLevel.toLowerCase()}: khái niệm nào phù hợp nhất?`,
  question_type: "MCQ",
  correct_answer: skillName,
  score: 1,
  explanation: `Đây là câu hỏi nền tảng để kiểm tra hiểu biết ban đầu về ${skillName}.`,
  options: [
    { option_text: skillName, is_correct: true },
    { option_text: `Sai lầm phổ biến ${order}`, is_correct: false },
    { option_text: `Khái niệm nâng cao ${order}`, is_correct: false },
    { option_text: `Ví dụ không liên quan ${order}`, is_correct: false }
  ]
});

const buildFallbackQuizDraft = ({ skill, difficultyLevel, numberOfQuestions, timeLimitMinutes }) => ({
  quiz_title: `Kiểm tra ${skill.skill_name} ${difficultyLevel === "BASIC" ? "cơ bản" : difficultyLevel === "INTERMEDIATE" ? "trung bình" : "nâng cao"}`,
  description: `Bộ câu hỏi luyện tập nhanh cho kỹ năng ${skill.skill_name}.`,
  difficulty_level: difficultyLevel,
  time_limit_minutes: timeLimitMinutes ?? 20,
  passing_score: 60,
  questions: Array.from({ length: numberOfQuestions }, (_, index) =>
    buildFallbackQuestion(skill.skill_name, difficultyLevel, index + 1)
  )
});

const sanitizeQuizQuestions = (questions) =>
  questions.map((question) => ({
    question_id: question.question_id,
    quiz_id: question.quiz_id,
    question_text: question.question_text,
    question_type: question.question_type,
    score: question.score,
    explanation: question.explanation,
    options: (question.options || []).map((option) => ({
      option_id: option.option_id,
      option_text: option.option_text
    }))
  }));

const getQuizDetailPayload = async (quizId) => {
  const quiz = await findQuizById(quizId);

  if (!quiz) {
    throw new AppError("Không tìm thấy bài kiểm tra.", 404, "QUIZ_NOT_FOUND");
  }

  return {
    ...quiz,
    questions: sanitizeQuizQuestions(await getQuizQuestions(quizId))
  };
};

export const listQuizzes = async (params) => {
  if (params.skillId) {
    const skill = await findSkillById(params.skillId);

    if (!skill) {
      throw new AppError("Kỹ năng không tồn tại.", 400, "SKILL_NOT_FOUND");
    }
  }

  return getQuizzes(params);
};

export const createGeneratedQuiz = async (payload) => {
  const skill = await findSkillById(payload.skill_id);

  if (!skill) {
    throw new AppError("Kỹ năng không tồn tại.", 400, "SKILL_NOT_FOUND");
  }

  let draft;

  try {
    draft = await generateQuizDraft({
      skill_id: skill.skill_id,
      skill_name: skill.skill_name,
      difficulty_level: payload.difficulty_level,
      number_of_questions: payload.number_of_questions,
      time_limit_minutes: payload.time_limit_minutes
    });
  } catch (_error) {
    draft = buildFallbackQuizDraft({
      skill,
      difficultyLevel: payload.difficulty_level,
      numberOfQuestions: payload.number_of_questions,
      timeLimitMinutes: payload.time_limit_minutes
    });
  }

  const normalizedQuestions = (draft.questions || []).slice(0, payload.number_of_questions).map((question, index) => ({
    question_text: question.question_text || `Câu hỏi ${index + 1} về ${skill.skill_name}`,
    question_type: question.question_type || "MCQ",
    correct_answer: question.correct_answer || skill.skill_name,
    score: question.score ?? 1,
    explanation: question.explanation || `Giải thích cho câu hỏi ${index + 1}.`,
    options: (question.options || []).length
      ? question.options.map((option) => ({
          option_text: option.option_text,
          is_correct: Boolean(option.is_correct)
        }))
      : buildFallbackQuestion(skill.skill_name, payload.difficulty_level, index + 1).options
  }));

  const createdQuiz = await createQuizWithQuestions({
    skillId: skill.skill_id,
    quizTitle: draft.quiz_title || `Kiểm tra ${skill.skill_name}`,
    description: draft.description || `Bộ câu hỏi dành cho kỹ năng ${skill.skill_name}.`,
    difficultyLevel: payload.difficulty_level,
    timeLimitMinutes: payload.time_limit_minutes ?? draft.time_limit_minutes ?? 20,
    passingScore: draft.passing_score ?? 60,
    createdByAi: true,
    questions: normalizedQuestions
  });

  return getQuizDetailPayload(createdQuiz.quiz_id);
};

export const getQuizDetail = async (quizId) => getQuizDetailPayload(quizId);
