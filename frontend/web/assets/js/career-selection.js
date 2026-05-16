import { apiService } from "./api.js";
import {
  getDemandLabel,
  getGoalStatusLabel,
  initializeLayout,
  renderEmptyState,
  renderMetricCard,
  renderStatusTag,
  setHtml,
  setText
} from "./layout.js";

const view = initializeLayout({ pageKey: "career-selection", requireAuth: true });

if (view) {
  const refs = {
    metrics: document.querySelector("#career-metrics"),
    heroTitle: document.querySelector("#career-hero-title"),
    heroDescription: document.querySelector("#career-hero-description"),
    statusTag: document.querySelector("#career-status-tag"),
    list: document.querySelector("#career-list"),
    detailTitle: document.querySelector("#career-detail-title"),
    detailDescription: document.querySelector("#career-detail-description"),
    demandText: document.querySelector("#career-demand-text"),
    salaryText: document.querySelector("#career-salary-text"),
    requiredSkills: document.querySelector("#career-required-skills"),
    goalsList: document.querySelector("#career-goals-list")
  };

  let selectedCareerId = null;

  const loadPage = async () => {
    try {
      const [careersResponse, goalsResponse] = await Promise.all([
        apiService.getCareers(),
        apiService.getMyCareerGoals()
      ]);

      const selectedCareer =
        selectedCareerId
          ? (await apiService.getCareerDetail(selectedCareerId).catch(() => ({ data: null }))).data
          : careersResponse.data[0] || null;

      if (!selectedCareerId && selectedCareer) {
        selectedCareerId = selectedCareer.career_id;
      }

      view.setQuickNote("Lưu nghề mục tiêu để mở khóa skill gap và roadmap cá nhân hóa theo dữ liệu thật.");
      view.setMentorNote(
        selectedCareer
          ? `AI Mentor đang xem bộ kỹ năng yêu cầu cho nghề "${selectedCareer.career_name}".`
          : "Hãy chọn một nghề nghiệp để hệ thống có điểm bắt đầu rõ ràng."
      );
      view.setMentorMetrics([
        { label: "Nghề đang hiển thị", value: selectedCareer?.career_name || "Chưa chọn" },
        { label: "Nghề đã lưu", value: `${goalsResponse.data.length}` },
        { label: "Nhu cầu thị trường", value: getDemandLabel(selectedCareer?.market_demand_level) }
      ]);

      setHtml(
        refs.metrics,
        [
          renderMetricCard({
            label: "Tổng nghề hiển thị",
            value: `${careersResponse.data.length}`,
            trend: "Dữ liệu từ bảng Careers"
          }),
          renderMetricCard({
            label: "Nghề mục tiêu đã lưu",
            value: `${goalsResponse.data.length}`,
            trend: goalsResponse.data[0]?.career_name || "Chưa lưu nghề mục tiêu"
          }),
          renderMetricCard({
            label: "Nghề đang xem",
            value: selectedCareer?.career_name || "Chưa chọn",
            trend: getDemandLabel(selectedCareer?.market_demand_level),
            tone: selectedCareer ? "success" : "warning"
          }),
          renderMetricCard({
            label: "Mức lương hiển thị",
            value: selectedCareer?.salary_range || "Chưa có",
            trend: "Thông tin mô tả nghề"
          })
        ].join("")
      );

      setText(refs.heroTitle, selectedCareer?.career_name || "Chọn nghề nghiệp đầu tiên");
      setText(
        refs.heroDescription,
        selectedCareer?.description || "Mở từng thẻ nghề để xem mô tả và bộ kỹ năng yêu cầu."
      );
      setHtml(
        refs.statusTag,
        renderStatusTag(
          selectedCareer ? getDemandLabel(selectedCareer.market_demand_level) : "Chưa chọn",
          selectedCareer ? "success" : "warning"
        )
      );

      setHtml(
        refs.list,
        careersResponse.data.length
          ? careersResponse.data
              .map(
                (career) => `
                  <article class="job-card ${selectedCareer?.career_id === career.career_id ? "job-card--active" : ""}">
                    <h4 class="job-card__title">${career.career_name}</h4>
                    <div class="job-card__meta">
                      <span>${career.salary_range || "Chưa có lương tham chiếu"}</span>
                      <strong>${getDemandLabel(career.market_demand_level)}</strong>
                    </div>
                    <p class="helper-text">${career.description || "Nghề nghiệp mục tiêu trong hệ thống."}</p>
                    <div class="career-actions">
                      <button class="secondary-button" type="button" data-view-career="${career.career_id}">Xem chi tiết</button>
                      <button class="primary-button" type="button" data-save-goal="${career.career_id}">Lưu mục tiêu</button>
                    </div>
                  </article>
                `
              )
              .join("")
          : renderEmptyState("Chưa có nghề nghiệp", "Backend chưa trả về dữ liệu Careers.")
      );

      setText(refs.detailTitle, selectedCareer?.career_name || "Chi tiết nghề nghiệp");
      setText(refs.detailDescription, selectedCareer?.description || "Chọn một nghề ở cột bên trái để xem chi tiết.");
      setText(refs.demandText, getDemandLabel(selectedCareer?.market_demand_level));
      setText(refs.salaryText, selectedCareer?.salary_range || "Chưa có dữ liệu");

      setHtml(
        refs.requiredSkills,
        selectedCareer?.required_skills?.length
          ? selectedCareer.required_skills
              .map((skill) => `<span class="glass-chip">${skill.skill_name} - ${skill.required_level}</span>`)
              .join("")
          : "<span class='helper-text'>Chưa có danh sách kỹ năng yêu cầu.</span>"
      );

      setHtml(
        refs.goalsList,
        goalsResponse.data.length
          ? goalsResponse.data
              .map(
                (goal) => `
                  <article class="resource-card">
                    <h4 class="job-card__title">${goal.career_name}</h4>
                    <div class="resource-card__meta">
                      <span>Ưu tiên ${goal.priority_order}</span>
                      <strong>${getGoalStatusLabel(goal.status)}</strong>
                    </div>
                  </article>
                `
              )
              .join("")
          : renderEmptyState("Chưa có mục tiêu", "Bấm Lưu mục tiêu ở một nghề để thêm vào danh sách này.")
      );
    } catch (error) {
      view.setMessage(error.message || "Không thể tải trang nghề nghiệp.", "error");
      setHtml(
        refs.list,
        renderEmptyState("Không tải được nghề nghiệp", "Kiểm tra lại phiên đăng nhập hoặc backend rồi thử lại.")
      );
    }
  };

  refs.list?.addEventListener("click", async (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    try {
      if (target.dataset.viewCareer) {
        selectedCareerId = Number(target.dataset.viewCareer);
        await loadPage();
      }

      if (target.dataset.saveGoal) {
        await apiService.saveCareerGoal({
          career_id: Number(target.dataset.saveGoal),
          priority_order: 1,
          status: "ACTIVE"
        });
        selectedCareerId = Number(target.dataset.saveGoal);
        view.setMessage("Đã lưu nghề mục tiêu thành công.", "success");
        await loadPage();
      }
    } catch (error) {
      view.setMessage(error.message || "Không thể xử lý nghề nghiệp đã chọn.", "error");
    }
  });

  loadPage();
}
