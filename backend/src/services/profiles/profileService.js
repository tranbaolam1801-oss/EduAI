import { AppError } from "../../models/common/appError.js";
import { findAcademicFieldById } from "../../repositories/academicFields/academicFieldRepository.js";
import {
  createProfile,
  findProfileByUserId,
  updateProfileByUserId
} from "../../repositories/profiles/profileRepository.js";

const ensureAcademicFieldExists = async (fieldId) => {
  if (!fieldId) {
    return;
  }

  const academicField = await findAcademicFieldById(fieldId);

  if (!academicField) {
    throw new AppError("Lĩnh vực học tập không tồn tại.", 400, "ACADEMIC_FIELD_NOT_FOUND");
  }
};

export const createStudentProfile = async (userId, payload) => {
  const existingProfile = await findProfileByUserId(userId);

  if (existingProfile) {
    throw new AppError("Bạn đã tạo hồ sơ học tập trước đó.", 409, "PROFILE_ALREADY_EXISTS");
  }

  await ensureAcademicFieldExists(payload.field_id);

  return createProfile({
    userId,
    fieldId: payload.field_id,
    university: payload.university,
    major: payload.major,
    academicYear: payload.academic_year,
    currentLevel: payload.current_level,
    studyHoursPerWeek: payload.study_hours_per_week,
    targetCompletionMonths: payload.target_completion_months,
    preferredLocation: payload.preferred_location,
    careerGoalNote: payload.career_goal_note
  });
};

export const getMyProfile = async (userId) => {
  const profile = await findProfileByUserId(userId);

  if (!profile) {
    throw new AppError("Bạn chưa tạo hồ sơ học tập.", 404, "PROFILE_NOT_FOUND");
  }

  return profile;
};

export const updateMyProfile = async (userId, payload) => {
  const existingProfile = await findProfileByUserId(userId);

  if (!existingProfile) {
    throw new AppError("Bạn chưa tạo hồ sơ học tập.", 404, "PROFILE_NOT_FOUND");
  }

  await ensureAcademicFieldExists(payload.field_id);

  return updateProfileByUserId({
    userId,
    fieldId: payload.field_id,
    university: payload.university,
    major: payload.major,
    academicYear: payload.academic_year,
    currentLevel: payload.current_level,
    studyHoursPerWeek: payload.study_hours_per_week,
    targetCompletionMonths: payload.target_completion_months,
    preferredLocation: payload.preferred_location,
    careerGoalNote: payload.career_goal_note
  });
};
