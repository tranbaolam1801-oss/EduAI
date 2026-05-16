export const appConfig = {
  backendBaseUrl: "http://localhost:3000/api/v1",
  aiServiceBaseUrl: "http://localhost:8000/api/v1",
  authStorageKey: "eduai_access_token",
  userStorageKey: "eduai_current_user"
};

export const readToken = () => window.localStorage.getItem(appConfig.authStorageKey);
export const readCurrentUser = () =>
  JSON.parse(window.localStorage.getItem(appConfig.userStorageKey) || "null");

export const saveSession = ({ access_token: accessToken, user }) => {
  window.localStorage.setItem(appConfig.authStorageKey, accessToken);
  window.localStorage.setItem(appConfig.userStorageKey, JSON.stringify(user));
};

export const clearStoredSession = () => {
  window.localStorage.removeItem(appConfig.authStorageKey);
  window.localStorage.removeItem(appConfig.userStorageKey);
};

export const isAuthenticated = () => Boolean(readToken() && readCurrentUser());

const buildHeaders = (customHeaders = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...customHeaders
  };

  const token = readToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(payload?.error?.message || "Yêu cầu thất bại.");
    error.status = response.status;
    error.code = payload?.error?.code;
    error.details = payload?.error?.details || [];
    throw error;
  }

  return payload;
};

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }

    searchParams.set(key, value);
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

const request = async (path, method = "GET", body) => {
  const response = await fetch(`${appConfig.backendBaseUrl}${path}`, {
    method,
    headers: buildHeaders(),
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  return parseResponse(response);
};

export const apiService = {
  register: (payload) => request("/auth/register", "POST", payload),
  login: (payload) => request("/auth/login", "POST", payload),
  getMe: () => request("/users/me"),
  createProfile: (payload) => request("/profiles", "POST", payload),
  getMyProfile: () => request("/profiles/me"),
  updateMyProfile: (payload) => request("/profiles/me", "PUT", payload),
  getAcademicFields: () => request("/academic-fields"),
  getSkillCategories: () => request("/skill-categories"),
  getSkills: (params = {}) => request(`/skills${buildQueryString(params)}`),
  saveUserSkill: (payload) => request("/user-skills", "POST", payload),
  getMyUserSkills: () => request("/user-skills/me"),
  getCareers: (params = {}) => request(`/careers${buildQueryString(params)}`),
  getCareerDetail: (careerId) => request(`/careers/${careerId}`),
  saveCareerGoal: (payload) => request("/career-goals", "POST", payload),
  getMyCareerGoals: () => request("/career-goals/me"),
  getSkillGap: (careerId) => request(`/skill-gap?career_id=${careerId}`),
  generateRoadmap: (payload) => request("/roadmaps/generate", "POST", payload),
  getMyRoadmaps: () => request("/roadmaps/me"),
  getRoadmapDetail: (roadmapId) => request(`/roadmaps/${roadmapId}`),
  getRoadmapStages: (roadmapId) => request(`/roadmaps/${roadmapId}/stages`),
  getRoadmapTask: (taskId) => request(`/roadmap-tasks/${taskId}`),
  updateRoadmapTaskProgress: (taskId, payload) =>
    request(`/roadmap-tasks/${taskId}/progress`, "PATCH", payload),
  getResources: (params = {}) => request(`/resources${buildQueryString(params)}`),
  getRecommendedResources: (params = {}) =>
    request(`/resources/recommend${buildQueryString(params)}`),
  attachTaskResource: (payload) => request("/task-resources", "POST", payload),
  getQuizzes: (params = {}) => request(`/quizzes${buildQueryString(params)}`),
  generateQuiz: (payload) => request("/quizzes/generate", "POST", payload),
  getQuizDetail: (quizId) => request(`/quizzes/${quizId}`),
  createQuizAttempt: (payload) => request("/quiz-attempts", "POST", payload),
  submitQuizAttempt: (attemptId, payload) => request(`/quiz-attempts/${attemptId}/submit`, "POST", payload),
  getMyQuizAttempts: () => request("/quiz-attempts/me"),
  createChatSession: (payload = {}) => request("/chat/sessions", "POST", payload),
  getChatSessions: () => request("/chat/sessions"),
  getChatSessionDetail: (sessionId) => request(`/chat/sessions/${sessionId}`),
  sendChatMessage: (sessionId, payload) => request(`/chat/sessions/${sessionId}/messages`, "POST", payload),
  getMyRecommendations: () => request("/recommendations/me"),
  getJobs: (params = {}) => request(`/jobs${buildQueryString(params)}`),
  getRecommendedJobs: (params = {}) => request(`/jobs/recommend${buildQueryString(params)}`),
  getCompanyDetail: (companyId) => request(`/companies/${companyId}`),
  saveJob: (payload) => request("/saved-jobs", "POST", payload),
  getMySavedJobs: () => request("/saved-jobs/me"),
  getAnalyticsDashboard: () => request("/analytics/dashboard"),
  getAnalyticsSkillGap: () => request("/analytics/skill-gap"),
  getAnalyticsRoadmapProgress: () => request("/analytics/roadmap-progress"),
  getAnalyticsQuizResults: () => request("/analytics/quiz-results"),
  getChallenges: (params = {}) => request(`/challenges${buildQueryString(params)}`),
  getChallengeDetail: (challengeId) => request(`/challenges/${challengeId}`),
  joinChallenge: (challengeId) => request(`/challenges/${challengeId}/join`, "POST"),
  getMyChallenges: () => request("/challenges/me"),
  getMyNotifications: (params = {}) => request(`/notifications/me${buildQueryString(params)}`),
  markNotificationRead: (notificationId) => request(`/notifications/${notificationId}/read`, "PATCH"),
  markAllNotificationsRead: () => request("/notifications/read-all", "PATCH"),
  getLearningSummaryReport: () => request("/reports/learning-summary"),
  getCareerReadinessReport: () => request("/reports/career-readiness")
};
