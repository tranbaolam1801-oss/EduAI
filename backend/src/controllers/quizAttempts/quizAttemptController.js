import {
  listMyQuizAttempts,
  startQuizAttempt,
  submitQuizAttemptAnswers
} from "../../services/quizAttempts/quizAttemptService.js";
import { sendSuccess } from "../../utils/http/apiResponse.js";

export const createQuizAttempt = async (req, res) =>
  sendSuccess(res, {
    statusCode: 201,
    message: "Tạo lượt làm bài thành công.",
    data: await startQuizAttempt(req.auth.user_id, {
      quiz_id: Number(req.body.quiz_id)
    })
  });

export const submitQuizAttempt = async (req, res) =>
  sendSuccess(res, {
    message: "Nộp bài kiểm tra thành công.",
    data: await submitQuizAttemptAnswers(req.auth.user_id, Number(req.params.id), req.body)
  });

export const getMyQuizAttempts = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy lịch sử làm bài thành công.",
    data: await listMyQuizAttempts(req.auth.user_id)
  });
