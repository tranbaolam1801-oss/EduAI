import { login } from "../../services/auth/authService.js";
import { sendSuccess } from "../../utils/http/apiResponse.js";

export const loginUser = async (req, res) => {
  const data = await login(req.body);
  return sendSuccess(res, {
    message: "Success",
    data
  });
};

export const getIdentity = async (req, res) =>
  sendSuccess(res, {
    message: "Success",
    data: {
      user: req.auth
    }
  });
