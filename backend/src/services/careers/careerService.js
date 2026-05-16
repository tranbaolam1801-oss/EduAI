import { AppError } from "../../models/common/appError.js";
import {
  findCareerById,
  getCareerSkills,
  getCareers
} from "../../repositories/careers/careerRepository.js";

export const listCareers = async (filters) => getCareers(filters);

export const getCareerDetail = async (careerId) => {
  const career = await findCareerById(careerId);

  if (!career) {
    throw new AppError("Không tìm thấy nghề nghiệp.", 404, "CAREER_NOT_FOUND");
  }

  const requiredSkills = await getCareerSkills(careerId);

  return {
    ...career,
    required_skills: requiredSkills
  };
};
