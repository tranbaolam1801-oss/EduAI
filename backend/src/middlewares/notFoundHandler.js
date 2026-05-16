import { sendError } from "../utils/http/apiResponse.js";

export const notFoundHandler = (req, res) =>
  sendError(res, {
    statusCode: 404,
    code: "ROUTE_NOT_FOUND",
    message: `Không tìm thấy đường dẫn ${req.originalUrl}.`,
    details: []
  });
