import { getDatabasePool } from "../../config/database.js";

export const findUserByEmail = async (email) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("email", email)
    .query(`
      SELECT user_id, role_id, full_name, email, password_hash, status
      FROM Users
      WHERE email = @email;
    `);

  return result.recordset[0] || null;
};
