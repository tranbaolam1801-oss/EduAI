import {
  createMentorMessage,
  createMentorSession,
  getMentorSessionDetail,
  listMentorSessions
} from "../../services/chats/chatService.js";
import { sendSuccess } from "../../utils/http/apiResponse.js";

export const createChatSession = async (req, res) =>
  sendSuccess(res, {
    statusCode: 201,
    message: "Tạo phiên trò chuyện thành công.",
    data: await createMentorSession(req.auth.user_id, req.body)
  });

export const getChatSessions = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy danh sách phiên trò chuyện thành công.",
    data: await listMentorSessions(req.auth.user_id)
  });

export const getChatSessionById = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy chi tiết phiên trò chuyện thành công.",
    data: await getMentorSessionDetail(req.auth.user_id, Number(req.params.id))
  });

export const createChatMessage = async (req, res) =>
  sendSuccess(res, {
    statusCode: 201,
    message: "Gửi tin nhắn AI Mentor thành công.",
    data: await createMentorMessage(req.auth.user_id, Number(req.params.id), req.body)
  });
