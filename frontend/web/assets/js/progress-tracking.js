import { apiService } from "./api.js";
import {
  formatDateTime,
  formatPercent,
  getTaskStatusLabel,
  initializeLayout,
  renderEmptyState,
  renderMetricCard,
  renderStatusTag,
  serializeForm,
  setHtml,
  setInputValue,
  setText
} from "./layout.js";

const view = initializeLayout({ pageKey: "progress-tracking", requireAuth: true });

if (view) {
  const refs = {
    metrics: document.querySelector("#progress-metrics"),
    heroTitle: document.querySelector("#progress-hero-title"),
    statusTag: document.querySelector("#progress-status-tag"),
    taskList: document.querySelector("#progress-task-list"),
    form: document.querySelector("#task-progress-form"),
    taskTitle: document.querySelector("#progress-task-title"),
    progressInput: document.querySelector("#progress-percent-input"),
    noteInput: document.querySelector("#progress-note-input"),
    logList: document.querySelector("#progress-log-list")
  };

  let selectedTaskId = null;

  const collectTasks = (stages) => stages.flatMap((stage) => stage.tasks || []);

  const loadPage = async () => {
    try {
      const roadmaps = (await apiService.getMyRoadmaps()).data;
      const activeRoadmap = roadmaps[0] || null;
      const stages = activeRoadmap ? (await apiService.getRoadmapStages(activeRoadmap.roadmap_id)).data : [];
      const tasks = collectTasks(stages);
      const selectedTask =
        tasks.find((task) => task.task_id === Number(selectedTaskId)) ||
        tasks.find((task) => task.status !== "COMPLETED") ||
        tasks[0] ||
        null;

      selectedTaskId ||= selectedTask?.task_id || null;

      const taskDetail =
        selectedTask ? (await apiService.getRoadmapTask(selectedTask.task_id).catch(() => ({ data: null }))).data : null;
      const totalMinutes =
        taskDetail?.progress_logs?.reduce((sum, item) => sum + Number(item.study_minutes || 0), 0) || 0;

      view.setQuickNote(
        taskDetail
          ? "Trang này cập nhật tiến độ bằng API PATCH và phản ánh ngay dữ liệu từ LearningProgressLogs."
          : "Chưa có task để cập nhật tiến độ. Hãy tạo hoặc mở một roadmap trước."
      );
      view.setMentorNote(
        taskDetail
          ? `Đang theo dõi tiến độ của task "${taskDetail.task_title}" với ${taskDetail.progress_logs?.length || 0} bản ghi lịch sử.`
          : "AI Mentor chưa có task để theo dõi tiến độ học tập."
      );
      view.setMentorMetrics([
        { label: "Roadmap hiện tại", value: activeRoadmap?.career_name || "Chưa có" },
        { label: "Task đang mở", value: taskDetail?.task_title || "Chưa có" },
        { label: "Tổng phút học", value: `${totalMinutes}` }
      ]);

      setHtml(
        refs.metrics,
        [
          renderMetricCard({
            label: "Tiến độ task",
            value: formatPercent(taskDetail?.latest_progress_percent || 0),
            trend: taskDetail ? getTaskStatusLabel(taskDetail.status) : "Chưa có task"
          }),
          renderMetricCard({
            label: "Số task trong roadmap",
            value: `${tasks.length}`,
            trend: activeRoadmap?.title || "Chưa có roadmap"
          }),
          renderMetricCard({
            label: "Số log tiến độ",
            value: `${taskDetail?.progress_logs?.length || 0}`,
            trend: "Dữ liệu từ LearningProgressLogs"
          }),
          renderMetricCard({
            label: "Phút học đã ghi",
            value: `${totalMinutes}`,
            trend: "Tổng study_minutes hiện tại"
          })
        ].join("")
      );

      setText(refs.heroTitle, taskDetail?.task_title || "Chưa có task đang theo dõi");
      setHtml(
        refs.statusTag,
        renderStatusTag(taskDetail ? getTaskStatusLabel(taskDetail.status) : "Chưa có dữ liệu", taskDetail ? "success" : "warning")
      );

      setHtml(
        refs.taskList,
        tasks.length
          ? tasks
              .map(
                (task) => `
                  <article class="task-card ${task.task_id === taskDetail?.task_id ? "task-card--active" : ""}">
                    <div class="task-card__row">
                      <div>
                        <h4 class="task-card__title">${task.task_title}</h4>
                        <p class="helper-text">${task.skill_name || "Không gắn kỹ năng"}</p>
                      </div>
                      ${renderStatusTag(getTaskStatusLabel(task.status), task.status === "COMPLETED" ? "success" : "warning")}
                    </div>
                    <div class="progress-bar"><span style="width:${task.latest_progress_percent || 0}%"></span></div>
                    <div class="career-actions">
                      <button class="secondary-button" type="button" data-open-task="${task.task_id}">Mở task</button>
                    </div>
                  </article>
                `
              )
              .join("")
          : renderEmptyState("Chưa có task", "Tạo hoặc mở roadmap để hệ thống có nhiệm vụ học tập.")
      );

      setText(refs.taskTitle, taskDetail?.task_title || "Chưa có task được chọn");
      setInputValue(refs.progressInput, taskDetail?.latest_progress_percent || 0);
      setInputValue(refs.noteInput, "");

      setHtml(
        refs.logList,
        taskDetail?.progress_logs?.length
          ? taskDetail.progress_logs
              .map(
                (log) => `
                  <article class="schedule-item">
                    <div>
                      <strong>${formatDateTime(log.logged_at)}</strong>
                      <p class="helper-text">${log.note || "Không có ghi chú"}</p>
                    </div>
                    <div>
                      <div>${formatPercent(log.progress_percent || 0)}</div>
                      <small class="helper-text">${log.study_minutes || 0} phút</small>
                    </div>
                  </article>
                `
              )
              .join("")
          : renderEmptyState("Chưa có lịch sử", "Task này chưa có bản ghi tiến độ nào.")
      );
    } catch (error) {
      view.setMessage(error.message || "Không thể tải trang tiến độ học tập.", "error");
      setHtml(
        refs.taskList,
        renderEmptyState("Không tải được tiến độ học tập", "Hãy kiểm tra roadmap, task hoặc backend rồi thử lại.")
      );
    }
  };

  refs.taskList?.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.dataset.openTask) {
      return;
    }

    selectedTaskId = Number(target.dataset.openTask);
    await loadPage();
  });

  refs.form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!selectedTaskId) {
      view.setMessage("Hãy chọn một task trước khi cập nhật tiến độ.", "error");
      return;
    }

    try {
      const payload = serializeForm(refs.form);
      await apiService.updateRoadmapTaskProgress(selectedTaskId, {
        progress_percent: Number(payload.progress_percent),
        study_minutes: payload.study_minutes ? Number(payload.study_minutes) : 0,
        note: payload.note || null
      });
      view.setMessage("Cập nhật tiến độ thành công.", "success");
      await loadPage();
    } catch (error) {
      view.setMessage(error.message || "Không thể cập nhật tiến độ.", "error");
    }
  });

  loadPage();
}
