import { apiService } from "./api.js";
import {
  formatDate,
  formatDateTime,
  formatPercent,
  getGoalStatusLabel,
  getNotificationTypeLabel,
  getQuizResultStatusLabel,
  getRoadmapStatusLabel,
  initializeLayout,
  renderEmptyState,
  renderMetricCard,
  renderStatusTag,
  setHtml,
  setText
} from "./layout.js";

const view = initializeLayout({ pageKey: "reports", requireAuth: true });

if (view) {
  const refs = {
    metrics: document.querySelector("#report-metrics"),
    statusTag: document.querySelector("#report-status-tag"),
    skillBars: document.querySelector("#report-skill-bars"),
    roadmapCurrent: document.querySelector("#report-roadmap-current"),
    goalCurrent: document.querySelector("#report-goal-current"),
    strongSkill: document.querySelector("#report-strong-skill"),
    learningSummaryList: document.querySelector("#report-learning-summary-list"),
    readinessList: document.querySelector("#report-readiness-list"),
    quizHistory: document.querySelector("#report-quiz-history"),
    gapList: document.querySelector("#report-gap-list"),
    notificationList: document.querySelector("#report-notification-list")
  };

  const renderSkillBars = (skills = []) => {
    if (!skills.length) {
      setHtml(
        refs.skillBars,
        renderEmptyState("Chưa có dữ liệu kỹ năng", "Hãy hoàn thành trang Đánh giá kỹ năng để thấy biểu đồ này.")
      );
      return;
    }

    setHtml(
      refs.skillBars,
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

  const renderLearningSummary = (report) => {
    setHtml(
      refs.learningSummaryList,
      [
        {
          title: "Bước tiếp theo",
          content: report.focus?.next_step || report.notice || "Tiếp tục cập nhật tiến độ học tập."
        },
        {
          title: "Thời gian học đã ghi",
          content: `${Math.round(Number(report.overview.total_study_minutes || 0) / 60)} giờ tích lũy`
        },
        {
          title: "Challenge đang theo dõi",
          content: `${report.joined_challenges.length} thử thách`
        },
        {
          title: "Thông báo chưa đọc",
          content: `${report.overview.unread_notifications} thông báo`
        }
      ]
        .map(
          (item) => `
            <article class="report-card">
              <h4 class="report-card__title">${item.title}</h4>
              <p>${item.content}</p>
            </article>
          `
        )
        .join("")
    );
  };

  const renderReadiness = (report) => {
    if (report.notice || !report.readiness) {
      setHtml(
        refs.readinessList,
        renderEmptyState("Chưa đủ dữ liệu nghề nghiệp", report.notice || "Hãy chọn nghề mục tiêu để hệ thống đánh giá.")
      );
      return;
    }

    setHtml(
      refs.readinessList,
      `
        <article class="report-card">
          <h4 class="report-card__title">${report.career_goal.career_name}</h4>
          <p class="helper-text">${getGoalStatusLabel(report.career_goal.status)} • ${formatDate(report.career_goal.target_deadline)}</p>
        </article>
        <article class="report-card">
          <h4 class="report-card__title">Mức sẵn sàng</h4>
          <p>${formatPercent(report.readiness.readiness_percent)}</p>
        </article>
        <article class="report-card">
          <h4 class="report-card__title">Kỹ năng đáp ứng</h4>
          <p>${report.readiness.matched_skills}/${report.readiness.total_required_skills}</p>
        </article>
        <article class="report-card">
          <h4 class="report-card__title">Gap trung bình</h4>
          <p>${Math.round(report.readiness.average_gap)}%</p>
        </article>
      `
    );
  };

  const renderQuizHistory = (items = []) => {
    if (!items.length) {
      setHtml(
        refs.quizHistory,
        renderEmptyState("Chưa có lịch sử quiz", "Hãy làm quiz để hệ thống bổ sung báo cáo kết quả học tập.")
      );
      return;
    }

    setHtml(
      refs.quizHistory,
      items
        .map(
          (attempt) => `
            <article class="schedule-item">
              <div>
                <strong>${attempt.quiz_title}</strong>
                <p class="helper-text">${attempt.skill_name || "Không gắn kỹ năng"} • ${formatDateTime(attempt.submitted_at)}</p>
              </div>
              <div>
                <div>${Math.round(Number(attempt.score || 0))}</div>
                <small class="helper-text">${getQuizResultStatusLabel(attempt.result_status)}</small>
              </div>
            </article>
          `
        )
        .join("")
    );
  };

  const renderGaps = (items = []) => {
    if (!items.length) {
      setHtml(
        refs.gapList,
        renderEmptyState("Chưa có khoảng cách ưu tiên", "Khi bạn chọn nghề mục tiêu, skill gap sẽ hiển thị ở đây.")
      );
      return;
    }

    setHtml(
      refs.gapList,
      items
        .map(
          (gap) => `
            <article class="resource-card">
              <h4 class="job-card__title">${gap.skill_name}</h4>
              <p class="helper-text">Hiện tại ${gap.current_level}% • Mục tiêu ${gap.required_level}%</p>
              <div class="resource-card__meta">
                <span>Trọng số ${gap.importance_weight}</span>
                <strong>Gap ${gap.gap_level}%</strong>
              </div>
            </article>
          `
        )
        .join("")
    );
  };

  const renderNotifications = (items = []) => {
    if (!items.length) {
      setHtml(
        refs.notificationList,
        renderEmptyState("Chưa có thông báo", "Thông báo liên quan roadmap, challenge và quiz sẽ hiển thị ở đây.")
      );
      return;
    }

    setHtml(
      refs.notificationList,
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
            </article>
          `
        )
        .join("")
    );
  };

  const loadPage = async () => {
    try {
      const [learningSummaryResponse, readinessResponse] = await Promise.all([
        apiService.getLearningSummaryReport(),
        apiService.getCareerReadinessReport()
      ]);

      const learningReport = learningSummaryResponse.data;
      const readinessReport = readinessResponse.data;
      const currentRoadmap = learningReport.current_roadmap;
      const strongSkill = learningReport.top_skills[0] || null;

      view.setQuickNote(
        learningReport.notice ||
          `Báo cáo đang phản ánh lộ trình "${currentRoadmap?.title || "chưa có"}" và ${learningReport.quiz_results.summary.attempts_count} lượt quiz.`
      );
      view.setMentorNote(
        readinessReport.notice ||
          `Mức sẵn sàng hiện tại cho nghề ${readinessReport.career_goal.career_name} là ${formatPercent(readinessReport.readiness.readiness_percent)}.`
      );
      view.setMentorMetrics([
        { label: "Kỹ năng đã lưu", value: `${learningReport.overview.assessed_skills_count}` },
        { label: "Roadmap", value: currentRoadmap?.career_name || "Chưa có" },
        { label: "Mục tiêu nghề", value: readinessReport.career_goal?.career_name || "Chưa có" }
      ]);

      setHtml(
        refs.metrics,
        [
          renderMetricCard({
            label: "Tiến độ roadmap",
            value: formatPercent(learningReport.overview.current_roadmap_progress),
            trend: currentRoadmap ? getRoadmapStatusLabel(currentRoadmap.status) : "Chưa có roadmap",
            tone: currentRoadmap ? "success" : "warning"
          }),
          renderMetricCard({
            label: "Thời gian học",
            value: `${Math.round(Number(learningReport.overview.total_study_minutes || 0) / 60)}h`,
            trend: `${learningReport.roadmap_progress.recent_logs.length} bản ghi tiến độ gần đây`
          }),
          renderMetricCard({
            label: "Điểm quiz trung bình",
            value: learningReport.overview.average_quiz_score ? `${Math.round(learningReport.overview.average_quiz_score)}` : "Chưa có",
            trend: `${learningReport.quiz_results.summary.pass_count} lượt đạt`
          }),
          renderMetricCard({
            label: "Sẵn sàng nghề nghiệp",
            value: readinessReport.readiness ? formatPercent(readinessReport.readiness.readiness_percent) : "Chưa có",
            trend: readinessReport.career_goal?.career_name || "Chưa có nghề mục tiêu",
            tone: readinessReport.readiness ? "success" : "warning"
          })
        ].join("")
      );

      setHtml(
        refs.statusTag,
        renderStatusTag(
          currentRoadmap ? formatPercent(learningReport.overview.current_roadmap_progress) : "Chưa có roadmap",
          currentRoadmap ? "success" : "warning"
        )
      );

      renderSkillBars(learningReport.top_skills || []);
      renderLearningSummary(learningReport);
      renderReadiness(readinessReport);
      renderQuizHistory(learningReport.quiz_results.recent_attempts || []);
      renderGaps(readinessReport.priority_gaps || []);
      renderNotifications(learningReport.recent_notifications || []);

      setText(refs.roadmapCurrent, currentRoadmap?.title || "Chưa có lộ trình đang theo dõi");
      setText(refs.goalCurrent, readinessReport.career_goal?.career_name || "Chưa lưu nghề mục tiêu");
      setText(refs.strongSkill, strongSkill?.skill_name || "Chưa có dữ liệu");
    } catch (error) {
      view.setMessage(error.message || "Không thể tải trang báo cáo học tập.", "error");
      setHtml(
        refs.skillBars,
        renderEmptyState("Không tải được báo cáo", "Kiểm tra lại phiên đăng nhập hoặc backend rồi thử lại.")
      );
    }
  };

  loadPage();
}
