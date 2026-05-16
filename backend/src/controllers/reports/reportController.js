import {
  getCareerReadinessReport,
  getLearningSummaryReport
} from "../../services/reports/reportService.js";
import { sendSuccess } from "../../utils/http/apiResponse.js";

export const getLearningSummary = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy báo cáo học tập tổng hợp thành công.",
    data: await getLearningSummaryReport(req.auth.user_id)
  });

export const getCareerReadiness = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy báo cáo mức sẵn sàng nghề nghiệp thành công.",
    data: await getCareerReadinessReport(req.auth.user_id)
  });
