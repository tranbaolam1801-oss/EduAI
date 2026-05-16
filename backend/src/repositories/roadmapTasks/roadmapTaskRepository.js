import { getDatabasePool } from "../../config/database.js";

export const findRoadmapTaskByIdAndUserId = async (taskId, userId) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("taskId", taskId)
    .input("userId", userId)
    .query(`
      SELECT
        rt.task_id,
        rt.stage_id,
        rs.roadmap_id,
        lr.title AS roadmap_title,
        rs.stage_name,
        rs.stage_order,
        rt.skill_id,
        s.skill_name,
        rt.task_order,
        rt.task_title,
        rt.task_type,
        rt.description,
        rt.estimated_hours,
        rt.status,
        rt.due_date,
        rt.completed_at,
        latest_log.progress_percent AS latest_progress_percent,
        latest_log.study_minutes AS latest_study_minutes,
        latest_log.note AS latest_note,
        latest_log.logged_at AS latest_logged_at
      FROM RoadmapTasks rt
      JOIN RoadmapStages rs ON rs.stage_id = rt.stage_id
      JOIN LearningRoadmaps lr ON lr.roadmap_id = rs.roadmap_id
      LEFT JOIN Skills s ON s.skill_id = rt.skill_id
      OUTER APPLY (
        SELECT TOP 1
          l.progress_percent,
          l.study_minutes,
          l.note,
          l.logged_at
        FROM LearningProgressLogs l
        WHERE l.task_id = rt.task_id AND l.user_id = @userId
        ORDER BY l.logged_at DESC, l.progress_id DESC
      ) latest_log
      WHERE rt.task_id = @taskId AND lr.user_id = @userId;
    `);

  return result.recordset[0] || null;
};

export const getTaskProgressLogsByTaskIdAndUserId = async (taskId, userId) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("taskId", taskId)
    .input("userId", userId)
    .query(`
      SELECT
        progress_id,
        user_id,
        task_id,
        progress_percent,
        study_minutes,
        note,
        logged_at
      FROM LearningProgressLogs
      WHERE task_id = @taskId AND user_id = @userId
      ORDER BY logged_at DESC, progress_id DESC;
    `);

  return result.recordset;
};

export const updateTaskProgress = async ({
  userId,
  taskId,
  progressPercent,
  studyMinutes,
  note
}) => {
  const pool = await getDatabasePool();
  await pool
    .request()
    .input("user_id", userId)
    .input("task_id", taskId)
    .input("progress_percent", progressPercent)
    .input("study_minutes", studyMinutes ?? 0)
    .input("note", note ?? null)
    .execute("sp_UpdateTaskProgress");

  return findRoadmapTaskByIdAndUserId(taskId, userId);
};

export const getTaskResourcesByTaskId = async (taskId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("taskId", taskId).query(`
    SELECT
      tr.task_id,
      tr.resource_id,
      tr.priority_order,
      lr.skill_id,
      s.skill_name,
      lr.title,
      lr.resource_type,
      lr.provider,
      lr.url,
      lr.difficulty_level,
      lr.estimated_hours,
      lr.rating,
      lr.is_free
    FROM TaskResources tr
    JOIN LearningResources lr ON lr.resource_id = tr.resource_id
    LEFT JOIN Skills s ON s.skill_id = lr.skill_id
    WHERE tr.task_id = @taskId
    ORDER BY tr.priority_order, lr.rating DESC, lr.title;
  `);

  return result.recordset;
};
