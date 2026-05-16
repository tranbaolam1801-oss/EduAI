import { createTaskResource } from "../../services/taskResources/taskResourceService.js";
import { sendSuccess } from "../../utils/http/apiResponse.js";

export const saveTaskResource = async (req, res) =>
  sendSuccess(res, {
    statusCode: 201,
    message: "Gắn tài liệu vào nhiệm vụ học tập thành công.",
    data: await createTaskResource(req.auth.user_id, req.body)
  });
