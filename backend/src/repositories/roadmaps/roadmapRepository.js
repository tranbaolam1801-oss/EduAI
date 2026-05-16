import { getDatabasePool } from "../../config/database.js";

export const getCareerSkillGapForRoadmap = async (userId, careerId) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("userId", userId)
    .input("careerId", careerId)
    .query(`
      SELECT
        cs.career_id,
        cs.skill_id,
        s.skill_name,
        cs.required_level,
        ISNULL(us.current_level, 0) AS current_level,
        CASE
          WHEN cs.required_level - ISNULL(us.current_level, 0) > 0
            THEN cs.required_level - ISNULL(us.current_level, 0)
          ELSE 0
        END AS gap_level,
        cs.importance_weight
      FROM CareerSkills cs
      JOIN Skills s ON s.skill_id = cs.skill_id
      LEFT JOIN UserSkills us ON us.user_id = @userId AND us.skill_id = cs.skill_id
      WHERE cs.career_id = @careerId
      ORDER BY gap_level DESC, cs.importance_weight DESC, s.skill_name;
    `);

  return result.recordset;
};

export const generateRoadmapFromCareerSkills = async ({ userId, careerId, months }) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("user_id", userId)
    .input("career_id", careerId)
    .input("months", months)
    .execute("sp_CreateRoadmapFromCareerSkills");

  return result.recordset[0] || null;
};

export const getRoadmapsByUserId = async (userId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("userId", userId).query(`
    SELECT
      lr.roadmap_id,
      lr.user_id,
      lr.career_id,
      c.career_name,
      lr.title,
      lr.description,
      lr.start_date,
      lr.expected_end_date,
      lr.status,
      lr.ai_generated,
      lr.created_at,
      ISNULL(summary.total_tasks, 0) AS total_tasks,
      ISNULL(summary.completed_tasks, 0) AS completed_tasks,
      ISNULL(summary.progress_percent, 0) AS progress_percent,
      ISNULL(summary.total_estimated_hours, 0) AS total_estimated_hours
    FROM LearningRoadmaps lr
    JOIN Careers c ON c.career_id = lr.career_id
    LEFT JOIN vw_RoadmapProgressSummary summary ON summary.roadmap_id = lr.roadmap_id
    WHERE lr.user_id = @userId
    ORDER BY lr.created_at DESC, lr.roadmap_id DESC;
  `);

  return result.recordset;
};

export const findRoadmapByIdAndUserId = async (roadmapId, userId) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("roadmapId", roadmapId)
    .input("userId", userId)
    .query(`
      SELECT
        lr.roadmap_id,
        lr.user_id,
        lr.career_id,
        c.career_name,
        lr.title,
        lr.description,
        lr.start_date,
        lr.expected_end_date,
        lr.status,
        lr.ai_generated,
        lr.created_at,
        ISNULL(summary.total_tasks, 0) AS total_tasks,
        ISNULL(summary.completed_tasks, 0) AS completed_tasks,
        ISNULL(summary.progress_percent, 0) AS progress_percent,
        ISNULL(summary.total_estimated_hours, 0) AS total_estimated_hours
      FROM LearningRoadmaps lr
      JOIN Careers c ON c.career_id = lr.career_id
      LEFT JOIN vw_RoadmapProgressSummary summary ON summary.roadmap_id = lr.roadmap_id
      WHERE lr.roadmap_id = @roadmapId AND lr.user_id = @userId;
    `);

  return result.recordset[0] || null;
};

export const getRoadmapStagesWithTasks = async (roadmapId, userId) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("roadmapId", roadmapId)
    .input("userId", userId)
    .query(`
      SELECT
        rs.stage_id,
        rs.roadmap_id,
        rs.stage_order,
        rs.stage_name,
        rs.description AS stage_description,
        rs.expected_weeks,
        rt.task_id,
        rt.skill_id,
        s.skill_name,
        rt.task_order,
        rt.task_title,
        rt.task_type,
        rt.description AS task_description,
        rt.estimated_hours,
        rt.status AS task_status,
        rt.due_date,
        rt.completed_at,
        latest_log.progress_percent AS latest_progress_percent,
        latest_log.study_minutes AS latest_study_minutes,
        latest_log.logged_at AS latest_logged_at
      FROM LearningRoadmaps lr
      JOIN RoadmapStages rs ON rs.roadmap_id = lr.roadmap_id
      LEFT JOIN RoadmapTasks rt ON rt.stage_id = rs.stage_id
      LEFT JOIN Skills s ON s.skill_id = rt.skill_id
      OUTER APPLY (
        SELECT TOP 1
          l.progress_percent,
          l.study_minutes,
          l.logged_at
        FROM LearningProgressLogs l
        WHERE l.task_id = rt.task_id AND l.user_id = @userId
        ORDER BY l.logged_at DESC, l.progress_id DESC
      ) latest_log
      WHERE lr.roadmap_id = @roadmapId AND lr.user_id = @userId
      ORDER BY rs.stage_order, rt.task_order;
    `);

  return result.recordset;
};
