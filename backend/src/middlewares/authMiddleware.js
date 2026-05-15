import { AppError } from "../models/common/appError.js";
import { verifyAccessToken } from "../services/auth/tokenService.js";

export const authenticateRequest = (req, _res, next) => {
  const authorizationHeader = req.headers.authorization || "";
  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new AppError("Authentication is required.", 401, "UNAUTHORIZED"));
  }

  try {
    req.auth = verifyAccessToken(token);
    return next();
  } catch (_error) {
    return next(new AppError("Invalid or expired token.", 401, "INVALID_TOKEN"));
  }
};
