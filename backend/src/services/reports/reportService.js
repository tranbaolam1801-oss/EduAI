import { findProfileByUserId } from "../../repositories/profiles/profileRepository.js";
import { getChallengesByUserId } from "../../repositories/challenges/challengeRepository.js";
import { getNotificationsByUserId } from "../../repositories/notifications/notificationRepository.js";
import {
  getDashboardAnalytics,
  getQuizResultAnalytics,
  getRoadmapProgressAnalytics
} from "../analytics/analyticsService.js";
import {
  getCareerReadinessPriorityGaps,
  getCareerReadinessJobSignals,
  getCareerReadinessOverview,
  getCareerReadinessStrengths
} from "../../repositories/reports/reportRepository.js";

export const getLearningSummaryReport = async (userId) => {
  const [profile, dashboard, roadmapProgress, quizResults, myChallenges, notifications] = await Promise.all([
    findProfileByUserId(userId),
    getDashboardAnalytics(userId),
    getRoadmapProgressAnalytics(userId),
    getQuizResultAnalytics(userId),
    getChallengesByUserId(userId),
    getNotificationsByUserId(userId, 10)
  ]);

  return {
    generated_at: new Date().toISOString(),
    profile,
    overview: dashboard.overview,
    current_roadmap: dashboard.current_roadmap,
    top_skills: dashboard.top_skills,
    focus: dashboard.focus,
    roadmap_progress: roadmapProgress,
    quiz_results: quizResults,
    joined_challenges: myChallenges,
    recent_notifications: notifications,
    notice: dashboard.notice
  };
};

export const getCareerReadinessReport = async (userId) => {
  const careerGoal = await getCareerReadinessOverview(userId);

  if (!careerGoal) {
    return {
      generated_at: new Date().toISOString(),
      career_goal: null,
      readiness: null,
      priority_gaps: [],
      strengths: [],
      job_signals: [],
      notice: "Hãy chọn nghề mục tiêu để hệ thống đánh giá mức sẵn sàng nghề nghiệp."
    };
  }

  const [priorityGaps, strengths, jobSignals] = await Promise.all([
    getCareerReadinessPriorityGaps(userId, careerGoal.career_id, 8),
    getCareerReadinessStrengths(userId, careerGoal.career_id, 5),
    getCareerReadinessJobSignals(userId, careerGoal.career_id, 3)
  ]);

  const averageGap =
    priorityGaps.length > 0
      ? Number(
          (
            priorityGaps.reduce((total, gap) => total + Number(gap.gap_level || 0), 0) / priorityGaps.length
          ).toFixed(2)
        )
      : 0;

  return {
    generated_at: new Date().toISOString(),
    career_goal: {
      goal_id: careerGoal.goal_id,
      career_id: careerGoal.career_id,
      career_name: careerGoal.career_name,
      priority_order: careerGoal.priority_order,
      target_deadline: careerGoal.target_deadline,
      status: careerGoal.status
    },
    readiness: {
      matched_skills: Number(careerGoal.matched_skills || 0),
      total_required_skills: Number(careerGoal.total_required_skills || 0),
      readiness_percent: Number(careerGoal.readiness_percent || 0),
      average_required_level: Number(careerGoal.average_required_level || 0),
      average_current_level: Number(careerGoal.average_current_level || 0),
      average_gap: averageGap
    },
    priority_gaps: priorityGaps,
    strengths,
    job_signals: jobSignals,
    notice: null
  };
};
