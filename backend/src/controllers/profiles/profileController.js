import {
  createStudentProfile,
  getMyProfile,
  updateMyProfile
} from "../../services/profiles/profileService.js";
import { sendSuccess } from "../../utils/http/apiResponse.js";

export const createMyProfile = async (req, res) =>
  sendSuccess(res, {
    statusCode: 201,
    message: "Tạo hồ sơ học tập thành công.",
    data: await createStudentProfile(req.auth.user_id, req.body)
  });

export const getProfile = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy hồ sơ học tập thành công.",
    data: await getMyProfile(req.auth.user_id)
  });

export const updateProfile = async (req, res) =>
  sendSuccess(res, {
    message: "Cập nhật hồ sơ học tập thành công.",
    data: await updateMyProfile(req.auth.user_id, req.body)
  });
