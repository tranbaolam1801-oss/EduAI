import { login, register } from "../../services/auth/authService.js";
import { sendSuccess } from "../../utils/http/apiResponse.js";

export const registerUser = async (req, res) => {
  const data = await register(req.body);
  return sendSuccess(res, {
    statusCode: 201,
    message: "Đăng ký tài khoản thành công.",
    data
  });
};

export const loginUser = async (req, res) => {
  const data = await login(req.body);
  return sendSuccess(res, {
    message: "Đăng nhập thành công.",
    data
  });
};

export const getIdentity = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy thông tin đăng nhập thành công.",
    data: {
      user: req.auth
    }
  });
