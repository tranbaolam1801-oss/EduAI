import { AppError } from "../../models/common/appError.js";
import {
  createQuizAttempt,
  findQuizAttemptByIdAndUserId,
  getQuizAttemptAnswers,
  getQuizAttemptsByUserId,
  replaceQuizAttemptAnswers,
  submitQuizAttempt
} from "../../repositories/quizAttempts/quizAttemptRepository.js";
import { findQuizById, getQuizQuestions } from "../../repositories/quizzes/quizRepository.js";
import { evaluateQuizAttemptFeedback } from "../ai/aiServiceClient.js";

const normalizeText = (value) => String(value || "").trim().toLowerCase();

const buildFallbackFeedback = ({ score, passed, skillName, correctCount, totalCount }) => {
  if (passed) {
    return `Bạn đã vượt qua bài kiểm tra ${skillName || "kỹ năng"} với ${correctCount}/${totalCount} câu đúng. Hãy tiếp tục ôn lại các câu sai để củng cố kiến thức.`;
  }

  return `Bạn mới đạt ${score} điểm cho bài kiểm tra ${skillName || "kỹ năng"}. Hãy xem lại phần nền tảng và luyện thêm các câu hỏi đã làm sai.`;
};

const getAttemptDetailPayload = async (attemptId, userId) => {
  const attempt = await findQuizAttemptByIdAndUserId(attemptId, userId);

  if (!attempt) {
    throw new AppError("Không tìm thấy lượt làm bài.", 404, "QUIZ_ATTEMPT_NOT_FOUND");
  }

  return {
    ...attempt,
    answers: await getQuizAttemptAnswers(attemptId)
  };
};

export const startQuizAttempt = async (userId, payload) => {
  const quiz = await findQuizById(payload.quiz_id);

  if (!quiz) {
    throw new AppError("Không tìm thấy bài kiểm tra.", 404, "QUIZ_NOT_FOUND");
  }

  const attempt = await createQuizAttempt(userId, payload.quiz_id);
  return getAttemptDetailPayload(attempt.attempt_id, userId);
};

export const submitQuizAttemptAnswers = async (userId, attemptId, payload) => {
  const attempt = await findQuizAttemptByIdAndUserId(attemptId, userId);

  if (!attempt) {
    throw new AppError("Không tìm thấy lượt làm bài.", 404, "QUIZ_ATTEMPT_NOT_FOUND");
  }

  if (attempt.status !== "IN_PROGRESS") {
    throw new AppError("Lượt làm bài này đã được nộp trước đó.", 400, "QUIZ_ATTEMPT_ALREADY_SUBMITTED");
  }

  const questions = await getQuizQuestions(attempt.quiz_id);

  if (!questions.length) {
    throw new AppError("Bài kiểm tra chưa có câu hỏi để chấm điểm.", 400, "QUIZ_QUESTIONS_NOT_FOUND");
  }

  const answersByQuestionId = new Map(
    (payload.answers || []).map((answer) => [Number(answer.question_id), answer.user_answer ?? ""])
  );

  const evaluatedAnswers = questions.map((question) => {
    const userAnswer = answersByQuestionId.get(question.question_id) ?? "";
    const isCorrect = normalizeText(userAnswer) === normalizeText(question.correct_answer);
    return {
      question_id: question.question_id,
      user_answer: userAnswer,
      is_correct: isCorrect,
      earned_score: isCorrect ? Number(question.score || 0) : 0
    };
  });

  const totalPossibleScore = questions.reduce((sum, question) => sum + Number(question.score || 0), 0);
  const totalEarnedScore = evaluatedAnswers.reduce((sum, answer) => sum + Number(answer.earned_score || 0), 0);
  const score = totalPossibleScore === 0 ? 0 : Number(((totalEarnedScore / totalPossibleScore) * 100).toFixed(2));
  const correctCount = evaluatedAnswers.filter((answer) => answer.is_correct).length;
  const passed = score >= Number(attempt.passing_score || 0);

  await replaceQuizAttemptAnswers(attemptId, evaluatedAnswers);

  let aiFeedback;

  try {
    const aiResult = await evaluateQuizAttemptFeedback({
      attempt_id: attemptId,
      quiz_title: attempt.quiz_title,
      skill_name: attempt.skill_name,
      score,
      passing_score: attempt.passing_score,
      correct_count: correctCount,
      total_questions: questions.length
    });
    aiFeedback = aiResult.feedback;
  } catch (_error) {
    aiFeedback = buildFallbackFeedback({
      score,
      passed,
      skillName: attempt.skill_name,
      correctCount,
      totalCount: questions.length
    });
  }

  await submitQuizAttempt({
    attemptId,
    score,
    aiFeedback
  });

  return getAttemptDetailPayload(attemptId, userId);
};

export const listMyQuizAttempts = async (userId) => getQuizAttemptsByUserId(userId);
