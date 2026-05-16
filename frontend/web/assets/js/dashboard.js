import { apiService } from "./api.js";
import {
  getChallengeParticipantStatusLabel,
  formatDate,
  formatDateTime,
  formatPercent,
  getNotificationTypeLabel,
  getRoadmapStatusLabel,
  initializeLayout,
  renderEmptyState,
  renderMetricCard,
  renderStatusTag,
  setHtml,
  setText
} from "./layout.js";

const view = initializeLayout({ pageKey: "dashboard", requireAuth: true });

if (view) {
  const refs = {
    metrics: document.querySelector("#dashboard-metrics"),
    heroCareer: document.querySelector("#dashboard-hero-career"),
    heroRoadmap: document.querySelector("#dashboard-hero-roadmap"),
    heroStatus: document.querySelector("#dashboard-hero-status"),
    heroMajor: document.querySelector("#dashboard-hero-major"),
    heroLocation: document.querySelector("#dashboard-hero-location"),
    heroDate: document.querySelector("#dashboard-hero-date"),
    timeline: document.querySelector("#dashboard-timeline"),
    topSkills: document.querySelector("#dashboard-top-skills"),
    focusTask: document.querySelector("#dashboard-focus-task"),
    focusGap: document.querySelector("#dashboard-focus-gap"),
    nextStep: document.querySelector("#dashboard-next-step"),
    resources: document.querySelector("#dashboard-recommended-resources"),
    notifications: document.querySelector("#dashboard-notifications"),
    readAllButton: document.querySelector("#dashboard-read-all-notifications"),
    challenges: document.querySelector("#dashboard-challenges")
  };

  const renderTimeline = (tasks = []) => {
    if (!tasks.length) {
      setHtml(
        refs.timeline,
        renderEmptyState("Chưa có roadmap đang hoạt động", "Hãy tạo roadmap để hệ thống hiển thị các nhiệm vụ tiếp theo.")
      );
      return;
    }

    setHtml(
      refs.timeline,
      `
        <div class="roadmap-hero__timeline">
          ${tasks
            .slice(0, 4)
            .map(
              (task) => `
                <article class="timeline-step ${task.status === "COMPLETED" ? "timeline-step--done" : task.status === "IN_PROGRESS" ? "timeline-step--active" : ""}">
                  <h4>${task.stage_name}</h4>
                  <p class="helper-text">${task.task_title}</p>
                </article>
              `
            )
            .join("")}
        </div>
      `
    );
  };

  const renderTopSkills = (skills = []) => {
    if (!skills.length) {
      setHtml(
        refs.topSkills,
        renderEmptyState("Chưa có kỹ năng", "Hãy sang trang Đánh giá kỹ năng để lưu mức độ hiện tại.")
      );
      return;
    }

    setHtml(
      refs.topSkills,
      skills
        .map(
          (skill) => `
            <div class="chart-bar">
              <div class="chart-bar__row">
                <span>${skill.skill_name}</span>
                <strong>${formatPercent(skill.current_level)}</strong>
              </div>
              <span style="width:${skill.current_level}%"></span>
            </div>
          `
        )
        .join("")
    );
  };

  const renderResources = (items = []) => {
    if (!items.length) {
      setHtml(
        refs.resources,
        renderEmptyState("Chưa có tài liệu ưu tiên", "Hệ thống chưa tìm thấy tài liệu phù hợp cho trạng thái hiện tại.")
      );
      return;
    }

    setHtml(
      refs.resources,
      items
        .map(
          (resource) => `
            <article class="resource-card">
              <h4 class="job-card__title">${resource.title}</h4>
              <div class="resource-card__meta">
                <span>${resource.provider || resource.resource_type || "Tài liệu"}</span>
                <strong>${Number(resource.rating || 0).toFixed(1)} / 5</strong>
              </div>
              <p class="helper-text">${resource.url || "Tài liệu được đề xuất theo tiến độ hiện tại."}</p>
            </article>
          `
        )
        .join("")
    );
  };

  const renderNotifications = (items = []) => {
    if (!items.length) {
      setHtml(
        refs.notifications,
        renderEmptyState("Chưa có thông báo", "Khi roadmap, challenge hoặc quiz có thay đổi, thông báo sẽ hiển thị ở đây.")
      );
      return;
    }

    setHtml(
      refs.notifications,
      items
        .map(
          (notification) => `
            <article class="resource-card ${notification.is_read ? "" : "resource-card--active"}">
              <h4 class="job-card__title">${notification.title}</h4>
              <p class="helper-text">${notification.content || "Không có nội dung bổ sung."}</p>
              <div class="resource-card__meta">
                <span>${getNotificationTypeLabel(notification.notification_type)}</span>
                <strong>${formatDateTime(notification.created_at)}</strong>
              </div>
              <div class="career-actions">
                <button class="secondary-button" type="button" data-read-notification="${notification.notification_id}" ${notification.is_read ? "disabled" : ""}>Đánh dấu đã đọc</button>
              </div>
            </article>
          `
        )
        .join("")
    );
  };

  const renderChallenges = (items = []) => {
    if (!items.length) {
      setHtml(
        refs.challenges,
        renderEmptyState("Chưa tham gia challenge nào", "Tham gia thử thách phù hợp để duy trì động lực, nhưng vẫn ưu tiên roadmap là trung tâm.")
      );
      return;
    }

    setHtml(
      refs.challenges,
      items
        .map(
          (challenge) => `
            <article class="resource-card">
              <h4 class="job-card__title">${challenge.title}</h4>
              <p class="helper-text">${challenge.skill_name || "Không gắn kỹ năng"} • ${formatDate(challenge.end_date)}</p>
              <div class="resource-card__meta">
                <span>${getChallengeParticipantStatusLabel(challenge.participant_status)}</span>
                <strong>${challenge.score}/${challenge.max_score}</strong>
              </div>
            </article>
          `
        )
        .join("")
    );
  };

  const loadPage = async () => {
    try {
      const [dashboardResponse, roadmapResponse, quizResponse, notificationsResponse, challengesResponse] = await Promise.all([
        apiService.getAnalyticsDashboard(),
        apiService.getAnalyticsRoadmapProgress(),
        apiService.getAnalyticsQuizResults(),
        apiService.getMyNotifications({ limit: 6 }),
        apiService.getMyChallenges()
      ]);

      const dashboard = dashboardResponse.data;
      const roadmap = dashboard.current_roadmap;
      const focus = dashboard.focus || {};
      const topGap = focus.top_gap;
      const nextTask = focus.next_task;
      const recommendedResources =
        nextTask?.skill_id || topGap?.skill_id
          ? (
              await apiService
                .getRecommendedResources({
                  skill_id: nextTask?.skill_id || topGap?.skill_id,
                  difficulty_level: "BASIC",
                  limit: 4
                })
                .catch(() => ({ data: [] }))
            ).data
          : [];

      view.setQuickNote(
        roadmap
          ? `Roadmap hiện tại là "${roadmap.title}" với ${roadmap.completed_tasks}/${roadmap.total_tasks} nhiệm vụ hoàn thành.`
          : dashboard.notice || "Bạn chưa có roadmap đang hoạt động."
      );
      view.setMentorNote(
        focus.next_step || "Hãy duy trì nhịp học đều đặn để hệ thống cập nhật khuyến nghị chính xác hơn."
      );
      view.setMentorMetrics([
        { label: "Thông báo chưa đọc", value: `${dashboard.overview.unread_notifications}` },
        { label: "Điểm quiz TB", value: dashboard.overview.average_quiz_score ? `${Math.round(dashboard.overview.average_quiz_score)}` : "Chưa có" },
        { label: "Challenge tham gia", value: `${dashboard.overview.joined_challenges_count}` }
      ]);

      setHtml(
        refs.metrics,
        [
          renderMetricCard({
            label: "Tiến độ lộ trình",
            value: formatPercent(dashboard.overview.current_roadmap_progress),
            trend: roadmap ? `${roadmap.completed_tasks}/${roadmap.total_tasks} nhiệm vụ hoàn thành` : "Chưa có roadmap",
            tone: roadmap ? "success" : "warning"
          }),
          renderMetricCard({
            label: "Kỹ năng đã đánh giá",
            value: `${dashboard.overview.assessed_skills_count}`,
            trend: `Mức trung bình ${formatPercent(dashboard.overview.average_skill_level)}`
          }),
          renderMetricCard({
            label: "Điểm quiz trung bình",
            value: dashboard.overview.average_quiz_score ? `${Math.round(dashboard.overview.average_quiz_score)}` : "Chưa có",
            trend: `${quizResponse.data.summary.attempts_count} lượt đã chấm`
          }),
          renderMetricCard({
            label: "Thời gian học đã ghi",
            value: `${Math.round(dashboard.overview.total_study_minutes / 60)}h`,
            trend: `${roadmapResponse.data.recent_logs.length} bản ghi tiến độ gần đây`
          })
        ].join("")
      );

      setText(refs.heroCareer, roadmap?.career_name || "Chưa có lộ trình học");
      setText(
        refs.heroRoadmap,
        roadmap
          ? roadmap.title
          : "Chọn nghề mục tiêu và tạo roadmap để hệ thống bắt đầu theo dõi tiến độ học tập."
      );
      setHtml(
        refs.heroStatus,
        renderStatusTag(roadmap ? getRoadmapStatusLabel(roadmap.status) : "Chưa sẵn sàng", roadmap ? "success" : "warning")
      );
      setText(refs.heroMajor, `Ngành học: ${dashboard.profile?.major || "Chưa cập nhật"}`);
      setText(refs.heroLocation, `Địa điểm ưu tiên: ${dashboard.profile?.preferred_location || "Chưa chọn"}`);
      setText(refs.heroDate, `Kết thúc dự kiến: ${formatDate(roadmap?.expected_end_date)}`);

      renderTimeline(roadmapResponse.data.upcoming_tasks || []);
      renderTopSkills(dashboard.top_skills || []);
      renderResources(recommendedResources);
      renderNotifications(notificationsResponse.data || []);
      renderChallenges(challengesResponse.data || []);

      setText(refs.focusTask, nextTask?.task_title || "Chưa có nhiệm vụ đang theo dõi");
      setText(refs.focusGap, topGap ? `${topGap.skill_name} (${topGap.gap_level}%)` : "Chưa có dữ liệu skill gap");
      setText(refs.nextStep, focus.next_step || "Tiếp tục cập nhật kỹ năng và tiến độ để hệ thống đề xuất chính xác hơn.");
    } catch (error) {
      view.setMessage(error.message || "Không thể tải dữ liệu tổng quan học tập.", "error");
      setHtml(
        refs.notifications,
        renderEmptyState("Không tải được dashboard", "Kiểm tra lại phiên đăng nhập hoặc kết nối backend rồi tải lại trang.")
      );
    }
  };

  refs.notifications?.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.dataset.readNotification) {
      return;
    }

    try {
      await apiService.markNotificationRead(Number(target.dataset.readNotification));
      view.setMessage("Đã đánh dấu thông báo là đã đọc.", "success");
      await loadPage();
    } catch (error) {
      view.setMessage(error.message || "Không thể cập nhật thông báo.", "error");
    }
  });

  refs.readAllButton?.addEventListener("click", async () => {
    try {
      await apiService.markAllNotificationsRead();
      view.setMessage("Đã đánh dấu toàn bộ thông báo là đã đọc.", "success");
      await loadPage();
    } catch (error) {
      view.setMessage(error.message || "Không thể đánh dấu toàn bộ thông báo.", "error");
    }
  });

  loadPage();
}
