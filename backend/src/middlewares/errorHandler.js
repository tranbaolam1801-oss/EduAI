import { sendError } from "../utils/http/apiResponse.js";

export const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const code = error.code || "INTERNAL_SERVER_ERROR";
  const message =
    statusCode >= 500 ? "Lỗi máy chủ nội bộ." : error.message || "Yêu cầu không hợp lệ.";
  const details = Array.isArray(error.details) ? error.details : [];

  if (statusCode >= 500) {
    console.error(error);
  }

  return sendError(res, {
    statusCode,
    code,
    message,
    details
  });
};
