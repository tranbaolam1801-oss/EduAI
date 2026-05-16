import { getDatabasePool } from "../../config/database.js";

export const getCurrentRoadmapSummary = async (userId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("userId", userId).query(`
    SELECT TOP 1
      v.roadmap_id,
      lr.career_id,
      c.career_name,
      v.title,
      v.status,
      v.total_tasks,
      v.completed_tasks,
      v.progress_percent,
      v.total_estimated_hours,
      lr.expected_end_date,
      lr.created_at
    FROM vw_RoadmapProgressSummary v
    JOIN LearningRoadmaps lr ON lr.roadmap_id = v.roadmap_id
    LEFT JOIN Careers c ON c.career_id = lr.career_id
    WHERE v.user_id = @userId
    ORDER BY
      CASE lr.status
        WHEN N'ACTIVE' THEN 0
        WHEN N'DRAFT' THEN 1
        WHEN N'PAUSED' THEN 2
        WHEN N'COMPLETED' THEN 3
        ELSE 4
      END,
      lr.created_at DESC,
      lr.roadmap_id DESC;
  `);

  return result.recordset[0] || null;
};

export const getDashboardCounters = async (userId) => {
  const pool = await getDatabasePool();
  const [skillResult, studyResult, quizResult, notificationResult, challengeResult] = await Promise.all([
    pool.request().input("userId", userId).query(`
      SELECT
        COUNT(*) AS assessed_skills_count,
        CAST(AVG(CAST(current_level AS DECIMAL(10, 2))) AS DECIMAL(10, 2)) AS average_skill_level
      FROM UserSkills
      WHERE user_id = @userId;
    `),
    pool.request().input("userId", userId).query(`
      SELECT
        ISNULL(SUM(study_minutes), 0) AS total_study_minutes,
        COUNT(*) AS progress_logs_count,
        MAX(logged_at) AS latest_study_at
      FROM LearningProgressLogs
      WHERE user_id = @userId;
    `),
    pool.request().input("userId", userId).query(`
      SELECT
        COUNT(*) AS graded_quiz_count,
        CAST(AVG(CAST(score AS DECIMAL(10, 2))) AS DECIMAL(10, 2)) AS average_quiz_score,
        MAX(submitted_at) AS latest_quiz_at
      FROM vw_QuizResultSummary
      WHERE user_id = @userId;
    `),
    pool.request().input("userId", userId).query(`
      SELECT
        COUNT(*) AS total_notifications,
        SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END) AS unread_notifications
      FROM Notifications
      WHERE user_id = @userId;
    `),
    pool.request().input("userId", userId).query(`
      SELECT COUNT(*) AS joined_challenges_count
      FROM ChallengeParticipants
      WHERE user_id = @userId;
    `)
  ]);

  return {
    assessed_skills_count: Number(skillResult.recordset[0]?.assessed_skills_count || 0),
    average_skill_level: Number(skillResult.recordset[0]?.average_skill_level || 0),
    total_study_minutes: Number(studyResult.recordset[0]?.total_study_minutes || 0),
    progress_logs_count: Number(studyResult.recordset[0]?.progress_logs_count || 0),
    latest_study_at: studyResult.recordset[0]?.latest_study_at || null,
    graded_quiz_count: Number(quizResult.recordset[0]?.graded_quiz_count || 0),
    average_quiz_score: Number(quizResult.recordset[0]?.average_quiz_score || 0),
    latest_quiz_at: quizResult.recordset[0]?.latest_quiz_at || null,
    total_notifications: Number(notificationResult.recordset[0]?.total_notifications || 0),
    unread_notifications: Number(notificationResult.recordset[0]?.unread_notifications || 0),
    joined_challenges_count: Number(challengeResult.recordset[0]?.joined_challenges_count || 0)
  };
};

export const getTopUserSkills = async (userId, limit = 5) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("userId", userId).input("limit", limit).query(`
    SELECT TOP (@limit)
      us.user_id,
      us.skill_id,
      s.skill_name,
      us.current_level,
      us.confidence_level,
      us.source,
      us.last_assessed_at
    FROM UserSkills us
    JOIN Skills s ON s.skill_id = us.skill_id
    WHERE us.user_id = @userId
    ORDER BY us.current_level DESC, us.last_assessed_at DESC, s.skill_name;
  `);

  return result.recordset;
};

export const getTopSkillGapItems = async (userId, limit = 5) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("userId", userId).input("limit", limit).query(`
    SELECT TOP (@limit)
      career_id,
      career_name,
      skill_id,
      skill_name,
      current_level,
      required_level,
      gap_level,
      importance_weight
    FROM vw_SkillGapAnalysis
    WHERE user_id = @userId
      AND gap_level > 0
    ORDER BY gap_level DESC, importance_weight DESC, skill_name;
  `);

  return result.recordset;
};

export const getSkillGapSummary = async (userId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("userId", userId).query(`
    SELECT
      COUNT(*) AS total_skills,
      SUM(CASE WHEN gap_level > 0 THEN 1 ELSE 0 END) AS skills_with_gap,
      CAST(AVG(CAST(gap_level AS DECIMAL(10, 2))) AS DECIMAL(10, 2)) AS average_gap
    FROM vw_SkillGapAnalysis
    WHERE user_id = @userId;
  `);

  return {
    total_skills: Number(result.recordset[0]?.total_skills || 0),
    skills_with_gap: Number(result.recordset[0]?.skills_with_gap || 0),
    average_gap: Number(result.recordset[0]?.average_gap || 0)
  };
};

export const getRecentNotifications = async (userId, limit = 5) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("userId", userId).input("limit", limit).query(`
    SELECT TOP (@limit)
      notification_id,
      title,
      content,
      notification_type,
      is_read,
      created_at
    FROM Notifications
    WHERE user_id = @userId
    ORDER BY is_read ASC, created_at DESC, notification_id DESC;
  `);

  return result.recordset;
};

export const getUpcomingRoadmapTasks = async (userId, limit = 5) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("userId", userId).input("limit", limit).query(`
    SELECT TOP (@limit)
      rt.task_id,
      rt.skill_id,
      rt.task_title,
      rt.task_type,
      rt.description,
      rt.status,
      rt.due_date,
      rs.stage_id,
      rs.stage_name,
      lr.roadmap_id,
      lr.title AS roadmap_title,
      latest_log.progress_percent AS latest_progress_percent,
      latest_log.logged_at AS latest_logged_at
    FROM LearningRoadmaps lr
    JOIN RoadmapStages rs ON rs.roadmap_id = lr.roadmap_id
    JOIN RoadmapTasks rt ON rt.stage_id = rs.stage_id
    OUTER APPLY (
      SELECT TOP 1
        progress_percent,
        logged_at
      FROM LearningProgressLogs
      WHERE user_id = @userId
        AND task_id = rt.task_id
      ORDER BY logged_at DESC, progress_id DESC
    ) latest_log
    WHERE lr.user_id = @userId
      AND rt.status <> N'COMPLETED'
    ORDER BY
      CASE WHEN rt.status = N'IN_PROGRESS' THEN 0 ELSE 1 END,
      rt.due_date ASC,
      rs.stage_order ASC,
      rt.task_order ASC;
  `);

  return result.recordset;
};

export const getRoadmapProgressRows = async (userId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("userId", userId).query(`
    SELECT
      v.roadmap_id,
      lr.career_id,
      c.career_name,
      v.title,
      v.status,
      v.total_tasks,
      v.completed_tasks,
      v.progress_percent,
      v.total_estimated_hours,
      lr.expected_end_date,
      lr.created_at
    FROM vw_RoadmapProgressSummary v
    JOIN LearningRoadmaps lr ON lr.roadmap_id = v.roadmap_id
    LEFT JOIN Careers c ON c.career_id = lr.career_id
    WHERE v.user_id = @userId
    ORDER BY lr.created_at DESC, lr.roadmap_id DESC;
  `);

  return result.recordset;
};

export const getRecentProgressLogs = async (userId, limit = 10) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("userId", userId).input("limit", limit).query(`
    SELECT TOP (@limit)
      lpl.progress_id,
      lpl.user_id,
      lpl.task_id,
      lpl.progress_percent,
      lpl.study_minutes,
      lpl.note,
      lpl.logged_at,
      rt.task_title,
      rs.stage_name,
      lr.roadmap_id,
      lr.title AS roadmap_title
    FROM LearningProgressLogs lpl
    JOIN RoadmapTasks rt ON rt.task_id = lpl.task_id
    JOIN RoadmapStages rs ON rs.stage_id = rt.stage_id
    JOIN LearningRoadmaps lr ON lr.roadmap_id = rs.roadmap_id
    WHERE lpl.user_id = @userId
    ORDER BY lpl.logged_at DESC, lpl.progress_id DESC;
  `);

  return result.recordset;
};

export const getQuizSummary = async (userId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("userId", userId).query(`
    SELECT
      COUNT(*) AS attempts_count,
      CAST(AVG(CAST(score AS DECIMAL(10, 2))) AS DECIMAL(10, 2)) AS average_score,
      SUM(CASE WHEN result_status = N'PASS' THEN 1 ELSE 0 END) AS pass_count,
      SUM(CASE WHEN result_status = N'FAIL' THEN 1 ELSE 0 END) AS fail_count,
      MAX(submitted_at) AS latest_submitted_at
    FROM vw_QuizResultSummary
    WHERE user_id = @userId;
  `);

  return {
    attempts_count: Number(result.recordset[0]?.attempts_count || 0),
    average_score: Number(result.recordset[0]?.average_score || 0),
    pass_count: Number(result.recordset[0]?.pass_count || 0),
    fail_count: Number(result.recordset[0]?.fail_count || 0),
    latest_submitted_at: result.recordset[0]?.latest_submitted_at || null
  };
};

export const getQuizResultsBySkill = async (userId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("userId", userId).query(`
    SELECT
      skill_name,
      COUNT(*) AS attempts_count,
      CAST(AVG(CAST(score AS DECIMAL(10, 2))) AS DECIMAL(10, 2)) AS average_score,
      SUM(CASE WHEN result_status = N'PASS' THEN 1 ELSE 0 END) AS pass_count
    FROM vw_QuizResultSummary
    WHERE user_id = @userId
    GROUP BY skill_name
    ORDER BY average_score DESC, attempts_count DESC, skill_name;
  `);

  return result.recordset;
};

export const getRecentQuizResults = async (userId, limit = 10) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("userId", userId).input("limit", limit).query(`
    SELECT TOP (@limit)
      attempt_id,
      quiz_id,
      quiz_title,
      skill_name,
      started_at,
      submitted_at,
      score,
      passing_score,
      result_status,
      status
    FROM vw_QuizResultSummary
    WHERE user_id = @userId
    ORDER BY submitted_at DESC, attempt_id DESC;
  `);

  return result.recordset;
};
