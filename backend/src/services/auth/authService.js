import { AppError } from "../../models/common/appError.js";
import { findRoleByName } from "../../repositories/roles/roleRepository.js";
import {
  createUser,
  findUserByEmail,
  findUserById,
  incrementFailedLoginCount,
  resetLoginFailureState
} from "../../repositories/users/userRepository.js";
import { hashPassword, verifyPassword } from "../../utils/security/passwordService.js";
import { signAccessToken } from "./tokenService.js";

const toAuthPayload = (user) => ({
  user_id: user.user_id,
  full_name: user.full_name,
  email: user.email,
  role: user.role_name
});

export const register = async ({ full_name: fullName, email, password, phone }) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError("Email đã được sử dụng.", 409, "EMAIL_ALREADY_EXISTS");
  }

  const studentRole = await findRoleByName("STUDENT");

  if (!studentRole) {
    throw new AppError("Không tìm thấy vai trò sinh viên trong hệ thống.", 500, "ROLE_NOT_FOUND");
  }

  const passwordHash = await hashPassword(password);
  const createdUser = await createUser({
    roleId: studentRole.role_id,
    fullName,
    email,
    passwordHash,
    phone
  });
  const user = await findUserById(createdUser.user_id);
  const accessToken = signAccessToken(toAuthPayload(user));

  return {
    access_token: accessToken,
    user: toAuthPayload(user)
  };
};

export const login = async ({ email, password }) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError("Email hoặc mật khẩu không đúng.", 401, "INVALID_CREDENTIALS");
  }

  if (user.status !== "ACTIVE") {
    throw new AppError("Tài khoản hiện không hoạt động.", 403, "ACCOUNT_INACTIVE");
  }

  if (user.locked_until && new Date(user.locked_until) > new Date()) {
    throw new AppError("Tài khoản đang bị khóa tạm thời.", 403, "ACCOUNT_LOCKED");
  }

  const isPasswordValid = await verifyPassword(password, user.password_hash);

  if (!isPasswordValid) {
    await incrementFailedLoginCount(user.user_id);
    throw new AppError("Email hoặc mật khẩu không đúng.", 401, "INVALID_CREDENTIALS");
  }

  await resetLoginFailureState(user.user_id);
  const accessToken = signAccessToken(toAuthPayload(user));

  return {
    access_token: accessToken,
    user: toAuthPayload(user)
  };
};
