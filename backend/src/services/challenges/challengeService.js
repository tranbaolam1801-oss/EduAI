import { AppError } from "../../models/common/appError.js";
import {
  createChallengeParticipant,
  findChallengeById,
  findChallengeParticipant,
  getChallengeLeaderboard,
  getChallenges,
  getChallengesByUserId
} from "../../repositories/challenges/challengeRepository.js";
import { createNotification } from "../../repositories/notifications/notificationRepository.js";

export const listChallenges = async (userId, params) => getChallenges({ userId, ...params });

export const getChallengeDetail = async (challengeId, userId) => {
  const challenge = await findChallengeById(challengeId, userId);

  if (!challenge) {
    throw new AppError("Không tìm thấy thử thách.", 404, "CHALLENGE_NOT_FOUND");
  }

  return {
    ...challenge,
    leaderboard: await getChallengeLeaderboard(challengeId, 10)
  };
};

export const joinChallenge = async (challengeId, userId) => {
  const challenge = await findChallengeById(challengeId, userId);

  if (!challenge) {
    throw new AppError("Không tìm thấy thử thách.", 404, "CHALLENGE_NOT_FOUND");
  }

  if (challenge.status !== "OPEN") {
    throw new AppError("Thử thách này hiện không mở để tham gia.", 400, "CHALLENGE_NOT_OPEN");
  }

  const existingParticipant = await findChallengeParticipant(challengeId, userId);

  if (existingParticipant) {
    throw new AppError("Bạn đã tham gia thử thách này trước đó.", 409, "CHALLENGE_ALREADY_JOINED");
  }

  const participant = await createChallengeParticipant(challengeId, userId);

  await createNotification({
    userId,
    title: "Tham gia thử thách thành công",
    content: `Bạn đã tham gia thử thách "${challenge.title}". Hãy duy trì tiến độ học tập để hoàn thành đúng hạn.`,
    notificationType: "CHALLENGE"
  });

  return {
    challenge: await getChallengeDetail(challengeId, userId),
    participant
  };
};

export const listMyChallenges = async (userId) => getChallengesByUserId(userId);
