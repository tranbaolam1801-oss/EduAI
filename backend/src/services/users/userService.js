import { AppError } from "../../models/common/appError.js";
import { findUserById } from "../../repositories/users/userRepository.js";

export const getCurrentUser = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("Không tìm thấy thông tin người dùng.", 404, "USER_NOT_FOUND");
  }

  return {
    user_id: user.user_id,
    full_name: user.full_name,
    email: user.email,
    phone: user.phone,
    role: user.role_name,
    status: user.status,
    created_at: user.created_at
  };
};
