import { getDatabasePool } from "../../config/database.js";

export const findCareerGoalByUserAndCareer = async (userId, careerId) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("userId", userId)
    .input("careerId", careerId)
    .query(`
      SELECT goal_id, user_id, career_id, priority_order, target_deadline, status, created_at
      FROM UserCareerGoals
      WHERE user_id = @userId AND career_id = @careerId;
    `);

  return result.recordset[0] || null;
};

export const createCareerGoal = async ({
  userId,
  careerId,
  priorityOrder,
  targetDeadline,
  status
}) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("userId", userId)
    .input("careerId", careerId)
    .input("priorityOrder", priorityOrder)
    .input("targetDeadline", targetDeadline ?? null)
    .input("status", status)
    .query(`
      INSERT INTO UserCareerGoals (user_id, career_id, priority_order, target_deadline, status)
      OUTPUT
        INSERTED.goal_id,
        INSERTED.user_id,
        INSERTED.career_id,
        INSERTED.priority_order,
        INSERTED.target_deadline,
        INSERTED.status,
        INSERTED.created_at
      VALUES (@userId, @careerId, @priorityOrder, @targetDeadline, @status);
    `);

  return result.recordset[0];
};

export const updateCareerGoal = async ({
  goalId,
  priorityOrder,
  targetDeadline,
  status
}) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("goalId", goalId)
    .input("priorityOrder", priorityOrder)
    .input("targetDeadline", targetDeadline ?? null)
    .input("status", status)
    .query(`
      UPDATE UserCareerGoals
      SET priority_order = @priorityOrder,
          target_deadline = @targetDeadline,
          status = @status
      OUTPUT
        INSERTED.goal_id,
        INSERTED.user_id,
        INSERTED.career_id,
        INSERTED.priority_order,
        INSERTED.target_deadline,
        INSERTED.status,
        INSERTED.created_at
      WHERE goal_id = @goalId;
    `);

  return result.recordset[0] || null;
};

export const getCareerGoalsByUserId = async (userId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("userId", userId).query(`
    SELECT
      ucg.goal_id,
      ucg.user_id,
      ucg.career_id,
      c.career_name,
      c.market_demand_level,
      ucg.priority_order,
      ucg.target_deadline,
      ucg.status,
      ucg.created_at
    FROM UserCareerGoals ucg
    JOIN Careers c ON c.career_id = ucg.career_id
    WHERE ucg.user_id = @userId
    ORDER BY ucg.priority_order, ucg.created_at DESC;
  `);

  return result.recordset;
};
