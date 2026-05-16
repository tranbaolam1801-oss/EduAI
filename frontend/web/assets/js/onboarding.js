import { apiService, isAuthenticated, readCurrentUser } from "./api.js";
import { loadMyProfile, submitLogin, submitRegister } from "./auth.js";
import {
  initializeLayout,
  renderStatusTag,
  setElementOptions,
  setText,
  serializeForm,
  setInputValue,
  toggleHidden
} from "./layout.js";

const view = initializeLayout({ pageKey: "onboarding", requireAuth: false });

if (view) {
  const refs = {
    heroTitle: document.querySelector("#onboarding-hero-title"),
    statusTag: document.querySelector("#onboarding-status-tag"),
    profileSection: document.querySelector("#onboarding-profile-section"),
    authSection: document.querySelector("#onboarding-auth-section"),
    accountSection: document.querySelector("#onboarding-account-section"),
    profileForm: document.querySelector("#profile-form"),
    profileFieldSelect: document.querySelector("#profile-field-select"),
    profileSubmitButton: document.querySelector("#profile-submit-button"),
    registerForm: document.querySelector("#register-form"),
    loginForm: document.querySelector("#login-form"),
    accountEmail: document.querySelector("#onboarding-account-email"),
    profileStatus: document.querySelector("#onboarding-profile-status")
  };

  let currentProfile = null;

  const normalizeProfilePayload = (payload) => ({
    field_id: payload.field_id ? Number(payload.field_id) : null,
    university: payload.university || null,
    major: payload.major || null,
    academic_year: payload.academic_year ? Number(payload.academic_year) : null,
    current_level: payload.current_level || null,
    study_hours_per_week: payload.study_hours_per_week ? Number(payload.study_hours_per_week) : null,
    target_completion_months: payload.target_completion_months ? Number(payload.target_completion_months) : null,
    preferred_location: payload.preferred_location || null,
    career_goal_note: payload.career_goal_note || null
  });

  const fillProfileForm = (profile) => {
    setInputValue(refs.profileForm.elements.university, profile?.university);
    setInputValue(refs.profileForm.elements.major, profile?.major);
    setInputValue(refs.profileForm.elements.academic_year, profile?.academic_year);
    setInputValue(refs.profileForm.elements.current_level, profile?.current_level);
    setInputValue(refs.profileForm.elements.study_hours_per_week, profile?.study_hours_per_week);
    setInputValue(refs.profileForm.elements.target_completion_months, profile?.target_completion_months);
    setInputValue(refs.profileForm.elements.preferred_location, profile?.preferred_location);
    setInputValue(refs.profileForm.elements.career_goal_note, profile?.career_goal_note);
  };

  const loadPage = async () => {
    try {
      const academicFields = (await apiService.getAcademicFields()).data;
      const currentUser = readCurrentUser();
      currentProfile = isAuthenticated() ? await loadMyProfile() : null;

      setElementOptions(
        refs.profileFieldSelect,
        academicFields,
        currentProfile?.field_id,
        "Chọn lĩnh vực học tập",
        "field_id",
        "field_name"
      );

      const hasSession = Boolean(currentUser);

      toggleHidden(refs.authSection, hasSession);
      toggleHidden(refs.profileSection, !hasSession);
      toggleHidden(refs.accountSection, !hasSession);

      setText(
        refs.heroTitle,
        hasSession ? "Hoàn thiện hồ sơ học tập" : "Tạo tài khoản và bắt đầu hành trình"
      );
      refs.statusTag.innerHTML = renderStatusTag(
        hasSession ? "Đã có phiên đăng nhập" : "Chưa đăng nhập",
        hasSession ? "success" : "warning"
      );

      view.setQuickNote(
        hasSession
          ? "Bạn đã có tài khoản. Hoàn thiện hồ sơ học tập để mở khóa skill gap và lộ trình cá nhân hóa."
          : "Tạo tài khoản hoặc đăng nhập để bắt đầu hành trình học tập AI."
      );
      view.setMentorNote(
        hasSession
          ? "AI Mentor đang chờ hồ sơ nền tảng để cá nhân hóa gợi ý học tập đầu tiên cho bạn."
          : "Đăng nhập trước để AI Mentor có thể hiểu ngữ cảnh và lưu tiến trình học tập."
      );
      view.setMentorMetrics([
        { label: "Trạng thái tài khoản", value: hasSession ? "Đã đăng nhập" : "Khách" },
        { label: "Hồ sơ học tập", value: currentProfile ? "Đã cập nhật" : "Chưa hoàn tất" },
        { label: "Bước tiếp theo", value: currentProfile ? "Chuyển sang đánh giá kỹ năng" : "Điền thông tin hồ sơ" }
      ]);

      if (hasSession) {
        fillProfileForm(currentProfile);
        setText(refs.accountEmail, currentUser.email);
        setText(
          refs.profileStatus,
          currentProfile ? "Đã sẵn sàng cho Phase 2 và 3" : "Chưa đầy đủ, cần cập nhật thêm"
        );
        setText(refs.profileSubmitButton, currentProfile ? "Cập nhật hồ sơ" : "Lưu hồ sơ");
      }
    } catch (error) {
      view.setMessage(error.message || "Không thể tải dữ liệu onboarding.", "error");
    }
  };

  refs.registerForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    view.clearMessage();

    try {
      await submitRegister(serializeForm(refs.registerForm));
      window.location.reload();
    } catch (error) {
      view.setMessage(error.message || "Không thể đăng ký tài khoản.", "error");
    }
  });

  refs.loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    view.clearMessage();

    try {
      await submitLogin(serializeForm(refs.loginForm));
      window.location.reload();
    } catch (error) {
      view.setMessage(error.message || "Không thể đăng nhập.", "error");
    }
  });

  refs.profileForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    view.clearMessage();

    try {
      const payload = normalizeProfilePayload(serializeForm(refs.profileForm));

      if (currentProfile) {
        await apiService.updateMyProfile(payload);
        view.setMessage("Cập nhật hồ sơ học tập thành công.", "success");
      } else {
        await apiService.createProfile(payload);
        view.setMessage("Tạo hồ sơ học tập thành công.", "success");
      }

      await loadPage();
    } catch (error) {
      view.setMessage(error.message || "Không thể lưu hồ sơ học tập.", "error");
    }
  });

  loadPage();
}
