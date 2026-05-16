import { appConfig, clearStoredSession, isAuthenticated, readCurrentUser } from "./api.js";

export const pageMeta = {
  dashboard: {
    label: "Tổng quan",
    title: "Tổng quan học tập",
    description: "Theo dõi tiến độ tổng thể, kỹ năng trọng tâm, lộ trình hiện tại và các thông báo học tập mới nhất."
  },
  onboarding: {
    label: "Khởi tạo hành trình",
    title: "Onboarding & hồ sơ học tập",
    description: "Đăng nhập, đăng ký và hoàn thiện hồ sơ nền tảng để bắt đầu hành trình học tập AI."
  },
  "skill-assessment": {
    label: "Đánh giá kỹ năng",
    title: "Đánh giá kỹ năng hiện tại",
    description: "Lưu mức độ kỹ năng, độ tự tin và nhận diện những mảng cần ưu tiên cải thiện."
  },
  "career-selection": {
    label: "Chọn nghề nghiệp",
    title: "Chọn nghề nghiệp mục tiêu",
    description: "Khám phá nghề nghiệp, lưu mục tiêu và xem bộ kỹ năng yêu cầu cho từng hướng đi."
  },
  "skill-gap": {
    label: "Khoảng cách kỹ năng",
    title: "Phân tích khoảng cách kỹ năng",
    description: "So sánh năng lực hiện tại với yêu cầu nghề mục tiêu dựa trên dữ liệu thật từ hệ thống."
  },
  "learning-path": {
    label: "Lộ trình học",
    title: "Lộ trình học cá nhân hóa",
    description: "Tạo và quản lý roadmap học tập bằng dữ liệu CareerSkills, UserSkills và stored procedure."
  },
  "progress-tracking": {
    label: "Tiến độ học tập",
    title: "Theo dõi tiến độ học tập",
    description: "Cập nhật tiến độ nhiệm vụ, thời gian học và lịch sử LearningProgressLogs."
  },
  resources: {
    label: "Tài liệu học tập",
    title: "Tài liệu học tập",
    description: "Lọc tài liệu theo kỹ năng, mức độ và gắn tài liệu trực tiếp vào nhiệm vụ học tập."
  },
  quiz: {
    label: "Bài kiểm tra",
    title: "Kiểm tra & đánh giá",
    description: "Tạo quiz theo kỹ năng, làm bài trực tiếp và lưu kết quả chấm điểm vào hệ thống."
  },
  "ai-mentor": {
    label: "AI Mentor",
    title: "AI Mentor",
    description: "Trò chuyện theo ngữ cảnh hồ sơ, roadmap và nhận gợi ý học tập có cấu trúc."
  },
  "job-opportunities": {
    label: "Cơ hội nghề nghiệp",
    title: "Cơ hội nghề nghiệp",
    description: "Khám phá cơ hội nghề nghiệp phù hợp với kỹ năng hiện có mà vẫn giữ trọng tâm là hành trình học tập."
  },
  community: {
    label: "Cộng đồng",
    title: "Cộng đồng & thử thách",
    description: "Tham gia thử thách học tập, theo dõi tiến độ cộng đồng và giữ nhịp học đều đặn."
  },
  reports: {
    label: "Báo cáo",
    title: "Thống kê & báo cáo",
    description: "Xem báo cáo học tập tổng hợp và đánh giá mức sẵn sàng nghề nghiệp dựa trên dữ liệu thật."
  }
};

export const pageRoutes = {
  dashboard: "dashboard.html",
  onboarding: "onboarding.html",
  "skill-assessment": "skill-assessment.html",
  "career-selection": "career-selection.html",
  "skill-gap": "skill-gap.html",
  "learning-path": "learning-path.html",
  "progress-tracking": "progress-tracking.html",
  resources: "resources.html",
  quiz: "quiz.html",
  "ai-mentor": "ai-mentor.html",
  "job-opportunities": "job-opportunities.html",
  community: "community.html",
  reports: "reports.html"
};

const pageAliases = [
  ["dashboard", ["tổng quan", "dashboard", "home"]],
  ["onboarding", ["onboarding", "khởi tạo", "hồ sơ"]],
  ["skill-assessment", ["kỹ năng", "đánh giá", "skill"]],
  ["career-selection", ["nghề nghiệp", "career", "mục tiêu"]],
  ["skill-gap", ["khoảng cách", "gap"]],
  ["learning-path", ["lộ trình", "roadmap"]],
  ["progress-tracking", ["tiến độ", "progress"]],
  ["resources", ["tài liệu", "resource", "khóa học"]],
  ["quiz", ["quiz", "bài kiểm tra"]],
  ["ai-mentor", ["mentor", "trợ lý"]],
  ["job-opportunities", ["việc làm", "job"]],
  ["community", ["cộng đồng", "thử thách"]],
  ["reports", ["báo cáo", "thống kê", "report"]]
];

const demandLabelMap = {
  HIGH: "Cao",
  MEDIUM: "Trung bình",
  LOW: "Thấp"
};

const goalStatusLabelMap = {
  ACTIVE: "Đang theo đuổi",
  PAUSED: "Tạm dừng",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy"
};

const roadmapStatusLabelMap = {
  DRAFT: "Nháp",
  ACTIVE: "Đang học",
  COMPLETED: "Hoàn thành",
  PAUSED: "Tạm dừng",
  CANCELLED: "Đã hủy"
};

const taskStatusLabelMap = {
  NOT_STARTED: "Chưa bắt đầu",
  IN_PROGRESS: "Đang học",
  COMPLETED: "Hoàn thành",
  SKIPPED: "Bỏ qua"
};

const difficultyLabelMap = {
  BASIC: "Cơ bản",
  INTERMEDIATE: "Trung bình",
  ADVANCED: "Nâng cao"
};

const resourceTypeLabelMap = {
  COURSE: "Khóa học",
  VIDEO: "Video",
  BOOK: "Sách",
  ARTICLE: "Bài viết",
  EXERCISE: "Bài tập",
  PROJECT: "Dự án",
  PODCAST: "Podcast"
};

const quizStatusLabelMap = {
  IN_PROGRESS: "Đang làm",
  SUBMITTED: "Đã nộp",
  GRADED: "Đã chấm"
};

const recommendationTypeLabelMap = {
  SKILL_GAP: "Khoảng cách kỹ năng",
  ROADMAP: "Lộ trình",
  RESOURCE: "Tài liệu",
  JOB: "Việc làm",
  MOTIVATION: "Động lực",
  REVIEW: "Ôn tập"
};

const workingTypeLabelMap = {
  FULL_TIME: "Toàn thời gian",
  PART_TIME: "Bán thời gian",
  INTERNSHIP: "Thực tập",
  REMOTE: "Từ xa",
  HYBRID: "Kết hợp"
};

const notificationTypeLabelMap = {
  SYSTEM: "Hệ thống",
  ROADMAP: "Lộ trình",
  QUIZ: "Quiz",
  JOB: "Việc làm",
  CHALLENGE: "Thử thách",
  AI: "AI Mentor"
};

const challengeStatusLabelMap = {
  OPEN: "Đang mở",
  CLOSED: "Đã đóng",
  DRAFT: "Nháp"
};

const challengeParticipantStatusLabelMap = {
  JOINED: "Đã tham gia",
  SUBMITTED: "Đã nộp",
  COMPLETED: "Hoàn thành"
};

const quizResultStatusLabelMap = {
  PASS: "Đạt",
  FAIL: "Chưa đạt"
};

export const formatNumber = (value) => Number(value || 0).toLocaleString("vi-VN");
export const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("vi-VN") : "Chưa có";
export const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString("vi-VN", { hour12: false }) : "Chưa có";
export const formatPercent = (value) => `${Math.round(Number(value || 0))}%`;
export const getDemandLabel = (value) => demandLabelMap[value] || "Chưa rõ";
export const getGoalStatusLabel = (value) => goalStatusLabelMap[value] || value || "Chưa rõ";
export const getRoadmapStatusLabel = (value) => roadmapStatusLabelMap[value] || value || "Chưa rõ";
export const getTaskStatusLabel = (value) => taskStatusLabelMap[value] || value || "Chưa rõ";
export const getDifficultyLabel = (value) => difficultyLabelMap[value] || value || "Chưa rõ";
export const getResourceTypeLabel = (value) => resourceTypeLabelMap[value] || value || "Khác";
export const getQuizStatusLabel = (value) => quizStatusLabelMap[value] || value || "Chưa rõ";
export const getRecommendationTypeLabel = (value) =>
  recommendationTypeLabelMap[value] || value || "Gợi ý";
export const getWorkingTypeLabel = (value) => workingTypeLabelMap[value] || value || "Khác";
export const getNotificationTypeLabel = (value) =>
  notificationTypeLabelMap[value] || value || "Thông báo";
export const getChallengeStatusLabel = (value) => challengeStatusLabelMap[value] || value || "Chưa rõ";
export const getChallengeParticipantStatusLabel = (value) =>
  challengeParticipantStatusLabelMap[value] || value || "Chưa rõ";
export const getQuizResultStatusLabel = (value) => quizResultStatusLabelMap[value] || value || "Chưa rõ";

export const renderStatusTag = (text, tone = "success") =>
  `<span class="status-tag status-tag--${tone}">${text}</span>`;

export const renderMetricCard = ({ label, value, trend, tone = "success" }) => `
  <article class="metric-card">
    <span class="helper-text">${label}</span>
    <strong>${value}</strong>
    <p class="metric-card__trend ${tone === "warning" ? "metric-card__trend--warning" : ""}">${trend}</p>
  </article>
`;

export const renderEmptyState = (title, description) => `
  <div class="empty-state">
    <h3 class="section-title">${title}</h3>
    <p class="section-subtitle">${description}</p>
  </div>
`;

export const buildOptions = (items, selectedValue, placeholder, valueKey, labelKey) => `
  <option value="">${placeholder}</option>
  ${items
    .map(
      (item) => `
        <option value="${item[valueKey]}" ${String(selectedValue ?? "") === String(item[valueKey]) ? "selected" : ""}>
          ${item[labelKey]}
        </option>
      `
    )
    .join("")}
`;

export const setText = (selectorOrElement, text) => {
  const element =
    typeof selectorOrElement === "string"
      ? document.querySelector(selectorOrElement)
      : selectorOrElement;

  if (element) {
    element.textContent = text;
  }
};

export const setHtml = (selectorOrElement, html) => {
  const element =
    typeof selectorOrElement === "string"
      ? document.querySelector(selectorOrElement)
      : selectorOrElement;

  if (element) {
    element.innerHTML = html;
  }
};

export const toggleHidden = (selectorOrElement, shouldHide) => {
  const element =
    typeof selectorOrElement === "string"
      ? document.querySelector(selectorOrElement)
      : selectorOrElement;

  if (element) {
    element.hidden = shouldHide;
  }
};

export const serializeForm = (formElement) => Object.fromEntries(new FormData(formElement).entries());

export const setInputValue = (selectorOrElement, value) => {
  const element =
    typeof selectorOrElement === "string"
      ? document.querySelector(selectorOrElement)
      : selectorOrElement;

  if (element) {
    element.value = value ?? "";
  }
};

export const setElementOptions = (selectElement, items, selectedValue, placeholder, valueKey, labelKey) => {
  if (!selectElement) {
    return;
  }

  selectElement.innerHTML = buildOptions(items, selectedValue, placeholder, valueKey, labelKey);
};

const isCompactViewport = () => window.innerWidth < 1200;

const setSidebarOpen = (appShell, toggleButton, isOpen) => {
  const shouldOpen = isCompactViewport() && isOpen;
  appShell.classList.toggle("app-shell--sidebar-open", shouldOpen);
  toggleButton?.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
  document.body.style.overflow = shouldOpen ? "hidden" : "";
};

const checkService = async (url, target, onlineText) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error();
    }

    target.textContent = onlineText;
    target.dataset.tone = "online";
  } catch (_error) {
    target.textContent = "Chưa kết nối";
    target.dataset.tone = "offline";
  }
};

const updateProfileBadge = (refs) => {
  const currentUser = readCurrentUser();
  const firstCharacter = currentUser?.full_name?.trim()?.charAt(0)?.toUpperCase() || "K";

  setText(refs.profileAvatar, firstCharacter);
  setText(refs.profileName, currentUser?.full_name || "Khách");
  setText(refs.profileRole, currentUser?.role === "STUDENT" ? "Sinh viên" : "Chưa đăng nhập");
};

const attachSearchNavigation = (formElement, inputElement) => {
  formElement?.addEventListener("submit", (event) => {
    event.preventDefault();
    const keyword = inputElement.value.trim().toLowerCase();

    if (!keyword) {
      return;
    }

    const match = pageAliases.find(([, aliases]) => aliases.some((alias) => keyword.includes(alias)));

    if (!match) {
      return;
    }

    window.location.href = `./${pageRoutes[match[0]]}`;
  });
};

export const initializeLayout = ({ pageKey, requireAuth = true }) => {
  if (requireAuth && !isAuthenticated()) {
    window.location.href = "./onboarding.html";
    return null;
  }

  const refs = {
    appShell: document.querySelector("#app-shell"),
    sidebarOverlay: document.querySelector("#sidebar-overlay"),
    sidebarToggle: document.querySelector("#sidebar-toggle"),
    messageBox: document.querySelector("#message-box"),
    quickNote: document.querySelector("#quick-note"),
    mentorSideNote: document.querySelector("#mentor-side-note"),
    mentorSideMetrics: document.querySelector("#mentor-side-metrics"),
    backendStatus: document.querySelector("#backend-status"),
    aiStatus: document.querySelector("#ai-status"),
    globalSearchForm: document.querySelector("#global-search-form"),
    globalSearchInput: document.querySelector("#global-search-input"),
    logoutButton: document.querySelector("#logout-button"),
    profileAvatar: document.querySelector("#profile-avatar"),
    profileName: document.querySelector("#profile-name"),
    profileRole: document.querySelector("#profile-role"),
    pageTitle: document.querySelector("#page-title"),
    pageDescription: document.querySelector("#page-description")
  };

  if (!refs.appShell) {
    return null;
  }

  document.querySelectorAll("[data-page]").forEach((link) => {
    link.classList.toggle("nav-item--active", link.dataset.page === pageKey);
  });

  if (refs.pageTitle && pageMeta[pageKey]) {
    refs.pageTitle.textContent = pageMeta[pageKey].title;
  }

  if (refs.pageDescription && pageMeta[pageKey]) {
    refs.pageDescription.textContent = pageMeta[pageKey].description;
  }

  const syncSidebar = () => {
    if (!isCompactViewport()) {
      setSidebarOpen(refs.appShell, refs.sidebarToggle, false);
    }
  };

  refs.sidebarToggle?.addEventListener("click", () => {
    const isOpen = refs.appShell.classList.contains("app-shell--sidebar-open");
    setSidebarOpen(refs.appShell, refs.sidebarToggle, !isOpen);
  });

  refs.sidebarOverlay?.addEventListener("click", () => setSidebarOpen(refs.appShell, refs.sidebarToggle, false));
  window.addEventListener("resize", syncSidebar);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setSidebarOpen(refs.appShell, refs.sidebarToggle, false);
    }
  });

  refs.logoutButton?.addEventListener("click", () => {
    clearStoredSession();
    window.location.href = "./onboarding.html";
  });

  attachSearchNavigation(refs.globalSearchForm, refs.globalSearchInput);
  updateProfileBadge(refs);
  checkService(`${appConfig.backendBaseUrl}/system/health`, refs.backendStatus, "Đang hoạt động");
  checkService(`${appConfig.aiServiceBaseUrl}/system/health`, refs.aiStatus, "Đang hoạt động");

  return {
    refs,
    pageMeta: pageMeta[pageKey],
    currentUser: readCurrentUser(),
    setMessage(text, tone = "info") {
      if (!refs.messageBox) {
        return;
      }

      refs.messageBox.textContent = text;
      refs.messageBox.dataset.tone = tone;
      refs.messageBox.hidden = false;
    },
    clearMessage() {
      if (!refs.messageBox) {
        return;
      }

      refs.messageBox.hidden = true;
      refs.messageBox.textContent = "";
      refs.messageBox.removeAttribute("data-tone");
    },
    setQuickNote(text) {
      setText(refs.quickNote, text);
    },
    setMentorNote(text) {
      setText(refs.mentorSideNote, text);
    },
    setMentorMetrics(items) {
      setHtml(
        refs.mentorSideMetrics,
        items
          .map(
            (item) => `
              <div class="mentor-metric">
                <span>${item.label}</span>
                <strong>${item.value}</strong>
              </div>
            `
          )
          .join("")
      );
    },
    updateProfileBadge() {
      updateProfileBadge(refs);
    }
  };
};
