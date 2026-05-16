export const sendSuccess = (res, { statusCode = 200, message = "Thành công.", data = {}, meta } = {}) => {
  const payload = {
    success: true,
    message,
    data
  };

  if (meta) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
};

export const sendError = (
  res,
  {
    statusCode = 500,
    code = "INTERNAL_SERVER_ERROR",
    message = "Đã xảy ra lỗi không mong muốn.",
    details = []
  } = {}
) =>
  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details
    }
  });
