import { apiService } from "./api.js";
import {
  buildOptions,
  getDifficultyLabel,
  getResourceTypeLabel,
  initializeLayout,
  renderEmptyState,
  renderMetricCard,
  renderStatusTag,
  serializeForm,
  setHtml,
  setText
} from "./layout.js";

const view = initializeLayout({ pageKey: "resources", requireAuth: true });

if (view) {
  const refs = {
    metrics: document.querySelector("#resource-metrics"),
    statusTag: document.querySelector("#resource-status-tag"),
    filterForm: document.querySelector("#resource-filter-form"),
    skillSelect: document.querySelector("#resource-skill-select"),
    difficultySelect: document.querySelector("#resource-difficulty-select"),
    typeSelect: document.querySelector("#resource-type-select"),
    resourceList: document.querySelector("#resource-list"),
    recommendedList: document.querySelector("#recommended-resource-list"),
    taskSection: document.querySelector("#task-resource-section"),
    currentTask: document.querySelector("#task-resource-current-task"),
    taskForm: document.querySelector("#task-resource-form"),
    taskResourceSelect: document.querySelector("#task-resource-select")
  };

  const difficultyOptions = [
    { value: "BASIC", label: "Cơ bản" },
    { value: "INTERMEDIATE", label: "Trung bình" },
    { value: "ADVANCED", label: "Nâng cao" }
  ];

  const resourceTypeOptions = [
    { value: "COURSE", label: "Khóa học" },
    { value: "VIDEO", label: "Video" },
    { value: "BOOK", label: "Sách" },
    { value: "ARTICLE", label: "Bài viết" },
    { value: "EXERCISE", label: "Bài tập" },
    { value: "PROJECT", label: "Dự án" },
    { value: "PODCAST", label: "Podcast" }
  ];

  let currentFilters = {};
  let currentTask = null;
  let currentResources = [];

  const findFirstTask = async () => {
    const roadmaps = (await apiService.getMyRoadmaps().catch(() => ({ data: [] }))).data;
    const roadmap = roadmaps[0];

    if (!roadmap) {
      return null;
    }

    const stages = (await apiService.getRoadmapStages(roadmap.roadmap_id).catch(() => ({ data: [] }))).data;
    return stages.flatMap((stage) => stage.tasks || [])[0] || null;
  };

  const loadPage = async () => {
    try {
      const [skillsResponse, resourcesResponse] = await Promise.all([
        apiService.getSkills(),
        apiService.getResources({ ...currentFilters, limit: 18 })
      ]);

      currentTask = await findFirstTask();
      currentResources = resourcesResponse.data;

      refs.skillSelect.innerHTML = buildOptions(
        skillsResponse.data,
        currentFilters.skill_id,
        "Tất cả kỹ năng",
        "skill_id",
        "skill_name"
      );
      refs.difficultySelect.innerHTML = buildOptions(
        difficultyOptions,
        currentFilters.difficulty_level,
        "Tất cả mức độ",
        "value",
        "label"
      );
      refs.typeSelect.innerHTML = buildOptions(
        resourceTypeOptions,
        currentFilters.resource_type,
        "Tất cả loại tài liệu",
        "value",
        "label"
      );

      const recommendedResources = (
        await apiService
          .getRecommendedResources({
            skill_id: currentFilters.skill_id || currentTask?.skill_id || undefined,
            difficulty_level: currentFilters.difficulty_level || undefined,
            resource_type: currentFilters.resource_type || undefined,
            minimum_rating: currentFilters.minimum_rating || undefined,
            limit: 8
          })
          .catch(() => ({ data: [] }))
      ).data;

      view.setQuickNote(
        currentTask
          ? `Bạn có thể gắn tài liệu trực tiếp vào task "${currentTask.task_title}" từ trang này.`
          : "Nếu chưa có task đang học, trang này vẫn cho phép xem và lọc LearningResources."
      );
      view.setMentorNote(
        recommendedResources[0]
          ? `AI Mentor đang gợi ý tài liệu "${recommendedResources[0].title}" cho bước học hiện tại.`
          : "Chưa có tài liệu khuyến nghị phù hợp với bộ lọc hiện tại."
      );
      view.setMentorMetrics([
        { label: "Số tài liệu", value: `${resourcesResponse.data.length}` },
        { label: "Đề xuất riêng", value: `${recommendedResources.length}` },
        { label: "Task để gắn", value: currentTask?.task_title || "Chưa có" }
      ]);

      setHtml(
        refs.metrics,
        [
          renderMetricCard({
            label: "Tài liệu đang hiển thị",
            value: `${resourcesResponse.data.length}`,
            trend: "Dữ liệu từ LearningResources"
          }),
          renderMetricCard({
            label: "Tài liệu được gợi ý",
            value: `${recommendedResources.length}`,
            trend: "Theo skill_id và bộ lọc hiện tại"
          }),
          renderMetricCard({
            label: "Task đang gắn",
            value: currentTask ? "Có" : "Không",
            trend: currentTask?.task_title || "Chưa có task"
          }),
          renderMetricCard({
            label: "Bộ lọc kỹ năng",
            value: currentFilters.skill_id ? "Đang bật" : "Tất cả",
            trend: currentFilters.skill_id ? `Skill ID ${currentFilters.skill_id}` : "Không giới hạn"
          })
        ].join("")
      );
      setHtml(
        refs.statusTag,
        renderStatusTag(currentTask ? "Có task để gắn" : "Chỉ xem tài liệu", currentTask ? "success" : "warning")
      );
      setText(refs.currentTask, currentTask ? `Task hiện tại: ${currentTask.task_title}` : "Chưa có task đang học");

      setHtml(
        refs.resourceList,
        currentResources.length
          ? currentResources
              .map(
                (resource) => `
                  <article class="resource-card">
                    <h4 class="job-card__title">${resource.title}</h4>
                    <div class="resource-card__meta">
                      <span>${getResourceTypeLabel(resource.resource_type)}</span>
                      <strong>${Number(resource.rating || 0).toFixed(1)} / 5</strong>
                    </div>
                    <p class="helper-text">${resource.provider || "Tài liệu học tập trong hệ thống."}</p>
                    <div class="chip-row">
                      <span class="glass-chip">${getDifficultyLabel(resource.difficulty_level)}</span>
                      <span class="glass-chip">${resource.skill_name || "Không gắn skill"}</span>
                    </div>
                    <div class="career-actions">
                      <button class="secondary-button" type="button" data-fill-resource="${resource.resource_id}">Chọn để gắn task</button>
                    </div>
                  </article>
                `
              )
              .join("")
          : renderEmptyState("Chưa có tài liệu phù hợp", "Thay đổi bộ lọc hoặc kiểm tra lại dữ liệu LearningResources.")
      );

      setHtml(
        refs.recommendedList,
        recommendedResources.length
          ? recommendedResources
              .map(
                (resource) => `
                  <article class="resource-card">
                    <h4 class="job-card__title">${resource.title}</h4>
                    <p class="helper-text">${resource.provider || "Đề xuất từ backend."}</p>
                  </article>
                `
              )
              .join("")
          : renderEmptyState("Chưa có tài liệu đề xuất", "Hệ thống chưa tìm được tài liệu phù hợp với bối cảnh hiện tại.")
      );

      refs.taskResourceSelect.innerHTML = buildOptions(
        currentResources,
        "",
        "Chọn tài liệu để gắn",
        "resource_id",
        "title"
      );
      refs.taskSection.hidden = !currentTask;
    } catch (error) {
      view.setMessage(error.message || "Không thể tải trang tài liệu học tập.", "error");
      setHtml(
        refs.resourceList,
        renderEmptyState("Không tải được tài liệu", "Kiểm tra lại backend, bộ lọc hoặc phiên đăng nhập rồi thử lại.")
      );
    }
  };

  refs.filterForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    currentFilters = serializeForm(refs.filterForm);
    await loadPage();
  });

  refs.resourceList?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.dataset.fillResource) {
      return;
    }

    refs.taskResourceSelect.value = target.dataset.fillResource;
    view.setMessage("Đã chọn tài liệu. Bấm Gắn tài liệu để hoàn tất.", "success");
  });

  refs.taskForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!currentTask) {
      return;
    }

    try {
      const payload = serializeForm(refs.taskForm);
      await apiService.attachTaskResource({
        task_id: currentTask.task_id,
        resource_id: Number(payload.resource_id),
        priority_order: payload.priority_order ? Number(payload.priority_order) : 1
      });
      view.setMessage("Đã gắn tài liệu vào task thành công.", "success");
      await loadPage();
    } catch (error) {
      view.setMessage(error.message || "Không thể xử lý tài liệu học tập.", "error");
    }
  });

  loadPage();
}
