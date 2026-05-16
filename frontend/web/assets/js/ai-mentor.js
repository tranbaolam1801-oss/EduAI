import { apiService } from "./api.js";
import {
  formatDateTime,
  getRecommendationTypeLabel,
  initializeLayout,
  renderEmptyState,
  renderStatusTag,
  serializeForm,
  setHtml,
  setText
} from "./layout.js";
import { loadMyProfile } from "./auth.js";

const view = initializeLayout({ pageKey: "ai-mentor", requireAuth: true });

if (view) {
  const refs = {
    statusTag: document.querySelector("#mentor-page-status-tag"),
    sessionForm: document.querySelector("#mentor-session-form"),
    sessionList: document.querySelector("#mentor-session-list"),
    recommendationList: document.querySelector("#mentor-recommendation-list"),
    activeSessionTitle: document.querySelector("#mentor-active-session-title"),
    messageList: document.querySelector("#mentor-message-list"),
    messageForm: document.querySelector("#mentor-message-form"),
    messageInput: document.querySelector("#mentor-message-input"),
    major: document.querySelector("#mentor-context-major"),
    goal: document.querySelector("#mentor-context-goal"),
    roadmap: document.querySelector("#mentor-context-roadmap"),
    skills: document.querySelector("#mentor-context-skills")
  };

  let selectedSessionId = null;

  const renderMessage = (message) => `
    <article class="mentor-message ${message.sender_type === "USER" ? "mentor-message--user" : ""}">
      <p>${message.message_content}</p>
      <small>${message.sender_type === "USER" ? "Bạn" : message.sender_type === "AI" ? "AI Mentor" : "Hệ thống"} • ${formatDateTime(message.created_at)}</small>
    </article>
  `;

  const ensureSession = async (messageContent) => {
    if (selectedSessionId) {
      return selectedSessionId;
    }

    const response = await apiService.createChatSession({
      title: messageContent.length > 60 ? `${messageContent.slice(0, 57)}...` : messageContent
    });

    selectedSessionId = response.data.session_id;
    return selectedSessionId;
  };

  const loadPage = async () => {
    try {
      const [profile, goalsResponse, roadmapsResponse, sessionsResponse, recommendationsResponse, userSkillsResponse] =
        await Promise.all([
          loadMyProfile(),
          apiService.getMyCareerGoals().catch(() => ({ data: [] })),
          apiService.getMyRoadmaps().catch(() => ({ data: [] })),
          apiService.getChatSessions().catch(() => ({ data: [] })),
          apiService.getMyRecommendations().catch(() => ({ data: [] })),
          apiService.getMyUserSkills().catch(() => ({ data: [] }))
        ]);

      const sessions = sessionsResponse.data;
      const recommendations = recommendationsResponse.data;
      const activeRoadmap = roadmapsResponse.data[0] || null;
      const selectedSession =
        sessions.find((session) => session.session_id === Number(selectedSessionId)) || sessions[0] || null;

      selectedSessionId = selectedSession?.session_id || null;

      const sessionDetail = selectedSessionId
        ? (await apiService.getChatSessionDetail(selectedSessionId).catch(() => ({ data: null }))).data
        : null;

      view.setQuickNote(
        selectedSession
          ? `Phiên hiện tại đang lưu ${sessionDetail?.messages?.length || 0} tin nhắn trong ChatMessages.`
          : "Tạo phiên mới hoặc gửi câu hỏi đầu tiên để bắt đầu trò chuyện với AI Mentor."
      );
      view.setMentorNote(
        recommendations[0]?.content ||
          "AI Mentor đang chờ ngữ cảnh từ hồ sơ, roadmap và câu hỏi mới để gợi ý bước học tiếp theo."
      );
      view.setMentorMetrics([
        { label: "Phiên chat", value: `${sessions.length}` },
        { label: "Gợi ý AI", value: `${recommendations.length}` },
        { label: "Roadmap", value: activeRoadmap?.career_name || "Đang chờ" }
      ]);

      setHtml(
        refs.statusTag,
        renderStatusTag(selectedSession ? "Đã sẵn sàng trò chuyện" : "Chưa có phiên chat", selectedSession ? "success" : "warning")
      );

      setHtml(
        refs.sessionList,
        sessions.length
          ? sessions
              .map(
                (session) => `
                  <article class="resource-card ${session.session_id === selectedSessionId ? "resource-card--active" : ""}">
                    <h4 class="job-card__title">${session.title || "Phiên trò chuyện mới"}</h4>
                    <p class="helper-text">${session.latest_message_content || "Chưa có tin nhắn nào"}</p>
                    <div class="resource-card__meta">
                      <span>${session.message_count} tin nhắn</span>
                      <strong>${session.latest_message_created_at ? formatDateTime(session.latest_message_created_at) : "Mới tạo"}</strong>
                    </div>
                    <div class="career-actions">
                      <button class="secondary-button" type="button" data-open-session="${session.session_id}">Mở phiên</button>
                    </div>
                  </article>
                `
              )
              .join("")
          : renderEmptyState("Chưa có phiên trò chuyện", "Tạo phiên mới để bắt đầu hỏi AI Mentor.")
      );

      setHtml(
        refs.recommendationList,
        recommendations.length
          ? recommendations
              .map(
                (recommendation) => `
                  <article class="resource-card">
                    <h4 class="job-card__title">${recommendation.title}</h4>
                    <p class="helper-text">${recommendation.content}</p>
                    <div class="resource-card__meta">
                      <span>${getRecommendationTypeLabel(recommendation.recommendation_type)}</span>
                      <strong>${recommendation.priority_score}</strong>
                    </div>
                  </article>
                `
              )
              .join("")
          : renderEmptyState("Chưa có gợi ý AI", "Hãy hoàn thiện hồ sơ hoặc trò chuyện với AI Mentor để hệ thống gợi ý nhiều hơn.")
      );

      setText(refs.activeSessionTitle, selectedSession?.title || "Chưa chọn phiên trò chuyện");
      setHtml(
        refs.messageList,
        sessionDetail?.messages?.length
          ? sessionDetail.messages.map(renderMessage).join("")
          : renderEmptyState("Chưa có tin nhắn", "Hãy gửi câu hỏi đầu tiên để AI Mentor phản hồi theo ngữ cảnh.")
      );

      setText(refs.major, profile?.major || "Chưa cập nhật hồ sơ");
      setText(refs.goal, goalsResponse.data[0]?.career_name || "Chưa lưu nghề mục tiêu");
      setText(refs.roadmap, activeRoadmap?.title || "Chưa có roadmap");
      setHtml(
        refs.skills,
        userSkillsResponse.data.length
          ? userSkillsResponse.data
              .slice(0, 5)
              .map((skill) => `<span class="glass-chip">${skill.skill_name}</span>`)
              .join("")
          : `<span class="glass-chip">Chưa có kỹ năng</span>`
      );
    } catch (error) {
      view.setMessage(error.message || "Không thể tải màn hình AI Mentor.", "error");
      setHtml(
        refs.messageList,
        renderEmptyState("Không tải được AI Mentor", "Kiểm tra lại backend, AI service hoặc phiên đăng nhập rồi thử lại.")
      );
    }
  };

  refs.sessionForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const payload = serializeForm(refs.sessionForm);
      const response = await apiService.createChatSession({
        title: payload.title || undefined
      });
      selectedSessionId = response.data.session_id;
      refs.sessionForm.reset();
      view.setMessage("Đã tạo phiên trò chuyện mới.", "success");
      await loadPage();
    } catch (error) {
      view.setMessage(error.message || "Không thể tạo phiên trò chuyện mới.", "error");
    }
  });

  refs.sessionList?.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.dataset.openSession) {
      return;
    }

    selectedSessionId = Number(target.dataset.openSession);
    await loadPage();
  });

  refs.messageForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const messageContent = refs.messageInput.value.trim();

    if (!messageContent) {
      view.setMessage("Hãy nhập câu hỏi trước khi gửi cho AI Mentor.", "error");
      return;
    }

    try {
      const sessionId = await ensureSession(messageContent);
      await apiService.sendChatMessage(sessionId, {
        message_content: messageContent
      });
      refs.messageForm.reset();
      view.setMessage("Đã gửi câu hỏi cho AI Mentor.", "success");
      await loadPage();
    } catch (error) {
      view.setMessage(error.message || "Không thể gửi câu hỏi cho AI Mentor.", "error");
    }
  });

  loadPage();
}
