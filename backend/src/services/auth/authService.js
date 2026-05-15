import { AppError } from "../../models/common/appError.js";

export const login = async (_credentials) => {
  throw new AppError(
    "Authentication business flow is not implemented in Phase 1.",
    501,
    "AUTH_NOT_IMPLEMENTED"
  );
};
