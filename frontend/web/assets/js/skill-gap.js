import { apiService } from "./api.js";
import {
  buildOptions,
  formatPercent,
  initializeLayout,
  renderEmptyState,
  renderMetricCard,
  renderStatusTag,
  serializeForm,
  setHtml,
  setText
} from "./layout.js";

const view = initializeLayout({ pageKey: "skill-gap", requireAuth: true });

if (view) {
  const refs = {
    metrics: document.querySelector("#gap-metrics"),
    heroTitle: document.querySelector("#gap-hero-title"),
    statusTag: document.querySelector("#gap-status-tag"),
    form: document.querySelector("#skill-gap-form"),
    careerSelect: document.querySelector("#gap-career-select"),
    tableBody: document.querySelector("#gap-table-body")
  };

  let selectedCareerId = null;

  const loadPage = async () => {
    try {
      const [goalsResponse, careersResponse] = await Promise.all([
        apiService.getMyCareerGoals(),
        apiService.getCareers()
      ]);

      const optionSource = goalsResponse.data.length ? goalsResponse.data : careersResponse.data;
      selectedCareerId ||= optionSource[0]?.career_id || null;

      refs.careerSelect.innerHTML = buildOptions(
        optionSource,
        selectedCareerId,
        "Chọn nghề nghiệp",
        "career_id",
        "career_name"
      );

      const gapResponse = selectedCareerId
        ? await apiService.getSkillGap(selectedCareerId).catch(() => ({ data: null }))
        : { data: null };
      const gapItems = gapResponse.data?.items || [];
      const highestGap = [...gapItems].sort((left, right) => Number(right.gap_level) - Number(left.gap_level))[0];

      view.setQuickNote(
        selectedCareerId
          ? "Phân tích skill gap đang ưu tiên dùng view vw_SkillGapAnalysis thay vì tự tính ở frontend."
          : "Lưu nghề mục tiêu trước để phân tích khoảng cách kỹ năng."
      );
      view.setMentorNote(
        highestGap
          ? `Khoảng cách lớn nhất hiện tại nằm ở kỹ năng "${highestGap.skill_name}".`
          : "Chọn nghề nghiệp mục tiêu để hệ thống đọc dữ liệu gap từ SQL Server."
      );
      view.setMentorMetrics([
        { label: "Nghề đang phân tích", value: gapResponse.data?.career_name || "Chưa chọn" },
        { label: "Số kỹ năng có gap", value: `${gapItems.filter((item) => Number(item.gap_level) > 0).length}` },
        { label: "Ưu tiên số 1", value: highestGap?.skill_name || "Chưa có dữ liệu" }
      ]);

      setHtml(
        refs.metrics,
        [
          renderMetricCard({
            label: "Nghề đang phân tích",
            value: gapResponse.data?.career_name || "Chưa chọn",
            trend: "Dữ liệu từ CareerGoals hoặc Careers",
            tone: selectedCareerId ? "success" : "warning"
          }),
          renderMetricCard({
            label: "Kỹ năng còn thiếu",
            value: `${gapItems.filter((item) => Number(item.gap_level) > 0).length}`,
            trend: highestGap ? highestGap.skill_name : "Chưa có khoảng cách"
          }),
          renderMetricCard({
            label: "Gap lớn nhất",
            value: `${highestGap?.gap_level || 0}`,
            trend: highestGap ? highestGap.skill_name : "Chưa có dữ liệu",
            tone: highestGap ? "warning" : "success"
          }),
          renderMetricCard({
            label: "Match hiện tại",
            value: formatPercent(
              gapItems.length
                ? 100 -
                    gapItems.reduce((sum, item) => sum + Number(item.gap_level || 0), 0) /
                      Math.max(gapItems.length, 1)
                : 0
            ),
            trend: "Ước lượng hiển thị từ dữ liệu gap"
          })
        ].join("")
      );

      setText(refs.heroTitle, gapResponse.data?.career_name || "Chọn nghề để phân tích");
      setHtml(
        refs.statusTag,
        renderStatusTag(gapItems.length ? `${gapItems.length} kỹ năng` : "Chưa có dữ liệu", gapItems.length ? "success" : "warning")
      );

      setHtml(
        refs.tableBody,
        gapItems.length
          ? gapItems
              .map(
                (item) => `
                  <tr>
                    <td>${item.skill_name}</td>
                    <td>${item.current_level}</td>
                    <td>${item.required_level}</td>
                    <td>${renderStatusTag(item.gap_level, Number(item.gap_level) > 0 ? "warning" : "success")}</td>
                  </tr>
                `
              )
              .join("")
          : `<tr><td colspan="4">${renderEmptyState("Chưa có dữ liệu gap", "Hãy chọn nghề mục tiêu hoặc hoàn thiện đánh giá kỹ năng để hệ thống tính toán.")}</td></tr>`
      );
    } catch (error) {
      view.setMessage(error.message || "Không thể tải trang skill gap.", "error");
      setHtml(
        refs.tableBody,
        `<tr><td colspan="4">${renderEmptyState("Không tải được skill gap", "Hãy kiểm tra dữ liệu nghề mục tiêu, đánh giá kỹ năng hoặc backend.")}</td></tr>`
      );
    }
  };

  refs.form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    selectedCareerId = Number(serializeForm(refs.form).career_id);
    await loadPage();
  });

  loadPage();
}
