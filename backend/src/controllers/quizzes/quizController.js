import { getQuizDetail, createGeneratedQuiz, listQuizzes } from "../../services/quizzes/quizService.js";
import { sendSuccess } from "../../utils/http/apiResponse.js";

export const getQuizList = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy danh sách bài kiểm tra thành công.",
    data: await listQuizzes({
      skillId: req.query.skill_id ? Number(req.query.skill_id) : null,
      difficultyLevel: req.query.difficulty_level || null,
      limit: req.query.limit ? Number(req.query.limit) : 20
    })
  });

export const generateQuiz = async (req, res) =>
  sendSuccess(res, {
    statusCode: 201,
    message: "Tạo bài kiểm tra thành công.",
    data: await createGeneratedQuiz({
      skill_id: Number(req.body.skill_id),
      difficulty_level: req.body.difficulty_level,
      number_of_questions: Number(req.body.number_of_questions),
      time_limit_minutes: req.body.time_limit_minutes ? Number(req.body.time_limit_minutes) : null
    })
  });

export const getQuizById = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy chi tiết bài kiểm tra thành công.",
    data: await getQuizDetail(Number(req.params.id))
  });
