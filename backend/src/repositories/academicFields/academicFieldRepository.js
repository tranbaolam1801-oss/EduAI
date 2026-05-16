import { getDatabasePool } from "../../config/database.js";

export const getAcademicFields = async () => {
  const pool = await getDatabasePool();
  const result = await pool.request().query(`
    SELECT field_id, field_name, description
    FROM AcademicFields
    ORDER BY field_name;
  `);

  return result.recordset;
};

export const findAcademicFieldById = async (fieldId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("fieldId", fieldId).query(`
    SELECT field_id, field_name, description
    FROM AcademicFields
    WHERE field_id = @fieldId;
  `);

  return result.recordset[0] || null;
};
