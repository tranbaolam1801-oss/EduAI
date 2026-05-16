import { AppError } from "../../models/common/appError.js";
import { findCareerById } from "../../repositories/careers/careerRepository.js";
import { findCareerGoalByUserAndCareer } from "../../repositories/careerGoals/careerGoalRepository.js";
import { getSkillGapByUserAndCareer } from "../../repositories/skillGap/skillGapRepository.js";

export const getMySkillGap = async (userId, careerId) => {
  const career = await findCareerById(careerId);

  if (!career) {
    throw new AppError("Không tìm thấy nghề nghiệp.", 404, "CAREER_NOT_FOUND");
  }

  const careerGoal = await findCareerGoalByUserAndCareer(userId, careerId);

  if (!careerGoal || careerGoal.status !== "ACTIVE") {
    throw new AppError(
      "Vui lòng chọn nghề mục tiêu trước khi phân tích khoảng cách kỹ năng.",
      400,
      "CAREER_GOAL_REQUIRED"
    );
  }

  const skillGap = await getSkillGapByUserAndCareer(userId, careerId);

  return {
    career_id: career.career_id,
    career_name: career.career_name,
    items: skillGap.map((item) => ({
      ...item,
      gap_level: Math.max(0, item.gap_level)
    }))
  };
};
