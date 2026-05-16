import { AppError } from "../../models/common/appError.js";
import { getCareerGoalsByUserId } from "../../repositories/careerGoals/careerGoalRepository.js";
import {
  createChatMessage,
  createChatSession,
  findChatSessionByIdAndUserId,
  getChatMessagesBySessionId,
  getChatSessionsByUserId
} from "../../repositories/chats/chatRepository.js";
import { findProfileByUserId } from "../../repositories/profiles/profileRepository.js";
import { getRoadmapsByUserId } from "../../repositories/roadmaps/roadmapRepository.js";
import { getUserSkillsByUserId } from "../../repositories/userSkills/userSkillRepository.js";
import { generateMentorReply } from "../ai/aiServiceClient.js";

const buildFallbackMentorReply = ({ profile, goals, roadmaps, topSkills, message }) => {
  const goalName = goals[0]?.career_name || "mục tiêu học tập của bạn";
  const roadmapName = roadmaps[0]?.title || "lộ trình hiện tại";
  const skillSummary = topSkills.length
    ? topSkills.map((item) => item.skill_name).join(", ")
    : "các kỹ năng nền tảng";

  return `Mình đã đọc câu hỏi "${message}". Với hồ sơ ${profile?.major || "hiện tại"} và mục tiêu ${goalName}, bạn nên ưu tiên ${skillSummary}. Nếu đã có ${roadmapName}, hãy hoàn thành các nhiệm vụ đang mở trước rồi quay lại đánh giá tiến độ.`;
};

const buildSessionTitle = (messageContent) => {
  const trimmed = String(messageContent || "").trim();
  if (!trimmed) {
    return "Phiên trao đổi mới";
  }

  return trimmed.length > 60 ? `${trimmed.slice(0, 57)}...` : trimmed;
};

export const createMentorSession = async (userId, payload) => createChatSession(userId, payload.title?.trim() || null);

export const listMentorSessions = async (userId) => getChatSessionsByUserId(userId);

export const getMentorSessionDetail = async (userId, sessionId) => {
  const session = await findChatSessionByIdAndUserId(sessionId, userId);

  if (!session) {
    throw new AppError("Không tìm thấy phiên trò chuyện.", 404, "CHAT_SESSION_NOT_FOUND");
  }

  return {
    ...session,
    messages: await getChatMessagesBySessionId(sessionId)
  };
};

export const createMentorMessage = async (userId, sessionId, payload) => {
  const session = await findChatSessionByIdAndUserId(sessionId, userId);

  if (!session) {
    throw new AppError("Không tìm thấy phiên trò chuyện.", 404, "CHAT_SESSION_NOT_FOUND");
  }

  const [profile, goals, roadmaps, userSkills] = await Promise.all([
    findProfileByUserId(userId),
    getCareerGoalsByUserId(userId),
    getRoadmapsByUserId(userId),
    getUserSkillsByUserId(userId)
  ]);

  const userMessage = await createChatMessage({
    sessionId,
    senderType: "USER",
    messageContent: payload.message_content
  });

  const topSkills = [...userSkills].sort((left, right) => Number(right.current_level) - Number(left.current_level)).slice(0, 3);

  let mentorReplyContent;

  try {
    const aiResult = await generateMentorReply({
      session_id: sessionId,
      user_id: userId,
      message: payload.message_content,
      context: {
        profile,
        goals,
        roadmaps: roadmaps.slice(0, 2),
        top_skills: topSkills
      }
    });

    mentorReplyContent = aiResult.reply;
  } catch (_error) {
    mentorReplyContent = buildFallbackMentorReply({
      profile,
      goals,
      roadmaps,
      topSkills,
      message: payload.message_content
    });
  }

  const aiMessage = await createChatMessage({
    sessionId,
    senderType: "AI",
    messageContent: mentorReplyContent
  });

  return {
    session_id: sessionId,
    title: session.title || buildSessionTitle(payload.message_content),
    user_message: userMessage,
    ai_message: aiMessage,
    messages: await getChatMessagesBySessionId(sessionId)
  };
};
