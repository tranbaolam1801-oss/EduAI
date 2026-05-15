import { checkDatabaseConnection } from "../../config/database.js";

export const getDatabaseHealth = async () => {
  try {
    await checkDatabaseConnection();
    return {
      status: "connected"
    };
  } catch (error) {
    return {
      status: "disconnected",
      message: error.message
    };
  }
};
