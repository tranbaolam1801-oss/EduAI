import { getDatabasePool } from "../../config/database.js";

export const createProfile = async ({
  userId,
  fieldId,
  university,
  major,
  academicYear,
  currentLevel,
  studyHoursPerWeek,
  targetCompletionMonths,
  preferredLocation,
  careerGoalNote
}) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("userId", userId)
    .input("fieldId", fieldId ?? null)
    .input("university", university ?? null)
    .input("major", major ?? null)
    .input("academicYear", academicYear ?? null)
    .input("currentLevel", currentLevel ?? null)
    .input("studyHoursPerWeek", studyHoursPerWeek)
    .input("targetCompletionMonths", targetCompletionMonths)
    .input("preferredLocation", preferredLocation ?? null)
    .input("careerGoalNote", careerGoalNote ?? null)
    .query(`
      INSERT INTO StudentProfiles (
        user_id,
        field_id,
        university,
        major,
        academic_year,
        current_level,
        study_hours_per_week,
        target_completion_months,
        preferred_location,
        career_goal_note
      )
      OUTPUT
        INSERTED.profile_id,
        INSERTED.user_id,
        INSERTED.field_id,
        INSERTED.university,
        INSERTED.major,
        INSERTED.academic_year,
        INSERTED.current_level,
        INSERTED.study_hours_per_week,
        INSERTED.target_completion_months,
        INSERTED.preferred_location,
        INSERTED.career_goal_note,
        INSERTED.created_at
      VALUES (
        @userId,
        @fieldId,
        @university,
        @major,
        @academicYear,
        @currentLevel,
        @studyHoursPerWeek,
        @targetCompletionMonths,
        @preferredLocation,
        @careerGoalNote
      );
    `);

  return result.recordset[0];
};

export const findProfileByUserId = async (userId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("userId", userId).query(`
    SELECT
      sp.profile_id,
      sp.user_id,
      sp.field_id,
      af.field_name,
      sp.university,
      sp.major,
      sp.academic_year,
      sp.current_level,
      sp.study_hours_per_week,
      sp.target_completion_months,
      sp.preferred_location,
      sp.career_goal_note,
      sp.created_at
    FROM StudentProfiles sp
    LEFT JOIN AcademicFields af ON af.field_id = sp.field_id
    WHERE sp.user_id = @userId;
  `);

  return result.recordset[0] || null;
};

export const updateProfileByUserId = async ({
  userId,
  fieldId,
  university,
  major,
  academicYear,
  currentLevel,
  studyHoursPerWeek,
  targetCompletionMonths,
  preferredLocation,
  careerGoalNote
}) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("userId", userId)
    .input("fieldId", fieldId ?? null)
    .input("university", university ?? null)
    .input("major", major ?? null)
    .input("academicYear", academicYear ?? null)
    .input("currentLevel", currentLevel ?? null)
    .input("studyHoursPerWeek", studyHoursPerWeek)
    .input("targetCompletionMonths", targetCompletionMonths)
    .input("preferredLocation", preferredLocation ?? null)
    .input("careerGoalNote", careerGoalNote ?? null)
    .query(`
      UPDATE StudentProfiles
      SET field_id = @fieldId,
          university = @university,
          major = @major,
          academic_year = @academicYear,
          current_level = @currentLevel,
          study_hours_per_week = @studyHoursPerWeek,
          target_completion_months = @targetCompletionMonths,
          preferred_location = @preferredLocation,
          career_goal_note = @careerGoalNote
      OUTPUT
        INSERTED.profile_id,
        INSERTED.user_id,
        INSERTED.field_id,
        INSERTED.university,
        INSERTED.major,
        INSERTED.academic_year,
        INSERTED.current_level,
        INSERTED.study_hours_per_week,
        INSERTED.target_completion_months,
        INSERTED.preferred_location,
        INSERTED.career_goal_note,
        INSERTED.created_at
      WHERE user_id = @userId;
    `);

  return result.recordset[0] || null;
};
