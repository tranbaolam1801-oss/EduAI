import { listAcademicFields } from "../../services/academicFields/academicFieldService.js";
import { sendSuccess } from "../../utils/http/apiResponse.js";

export const getAcademicFields = async (_req, res) =>
  sendSuccess(res, {
    message: "Lấy danh sách lĩnh vực thành công.",
    data: await listAcademicFields()
  });
