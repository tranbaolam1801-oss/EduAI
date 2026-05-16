import { apiService } from "./api.js";
import {
  buildOptions,
  formatNumber,
  getWorkingTypeLabel,
  initializeLayout,
  renderEmptyState,
  renderMetricCard,
  renderStatusTag,
  serializeForm,
  setElementOptions,
  setHtml
} from "./layout.js";
import { loadMyProfile } from "./auth.js";

const view = initializeLayout({ pageKey: "job-opportunities", requireAuth: true });

if (view) {
  const refs = {
    metrics: document.querySelector("#job-metrics"),
    statusTag: document.querySelector("#job-status-tag"),
    filterForm: document.querySelector("#job-filter-form"),
    careerSelect: document.querySelector("#job-career-select"),
    locationInput: document.querySelector("#job-location-input"),
    recommendList: document.querySelector("#job-recommend-list"),
    marketList: document.querySelector("#job-market-list"),
    savedList: document.querySelector("#saved-job-list"),
    companyTitle: document.querySelector("#job-company-title"),
    companyPanel: document.querySelector("#company-detail-panel")
  };

  let currentFilters = {};

  const formatSalary = (value) => (value ? `${formatNumber(value)} đ` : "Thỏa thuận");

  const renderJobCard = (job, actionLabel, actionType) => `
    <article class="job-card">
      <h4 class="job-card__title">${job.job_title}</h4>
      <div class="job-card__meta">
        <span>${job.company_name}</span>
        <strong>${job.match_percent !== null && job.match_percent !== undefined ? `${Math.round(Number(job.match_percent))}% phù hợp` : "Thị trường mở"}</strong>
      </div>
      <p class="helper-text">${job.location || "Chưa rõ khu vực"} • ${getWorkingTypeLabel(job.working_type)}</p>
      <p class="helper-text">${job.match_explanation || job.job_description || "Cơ hội nghề nghiệp hỗ trợ cho hành trình học tập."}</p>
      <div class="chip-row">
        <span class="glass-chip">${formatSalary(job.salary_min)}</span>
        <span class="glass-chip">${formatSalary(job.salary_max)}</span>
      </div>
      <div class="career-actions">
        <button class="secondary-button" type="button" data-${actionType}="${job.job_id}" data-company="${job.company_id}">${actionLabel}</button>
      </div>
    </article>
  `;

  const loadPage = async () => {
    try {
      const profile = await loadMyProfile();

      if (!currentFilters.location && profile?.preferred_location) {
        currentFilters.location = profile.preferred_location;
      }

      const [careersResponse, recommendedResponse, marketResponse, savedJobsResponse] = await Promise.all([
        apiService.getCareers().catch(() => ({ data: [] })),
        apiService.getRecommendedJobs({ ...currentFilters, limit: 6 }).catch(() => ({ data: [] })),
        apiService.getJobs({ ...currentFilters, limit: 8 }).catch(() => ({ data: [] })),
        apiService.getMySavedJobs().catch(() => ({ data: [] }))
      ]);

      setElementOptions(refs.careerSelect, careersResponse.data, currentFilters.career_id, "Tất cả nghề nghiệp", "career_id", "career_name");
      refs.locationInput.value = currentFilters.location || profile?.preferred_location || "";

      const recommendedJobs = recommendedResponse.data;
      const marketJobs = marketResponse.data;
      const savedJobs = savedJobsResponse.data;
      const bestMatch = recommendedJobs[0] || null;

      view.setQuickNote(
        bestMatch
          ? `Vị trí phù hợp nhất hiện tại là ${bestMatch.job_title} tại ${bestMatch.company_name}. Dùng kết quả này để biết nên học tiếp kỹ năng nào.`
          : "Nếu chưa có vị trí phù hợp, hãy tiếp tục cải thiện kỹ năng và hoàn thiện hồ sơ học tập."
      );
      view.setMentorNote(
        bestMatch?.match_explanation ||
          "Cơ hội nghề nghiệp ở đây chỉ mang tính hỗ trợ định hướng. Hãy dùng chúng để soi lại lộ trình học và skill gap."
      );
      view.setMentorMetrics([
        { label: "Vị trí phù hợp", value: `${recommendedJobs.length}` },
        { label: "Đã lưu", value: `${savedJobs.length}` },
        { label: "Khu vực", value: profile?.preferred_location || currentFilters.location || "Đang chờ" }
      ]);

      setHtml(
        refs.metrics,
        [
          renderMetricCard({
            label: "Vị trí phù hợp",
            value: `${recommendedJobs.length}`,
            trend: "Dữ liệu từ vw_JobMatchScore"
          }),
          renderMetricCard({
            label: "Vị trí thị trường",
            value: `${marketJobs.length}`,
            trend: "Danh sách mở để tham khảo"
          }),
          renderMetricCard({
            label: "Đã lưu",
            value: `${savedJobs.length}`,
            trend: "Theo dõi sau khi học thêm kỹ năng"
          }),
          renderMetricCard({
            label: "Mức phù hợp cao nhất",
            value: bestMatch?.match_percent ? `${Math.round(Number(bestMatch.match_percent))}%` : "Chưa có",
            trend: bestMatch?.job_title || "Hãy điều chỉnh bộ lọc"
          })
        ].join("")
      );

      setHtml(
        refs.statusTag,
        renderStatusTag(bestMatch ? "Đang có vị trí phù hợp" : "Ưu tiên học trước", bestMatch ? "success" : "warning")
      );

      setHtml(
        refs.recommendList,
        recommendedJobs.length
          ? recommendedJobs.map((job) => renderJobCard(job, "Lưu vị trí", "save-job")).join("")
          : renderEmptyState("Chưa có vị trí phù hợp", "Tiếp tục cải thiện kỹ năng hoặc điều chỉnh khu vực để hệ thống gợi ý lại.")
      );

      setHtml(
        refs.marketList,
        marketJobs.length
          ? marketJobs.map((job) => renderJobCard(job, "Xem công ty", "open-company")).join("")
          : renderEmptyState("Chưa có vị trí thị trường", "Không tìm thấy công việc mở theo bộ lọc hiện tại.")
      );

      setHtml(
        refs.savedList,
        savedJobs.length
          ? savedJobs
              .map(
                (job) => `
                  <article class="resource-card">
                    <h4 class="job-card__title">${job.job_title}</h4>
                    <p class="helper-text">${job.company_name} • ${job.location || "Chưa rõ khu vực"}</p>
                    <div class="resource-card__meta">
                      <span>${job.saved_job_status}</span>
                      <strong>${new Date(job.saved_at).toLocaleDateString("vi-VN")}</strong>
                    </div>
                  </article>
                `
              )
              .join("")
          : renderEmptyState("Chưa lưu công việc nào", "Hãy lưu những vị trí phù hợp để quay lại sau khi hoàn thành thêm kỹ năng.")
      );

      refs.companyTitle.textContent = "Chưa chọn công ty";
      setHtml(
        refs.companyPanel,
        renderEmptyState("Chưa chọn công ty", "Bấm vào một vị trí để xem thông tin công ty và các job đang mở.")
      );
    } catch (error) {
      view.setMessage(error.message || "Không thể tải trang cơ hội nghề nghiệp.", "error");
      setHtml(
        refs.recommendList,
        renderEmptyState("Không tải được vị trí phù hợp", "Kiểm tra lại backend, hồ sơ học tập hoặc phiên đăng nhập rồi thử lại.")
      );
    }
  };

  refs.filterForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    currentFilters = serializeForm(refs.filterForm);
    await loadPage();
  });

  refs.recommendList?.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.dataset.saveJob) {
      return;
    }

    try {
      await apiService.saveJob({ job_id: Number(target.dataset.saveJob) });
      view.setMessage("Đã lưu cơ hội nghề nghiệp thành công.", "success");
      await loadPage();
    } catch (error) {
      view.setMessage(error.message || "Không thể lưu cơ hội nghề nghiệp.", "error");
    }
  });

  const openCompany = async (companyId) => {
    try {
      const company = (await apiService.getCompanyDetail(companyId)).data;
      refs.companyTitle.textContent = company.company_name;
      setHtml(
        refs.companyPanel,
        `
          <article class="resource-card">
            <h4 class="job-card__title">${company.company_name}</h4>
            <p class="helper-text">${company.industry || "Chưa rõ lĩnh vực"} • ${company.city || "Chưa rõ thành phố"}</p>
          </article>
          <article class="resource-card">
            <h4 class="job-card__title">Liên hệ công khai</h4>
            <p class="helper-text">${company.email_public || "Chưa có email công khai"}</p>
            <p class="helper-text">${company.phone_public || "Chưa có số điện thoại công khai"}</p>
          </article>
          <article class="resource-card">
            <h4 class="job-card__title">Job đang mở</h4>
            <p class="helper-text">${company.jobs?.length || 0} vị trí</p>
          </article>
        `
      );
    } catch (error) {
      view.setMessage(error.message || "Không thể tải thông tin công ty.", "error");
    }
  };

  refs.marketList?.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.dataset.openCompany) {
      return;
    }

    await openCompany(Number(target.dataset.company));
  });

  loadPage();
}
