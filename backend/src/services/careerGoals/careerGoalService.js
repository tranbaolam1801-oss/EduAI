import { AppError } from "../../models/common/appError.js";
import { findCareerById } from "../../repositories/careers/careerRepository.js";
import {
  createCareerGoal,
  findCareerGoalByUserAndCareer,
  getCareerGoalsByUserId,
  updateCareerGoal
} from "../../repositories/careerGoals/careerGoalRepository.js";

export const createOrUpdateCareerGoal = async (userId, payload) => {
  const career = await findCareerById(payload.career_id);

  if (!career) {
    throw new AppError("Nghề nghiệp không tồn tại.", 400, "CAREER_NOT_FOUND");
  }

  const existingGoal = await findCareerGoalByUserAndCareer(userId, payload.career_id);

  if (existingGoal) {
    return updateCareerGoal({
      goalId: existingGoal.goal_id,
      priorityOrder: payload.priority_order ?? existingGoal.priority_order,
      targetDeadline: payload.target_deadline ?? existingGoal.target_deadline,
      status: payload.status ?? "ACTIVE"
    });
  }

  return createCareerGoal({
    userId,
    careerId: payload.career_id,
    priorityOrder: payload.priority_order ?? 1,
    targetDeadline: payload.target_deadline,
    status: payload.status ?? "ACTIVE"
  });
};

export const getMyCareerGoals = async (userId) => getCareerGoalsByUserId(userId);
