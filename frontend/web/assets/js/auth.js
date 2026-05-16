import { apiService, clearStoredSession, isAuthenticated, saveSession } from "./api.js";

export const ensureAuthenticated = () => {
  if (isAuthenticated()) {
    return true;
  }

  window.location.href = "./onboarding.html";
  return false;
};

export const submitLogin = async (payload) => {
  const response = await apiService.login(payload);
  saveSession(response.data);
  return response.data;
};

export const submitRegister = async (payload) => {
  const response = await apiService.register(payload);
  saveSession(response.data);
  return response.data;
};

export const signOut = () => {
  clearStoredSession();
  window.location.href = "./onboarding.html";
};

export const loadMyProfile = async () => {
  try {
    const response = await apiService.getMyProfile();
    return response.data;
  } catch (error) {
    if (error.status === 404 || error.code === "PROFILE_NOT_FOUND") {
      return null;
    }

    throw error;
  }
};
