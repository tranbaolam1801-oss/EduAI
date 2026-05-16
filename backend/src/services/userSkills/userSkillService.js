import { AppError } from "../../models/common/appError.js";
import { findSkillById } from "../../repositories/skills/skillRepository.js";
import {
  getUserSkillsByUserId,
  upsertUserSkill
} from "../../repositories/userSkills/userSkillRepository.js";

export const saveUserSkill = async (userId, payload) => {
  const skill = await findSkillById(payload.skill_id);

  if (!skill) {
    throw new AppError("Kỹ năng không tồn tại.", 400, "SKILL_NOT_FOUND");
  }

  return upsertUserSkill({
    userId,
    skillId: payload.skill_id,
    currentLevel: payload.current_level,
    confidenceLevel: payload.confidence_level,
    source: payload.source ?? "SELF_ASSESSMENT"
  });
};

export const getMyUserSkills = async (userId) => getUserSkillsByUserId(userId);
