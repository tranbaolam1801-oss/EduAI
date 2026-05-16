import { getCareerGoalsByUserId } from "../../repositories/careerGoals/careerGoalRepository.js";
import { getJobs } from "../../repositories/jobs/jobRepository.js";
import { findProfileByUserId } from "../../repositories/profiles/profileRepository.js";
import { getRoadmapsByUserId } from "../../repositories/roadmaps/roadmapRepository.js";
import { getRecommendationsByUserId, createRecommendation } from "../../repositories/recommendations/recommendationRepository.js";
import { getUserSkillsByUserId } from "../../repositories/userSkills/userSkillRepository.js";

const buildDefaultRecommendations = async (userId) => {
  const [profile, goals, roadmaps, userSkills, jobs] = await Promise.all([
    findProfileByUserId(userId),
    getCareerGoalsByUserId(userId),
    getRoadmapsByUserId(userId),
    getUserSkillsByUserId(userId),
    getJobs({ userId, limit: 1 })
  ]);

  const recommendations = [];
  const weakestSkill = [...userSkills].sort((left, right) => Number(left.current_level) - Number(right.current_level))[0];
  const activeRoadmap = roadmaps[0];
  const recommendedJob = jobs[0];

  if (activeRoadmap) {
    recommendations.push({
      recommendationType: "ROADMAP",
      title: "Tiếp tục lộ trình đang học",
      content: `Bạn đang theo lộ trình ${activeRoadmap.title}. Hãy ưu tiên hoàn thành các nhiệm vụ mở trước khi tạo thêm roadmap mới.`,
      priorityScore: 90
    });
  }

  if (weakestSkill) {
    recommendations.push({
      recommendationType: "REVIEW",
      title: `Củng cố kỹ năng ${weakestSkill.skill_name}`,
      content: `Mức hiện tại của bạn ở kỹ năng ${weakestSkill.skill_name} còn thấp. Nên ôn lại phần nền tảng và làm thêm quiz đánh giá.`,
      priorityScore: 85
    });
  }

  if (recommendedJob) {
    recommendations.push({
      recommendationType: "JOB",
      title: "Theo dõi cơ hội nghề nghiệp phù hợp",
      content: `Có vị trí ${recommendedJob.job_title} tại ${recommendedJob.company_name} phù hợp với lộ trình học hiện tại của bạn.`,
      priorityScore: 70
    });
  }

  if (!recommendations.length) {
    recommendations.push({
      recommendationType: "MOTIVATION",
      title: "Hoàn thiện hồ sơ học tập",
      content: `Hãy cập nhật hồ sơ, kỹ năng và nghề mục tiêu${profile?.major ? ` cho ngành ${profile.major}` : ""} để hệ thống có đủ dữ liệu gợi ý.`,
      priorityScore: 60
    });
  }

  const created = [];

  for (const recommendation of recommendations) {
    created.push(
      await createRecommendation({
        userId,
        ...recommendation,
        status: "NEW"
      })
    );
  }

  return created;
};

export const listMyRecommendations = async (userId) => {
  const existing = await getRecommendationsByUserId(userId);

  if (existing.length) {
    return existing;
  }

  await buildDefaultRecommendations(userId);
  return getRecommendationsByUserId(userId);
};
