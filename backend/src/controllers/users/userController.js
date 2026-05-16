import { getCurrentUser } from "../../services/users/userService.js";
import { sendSuccess } from "../../utils/http/apiResponse.js";

export const getMe = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy thông tin người dùng thành công.",
    data: await getCurrentUser(req.auth.user_id)
  });
