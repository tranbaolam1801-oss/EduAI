import { getCompanyDetail } from "../../services/companies/companyService.js";
import { sendSuccess } from "../../utils/http/apiResponse.js";

export const getCompanyById = async (req, res) =>
  sendSuccess(res, {
    message: "Lấy thông tin công ty thành công.",
    data: await getCompanyDetail(Number(req.params.id))
  });
