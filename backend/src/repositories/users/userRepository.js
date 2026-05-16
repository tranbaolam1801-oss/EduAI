import { getDatabasePool } from "../../config/database.js";

export const createUser = async ({ roleId, fullName, email, passwordHash, phone }) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("roleId", roleId)
    .input("fullName", fullName)
    .input("email", email)
    .input("passwordHash", passwordHash)
    .input("phone", phone ?? null)
    .query(`
      INSERT INTO Users (role_id, full_name, email, password_hash, phone)
      OUTPUT
        INSERTED.user_id,
        INSERTED.role_id,
        INSERTED.full_name,
        INSERTED.email,
        INSERTED.phone,
        INSERTED.status,
        INSERTED.created_at
      VALUES (@roleId, @fullName, @email, @passwordHash, @phone);
    `);

  return result.recordset[0];
};

export const findUserByEmail = async (email) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("email", email).query(`
    SELECT
      u.user_id,
      u.role_id,
      r.role_name,
      u.full_name,
      u.email,
      u.password_hash,
      u.phone,
      u.status,
      u.failed_login_count,
      u.locked_until,
      u.created_at
    FROM Users u
    JOIN Roles r ON r.role_id = u.role_id
    WHERE u.email = @email;
  `);

  return result.recordset[0] || null;
};

export const findUserById = async (userId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("userId", userId).query(`
    SELECT
      u.user_id,
      u.role_id,
      r.role_name,
      u.full_name,
      u.email,
      u.phone,
      u.status,
      u.failed_login_count,
      u.locked_until,
      u.created_at,
      u.updated_at
    FROM Users u
    JOIN Roles r ON r.role_id = u.role_id
    WHERE u.user_id = @userId;
  `);

  return result.recordset[0] || null;
};

export const incrementFailedLoginCount = async (userId) => {
  const pool = await getDatabasePool();
  await pool.request().input("userId", userId).query(`
    UPDATE Users
    SET failed_login_count = failed_login_count + 1,
        updated_at = SYSDATETIME()
    WHERE user_id = @userId;
  `);
};

export const resetLoginFailureState = async (userId) => {
  const pool = await getDatabasePool();
  await pool.request().input("userId", userId).query(`
    UPDATE Users
    SET failed_login_count = 0,
        locked_until = NULL,
        updated_at = SYSDATETIME()
    WHERE user_id = @userId;
  `);
};
