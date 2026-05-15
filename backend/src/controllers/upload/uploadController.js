import { AppError } from "../../models/common/appError.js";
import { buildUploadResponse } from "../../services/upload/fileStorageService.js";
import { sendSuccess } from "../../utils/http/apiResponse.js";

export const uploadFile = async (req, res) => {
  if (!req.file) {
    throw new AppError("File is required.", 400, "FILE_REQUIRED");
  }

  return sendSuccess(res, {
    statusCode: 201,
    message: "Tải tệp thành công.",
    data: buildUploadResponse(req.params.folder, req.file)
  });
};
