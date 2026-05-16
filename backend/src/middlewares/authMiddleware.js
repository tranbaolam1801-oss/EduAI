import { AppError } from "../models/common/appError.js";
import { verifyAccessToken } from "../services/auth/tokenService.js";

export const authenticateRequest = (req, _res, next) => {
  const authorizationHeader = req.headers.authorization || "";
  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new AppError("Vui lòng đăng nhập để tiếp tục.", 401, "UNAUTHORIZED"));
  }

  try {
    req.auth = verifyAccessToken(token);
    return next();
  } catch (_error) {
    return next(new AppError("Phiên đăng nhập không hợp lệ hoặc đã hết hạn.", 401, "INVALID_TOKEN"));
  }
};
