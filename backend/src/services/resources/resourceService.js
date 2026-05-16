import { AppError } from "../../models/common/appError.js";
import { findSkillById } from "../../repositories/skills/skillRepository.js";
import { getResources } from "../../repositories/resources/resourceRepository.js";

export const listResources = async (params) => {
  if (params.skillId) {
    const skill = await findSkillById(params.skillId);

    if (!skill) {
      throw new AppError("Kỹ năng không tồn tại.", 400, "SKILL_NOT_FOUND");
    }
  }

  return getResources(params);
};

export const recommendResources = async (params) => {
  if (params.skillId) {
    const skill = await findSkillById(params.skillId);

    if (!skill) {
      throw new AppError("Kỹ năng không tồn tại.", 400, "SKILL_NOT_FOUND");
    }
  }

  const resources = await getResources({
    ...params,
    limit: params.limit ?? 12
  });

  if (!resources.length) {
    throw new AppError(
      "Chưa tìm thấy tài liệu phù hợp với bộ lọc hiện tại.",
      404,
      "RESOURCE_RECOMMENDATION_NOT_FOUND"
    );
  }

  return resources;
};
