import { apiService } from "./api.js";
import {
  buildOptions,
  formatDate,
  formatPercent,
  getRoadmapStatusLabel,
  getTaskStatusLabel,
  initializeLayout,
  renderEmptyState,
  renderMetricCard,
  renderStatusTag,
  serializeForm,
  setHtml,
  setText
} from "./layout.js";

const view = initializeLayout({ pageKey: "learning-path", requireAuth: true });

if (view) {
  const refs = {
    metrics: document.querySelector("#roadmap-metrics"),
    heroTitle: document.querySelector("#roadmap-hero-title"),
    statusTag: document.querySelector("#roadmap-status-tag"),
    form: document.querySelector("#roadmap-generate-form"),
    careerSelect: document.querySelector("#roadmap-career-select"),
    timeline: document.querySelector("#roadmap-timeline"),
    roadmapList: document.querySelector("#roadmap-list"),
    taskList: document.querySelector("#roadmap-task-list"),
    taskTitle: document.querySelector("#roadmap-task-title"),
    taskDescription: document.querySelector("#roadmap-task-description"),
    taskStatus: document.querySelector("#roadmap-task-status"),
    taskProgress: document.querySelector("#roadmap-task-progress")
  };

  let selectedRoadmapId = null;
  let selectedTaskId = null;

  const collectTasks = (stages) => stages.flatMap((stage) => stage.tasks || []);

  const renderTimeline = (stages) => {
    if (!stages.length) {
      setHtml(
        refs.timeline,
        renderEmptyState("Chưa có giai đoạn", "Tạo roadmap đầu tiên để xem stage và task được sinh từ stored procedure.")
      );
      return;
    }

    setHtml(
      refs.timeline,
      `
        <div class="roadmap-hero__timeline">
          ${stages
            .map((stage) => {
              const tasks = stage.tasks || [];
              const allDone = tasks.length > 0 && tasks.every((task) => task.status === "COMPLETED");
              const hasActive = tasks.some((task) => task.status === "IN_PROGRESS");
              return `
                <article class="timeline-step ${allDone ? "timeline-step--done" : hasActive ? "timeline-step--active" : ""}">
                  <h4>${stage.stage_name}</h4>
                  <p class="helper-text">${stage.description || "Giai đoạn học tập."}</p>
                </article>
              `;
            })
            .join("")}
        </div>
      `
    );
  };

  const loadPage = async () => {
    try {
      const [goalsResponse, roadmapsResponse] = await Promise.all([
        apiService.getMyCareerGoals(),
        apiService.getMyRoadmaps()
      ]);

      refs.careerSelect.innerHTML = buildOptions(
        goalsResponse.data,
        goalsResponse.data[0]?.career_id,
        "Chọn nghề mục tiêu đã lưu",
        "career_id",
        "career_name"
      );

      const activeRoadmap =
        roadmapsResponse.data.find((roadmap) => roadmap.roadmap_id === Number(selectedRoadmapId)) ||
        roadmapsResponse.data[0] ||
        null;

      selectedRoadmapId ||= activeRoadmap?.roadmap_id || null;

      const stages = activeRoadmap ? (await apiService.getRoadmapStages(activeRoadmap.roadmap_id)).data : [];
      const tasks = collectTasks(stages);
      const selectedTask =
        tasks.find((task) => task.task_id === Number(selectedTaskId)) ||
        tasks.find((task) => task.status !== "COMPLETED") ||
        tasks[0] ||
        null;

      selectedTaskId ||= selectedTask?.task_id || null;

      const selectedTaskDetail =
        selectedTask ? (await apiService.getRoadmapTask(selectedTask.task_id).catch(() => ({ data: null }))).data : null;

      view.setQuickNote(
        activeRoadmap
          ? "Roadmap hiện tại dùng dữ liệu thật từ bảng LearningRoadmaps, RoadmapStages và RoadmapTasks."
          : "Hãy chọn nghề mục tiêu và tạo roadmap đầu tiên bằng API generate roadmap."
      );
      view.setMentorNote(
        selectedTask
          ? `Nhiệm vụ đang mở là "${selectedTask.task_title}". Bạn có thể cập nhật tiến độ ở trang Tiến độ học tập.`
          : "Chưa có task để AI Mentor theo dõi. Hãy tạo roadmap từ nghề mục tiêu."
      );
      view.setMentorMetrics([
        { label: "Roadmap đang chọn", value: activeRoadmap?.career_name || "Chưa có" },
        { label: "Số giai đoạn", value: `${stages.length}` },
        { label: "Task đang mở", value: selectedTask?.task_title || "Chưa có" }
      ]);

      setHtml(
        refs.metrics,
        [
          renderMetricCard({
            label: "Roadmap đã tạo",
            value: `${roadmapsResponse.data.length}`,
            trend: activeRoadmap?.title || "Chưa có roadmap"
          }),
          renderMetricCard({
            label: "Tiến độ hiện tại",
            value: formatPercent(activeRoadmap?.progress_percent || 0),
            trend: activeRoadmap ? `${activeRoadmap.completed_tasks}/${activeRoadmap.total_tasks} nhiệm vụ hoàn thành` : "Chưa có dữ liệu"
          }),
          renderMetricCard({
            label: "Số giai đoạn",
            value: `${stages.length}`,
            trend: "Được sinh từ roadmap hiện tại"
          }),
          renderMetricCard({
            label: "Task đang mở",
            value: selectedTask ? "Có" : "Không",
            trend: selectedTask?.task_title || "Chưa chọn task"
          })
        ].join("")
      );

      setText(refs.heroTitle, activeRoadmap?.title || "Tạo lộ trình học đầu tiên");
      setHtml(
        refs.statusTag,
        renderStatusTag(getRoadmapStatusLabel(activeRoadmap?.status || "DRAFT"), activeRoadmap ? "success" : "warning")
      );

      renderTimeline(stages);

      setHtml(
        refs.roadmapList,
        roadmapsResponse.data.length
          ? roadmapsResponse.data
              .map(
                (roadmap) => `
                  <article class="resource-card ${roadmap.roadmap_id === activeRoadmap?.roadmap_id ? "resource-card--active" : ""}">
                    <h4 class="job-card__title">${roadmap.title}</h4>
                    <div class="resource-card__meta">
                      <span>${roadmap.career_name}</span>
                      <strong>${formatPercent(roadmap.progress_percent || 0)}</strong>
                    </div>
                    <p class="helper-text">Kết thúc dự kiến: ${formatDate(roadmap.expected_end_date)}</p>
                    <div class="career-actions">
                      <button class="secondary-button" type="button" data-open-roadmap="${roadmap.roadmap_id}">Mở roadmap</button>
                    </div>
                  </article>
                `
              )
              .join("")
          : renderEmptyState("Chưa có roadmap", "Tạo roadmap đầu tiên từ form bên trên.")
      );

      setHtml(
        refs.taskList,
        tasks.length
          ? tasks
              .map(
                (task) => `
                  <article class="task-card ${task.task_id === selectedTask?.task_id ? "task-card--active" : ""}">
                    <div class="task-card__row">
                      <div>
                        <h4 class="task-card__title">${task.task_title}</h4>
                        <p class="helper-text">${task.skill_name || "Không gắn kỹ năng"}</p>
                      </div>
                      ${renderStatusTag(getTaskStatusLabel(task.status), task.status === "COMPLETED" ? "success" : "warning")}
                    </div>
                    <div class="progress-bar"><span style="width:${task.latest_progress_percent || 0}%"></span></div>
                    <div class="career-actions">
                      <button class="secondary-button" type="button" data-open-task="${task.task_id}">Xem task</button>
                    </div>
                  </article>
                `
              )
              .join("")
          : renderEmptyState("Chưa có task", "Roadmap hiện tại chưa sinh task nào.")
      );

      setText(refs.taskTitle, selectedTaskDetail?.task_title || "Chưa có task");
      setText(refs.taskDescription, selectedTaskDetail?.description || "Chưa có mô tả.");
      setText(refs.taskStatus, getTaskStatusLabel(selectedTaskDetail?.status));
      setText(refs.taskProgress, formatPercent(selectedTaskDetail?.latest_progress_percent || 0));
    } catch (error) {
      view.setMessage(error.message || "Không thể tải trang lộ trình học.", "error");
      setHtml(
        refs.roadmapList,
        renderEmptyState("Không tải được lộ trình học", "Hãy kiểm tra nghề mục tiêu, dữ liệu roadmap hoặc backend rồi tải lại trang.")
      );
    }
  };

  refs.form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const payload = serializeForm(refs.form);
      await apiService.generateRoadmap({
        career_id: Number(payload.career_id),
        target_completion_months: payload.target_completion_months ? Number(payload.target_completion_months) : undefined
      });
      view.setMessage("Tạo roadmap thành công.", "success");
      selectedRoadmapId = null;
      selectedTaskId = null;
      await loadPage();
    } catch (error) {
      view.setMessage(error.message || "Không thể tạo roadmap.", "error");
    }
  });

  refs.roadmapList?.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.dataset.openRoadmap) {
      return;
    }

    selectedRoadmapId = Number(target.dataset.openRoadmap);
    selectedTaskId = null;
    await loadPage();
  });

  refs.taskList?.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.dataset.openTask) {
      return;
    }

    selectedTaskId = Number(target.dataset.openTask);
    await loadPage();
  });

  loadPage();
}
