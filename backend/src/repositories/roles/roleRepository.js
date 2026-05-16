import { getDatabasePool } from "../../config/database.js";

export const findRoleByName = async (roleName) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("roleName", roleName).query(`
    SELECT role_id, role_name, description
    FROM Roles
    WHERE role_name = @roleName;
  `);

  return result.recordset[0] || null;
};
