import { findProfileByUserId } from "../../repositories/profiles/profileRepository.js";
import {
  getCurrentRoadmapSummary,
  getDashboardCounters,
  getQuizResultsBySkill,
  getQuizSummary,
  getRecentNotifications,
  getRecentProgressLogs,
  getRecentQuizResults,
  getRoadmapProgressRows,
  getSkillGapSummary,
  getTopSkillGapItems,
  getTopUserSkills,
  getUpcomingRoadmapTasks
} from "../../repositories/analytics/analyticsRepository.js";

const buildNextStep = ({ profile, roadmap, nextTask, topGap }) => {
  if (!profile) {
    return "Hoàn thiện hồ sơ học tập để hệ thống cá nhân hóa lộ trình chính xác hơn.";
  }

  if (!roadmap) {
    return "Chọn nghề mục tiêu và tạo lộ trình học đầu tiên để bắt đầu theo dõi tiến độ.";
  }

  if (nextTask) {
    return `Ưu tiên hoàn thành nhiệm vụ "${nextTask.task_title}" trong giai đoạn ${nextTask.stage_name}.`;
  }

  if (topGap) {
    return `Tập trung bù khoảng cách kỹ năng ${topGap.skill_name} trước khi mở rộng sang kỹ năng khác.`;
  }

  return "Tiếp tục duy trì nhịp học và cập nhật tiến độ để hệ thống theo dõi sát hơn.";
};

export const getDashboardAnalytics = async (userId) => {
  const [profile, roadmap, counters, topSkills, topGaps, nextTasks, notifications] = await Promise.all([
    findProfileByUserId(userId),
    getCurrentRoadmapSummary(userId),
    getDashboardCounters(userId),
    getTopUserSkills(userId, 5),
    getTopSkillGapItems(userId, 5),
    getUpcomingRoadmapTasks(userId, 5),
    getRecentNotifications(userId, 5)
  ]);

  const nextTask = nextTasks[0] || null;
  const topGap = topGaps[0] || null;

  return {
    overview: {
      assessed_skills_count: counters.assessed_skills_count,
      average_skill_level: counters.average_skill_level,
      current_roadmap_progress: Number(roadmap?.progress_percent || 0),
      completed_tasks: Number(roadmap?.completed_tasks || 0),
      total_tasks: Number(roadmap?.total_tasks || 0),
      average_quiz_score: counters.average_quiz_score,
      total_study_minutes: counters.total_study_minutes,
      unread_notifications: counters.unread_notifications,
      joined_challenges_count: counters.joined_challenges_count
    },
    profile,
    current_roadmap: roadmap,
    top_skills: topSkills,
    focus: {
      next_task: nextTask,
      top_gap: topGap,
      next_step: buildNextStep({ profile, roadmap, nextTask, topGap })
    },
    recent_notifications: notifications,
    notice: roadmap ? null : "Bạn chưa có lộ trình học đang hoạt động."
  };
};

export const getSkillGapAnalytics = async (userId) => {
  const [summary, items] = await Promise.all([getSkillGapSummary(userId), getTopSkillGapItems(userId, 20)]);

  return {
    summary,
    items,
    notice: summary.total_skills ? null : "Bạn chưa có nghề mục tiêu hoặc dữ liệu skill gap để phân tích."
  };
};

export const getRoadmapProgressAnalytics = async (userId) => {
  const [roadmaps, recentLogs, upcomingTasks] = await Promise.all([
    getRoadmapProgressRows(userId),
    getRecentProgressLogs(userId, 12),
    getUpcomingRoadmapTasks(userId, 8)
  ]);

  const summary = roadmaps.reduce(
    (accumulator, roadmap) => {
      accumulator.roadmap_count += 1;
      accumulator.active_roadmap_count += roadmap.status === "ACTIVE" ? 1 : 0;
      accumulator.total_tasks += Number(roadmap.total_tasks || 0);
      accumulator.completed_tasks += Number(roadmap.completed_tasks || 0);
      accumulator.total_estimated_hours += Number(roadmap.total_estimated_hours || 0);
      return accumulator;
    },
    {
      roadmap_count: 0,
      active_roadmap_count: 0,
      total_tasks: 0,
      completed_tasks: 0,
      total_estimated_hours: 0
    }
  );

  summary.average_progress_percent =
    roadmaps.length > 0
      ? Number(
          (
            roadmaps.reduce((total, roadmap) => total + Number(roadmap.progress_percent || 0), 0) / roadmaps.length
          ).toFixed(2)
        )
      : 0;
  summary.total_study_minutes = recentLogs.reduce((total, log) => total + Number(log.study_minutes || 0), 0);

  return {
    summary,
    roadmaps,
    recent_logs: recentLogs,
    upcoming_tasks: upcomingTasks,
    notice: roadmaps.length ? null : "Bạn chưa có roadmap để theo dõi tiến độ."
  };
};

export const getQuizResultAnalytics = async (userId) => {
  const [summary, bySkill, recentAttempts] = await Promise.all([
    getQuizSummary(userId),
    getQuizResultsBySkill(userId),
    getRecentQuizResults(userId, 10)
  ]);

  return {
    summary,
    by_skill: bySkill,
    recent_attempts: recentAttempts,
    notice: summary.attempts_count ? null : "Bạn chưa có lượt làm quiz nào để thống kê."
  };
};
