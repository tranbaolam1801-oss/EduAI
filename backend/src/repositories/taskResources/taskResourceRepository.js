import { getDatabasePool } from "../../config/database.js";

export const findTaskResourceLink = async (taskId, resourceId) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("taskId", taskId)
    .input("resourceId", resourceId)
    .query(`
      SELECT
        task_id,
        resource_id,
        priority_order
      FROM TaskResources
      WHERE task_id = @taskId AND resource_id = @resourceId;
    `);

  return result.recordset[0] || null;
};

export const createTaskResourceLink = async ({ taskId, resourceId, priorityOrder }) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("taskId", taskId)
    .input("resourceId", resourceId)
    .input("priorityOrder", priorityOrder)
    .query(`
      INSERT INTO TaskResources (
        task_id,
        resource_id,
        priority_order
      )
      OUTPUT
        INSERTED.task_id,
        INSERTED.resource_id,
        INSERTED.priority_order
      VALUES (
        @taskId,
        @resourceId,
        @priorityOrder
      );
    `);

  return result.recordset[0];
};
