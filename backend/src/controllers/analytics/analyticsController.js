import {
  getDashboardAnalytics,
  getQuizResultAnalytics,
  getRoadmapProgressAnalytics,
  getSkillGapAnalytics
} from "../../services/analytics/analyticsService.js";
import { sendSuccess } from "../../utils/http/apiResponse.js";

export const getAnalyticsDashboard = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy dữ liệu tổng quan học tập thành công.",
    data: await getDashboardAnalytics(req.auth.user_id)
  });

export const getAnalyticsSkillGap = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy thống kê khoảng cách kỹ năng thành công.",
    data: await getSkillGapAnalytics(req.auth.user_id)
  });

export const getAnalyticsRoadmapProgress = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy thống kê tiến độ roadmap thành công.",
    data: await getRoadmapProgressAnalytics(req.auth.user_id)
  });

export const getAnalyticsQuizResults = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy thống kê kết quả quiz thành công.",
    data: await getQuizResultAnalytics(req.auth.user_id)
  });
