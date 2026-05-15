export const sendSuccess = (res, { statusCode = 200, message = "Success", data = {}, meta } = {}) => {
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
    message = "Unexpected server error.",
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
