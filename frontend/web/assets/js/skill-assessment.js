import { apiService } from "./api.js";
import {
  formatPercent,
  initializeLayout,
  renderEmptyState,
  renderMetricCard,
  renderStatusTag,
  serializeForm,
  setHtml
} from "./layout.js";

const view = initializeLayout({ pageKey: "skill-assessment", requireAuth: true });

if (view) {
  const refs = {
    metrics: document.querySelector("#skill-metrics"),
    statusTag: document.querySelector("#skill-status-tag"),
    grid: document.querySelector("#skill-grid")
  };

  const loadPage = async () => {
    try {
      const [skillCategories, skillsResponse, userSkillsResponse] = await Promise.all([
        apiService.getSkillCategories(),
        apiService.getSkills(),
        apiService.getMyUserSkills()
      ]);

      const userSkillMap = new Map(userSkillsResponse.data.map((item) => [item.skill_id, item]));
      const topSkills = [...userSkillsResponse.data].sort((left, right) => right.current_level - left.current_level).slice(0, 4);
      const lowSkills = [...userSkillsResponse.data].sort((left, right) => left.current_level - right.current_level).slice(0, 4);

      view.setQuickNote("Trang này ghi trực tiếp dữ liệu đánh giá kỹ năng vào bảng UserSkills bằng API thật.");
      view.setMentorNote(
        lowSkills[0]
          ? `AI Mentor nhận thấy "${lowSkills[0].skill_name}" là kỹ năng nên ưu tiên cải thiện trong giai đoạn hiện tại.`
          : "Hãy lưu ít nhất một kỹ năng để AI Mentor xác định trọng tâm học tập."
      );
      view.setMentorMetrics([
        { label: "Danh mục kỹ năng", value: `${skillCategories.data.length}` },
        { label: "Kỹ năng đã lưu", value: `${userSkillsResponse.data.length}` },
        { label: "Kỹ năng cần chú ý", value: lowSkills[0]?.skill_name || "Chưa có" }
      ]);

      setHtml(
        refs.metrics,
        [
          renderMetricCard({
            label: "Kỹ năng đã đánh giá",
            value: `${userSkillsResponse.data.length}`,
            trend: `${topSkills.length} kỹ năng ở nhóm mạnh`
          }),
          renderMetricCard({
            label: "Mức trung bình",
            value: formatPercent(
              userSkillsResponse.data.length
                ? userSkillsResponse.data.reduce((sum, item) => sum + Number(item.current_level || 0), 0) /
                    userSkillsResponse.data.length
                : 0
            ),
            trend: "Dựa trên toàn bộ UserSkills"
          }),
          renderMetricCard({
            label: "Độ tự tin trung bình",
            value: formatPercent(
              userSkillsResponse.data.length
                ? userSkillsResponse.data.reduce((sum, item) => sum + Number(item.confidence_level || 0), 0) /
                    userSkillsResponse.data.length
                : 0
            ),
            trend: "Dùng trường confidence_level"
          }),
          renderMetricCard({
            label: "Kỹ năng cần cải thiện",
            value: `${lowSkills.length}`,
            trend: lowSkills[0]?.skill_name || "Chưa có dữ liệu",
            tone: lowSkills.length ? "warning" : "success"
          })
        ].join("")
      );

      setHtml(
        refs.statusTag,
        renderStatusTag(
          `${userSkillsResponse.data.length} kỹ năng đã lưu`,
          userSkillsResponse.data.length ? "success" : "warning"
        )
      );

      if (!skillsResponse.data.length) {
        setHtml(refs.grid, renderEmptyState("Chưa có danh sách kỹ năng", "Backend chưa trả về dữ liệu Skills."));
        return;
      }

      setHtml(
        refs.grid,
        skillsResponse.data
          .map((skill) => {
            const userSkill = userSkillMap.get(skill.skill_id);

            return `
              <form class="resource-card form-grid" data-save-skill-form="true">
                <input type="hidden" name="skill_id" value="${skill.skill_id}" />
                <div class="section-header">
                  <div>
                    <h4 class="job-card__title">${skill.skill_name}</h4>
                    <p class="helper-text">${skill.category_name || "Kỹ năng hệ thống"}</p>
                  </div>
                  ${renderStatusTag(userSkill ? formatPercent(userSkill.current_level) : "Chưa lưu", userSkill ? "success" : "warning")}
                </div>
                <label><span>Mức hiện tại (0 - 100)</span><input type="number" min="0" max="100" name="current_level" value="${userSkill?.current_level || ""}" required /></label>
                <label><span>Độ tự tin (0 - 100)</span><input type="number" min="0" max="100" name="confidence_level" value="${userSkill?.confidence_level || ""}" /></label>
                <button class="primary-button full-width" type="submit">Lưu đánh giá</button>
              </form>
            `;
          })
          .join("")
      );
    } catch (error) {
      view.setMessage(error.message || "Không thể tải trang đánh giá kỹ năng.", "error");
      setHtml(
        refs.grid,
        renderEmptyState("Không tải được kỹ năng", "Hãy kiểm tra lại backend hoặc phiên đăng nhập rồi tải lại trang.")
      );
    }
  };

  refs.grid?.addEventListener("submit", async (event) => {
    const form = event.target;

    if (!(form instanceof HTMLFormElement) || !form.dataset.saveSkillForm) {
      return;
    }

    event.preventDefault();
    view.clearMessage();

    try {
      const payload = serializeForm(form);
      await apiService.saveUserSkill({
        skill_id: Number(payload.skill_id),
        current_level: Number(payload.current_level),
        confidence_level: payload.confidence_level ? Number(payload.confidence_level) : null,
        source: "SELF_ASSESSMENT"
      });
      view.setMessage("Lưu đánh giá kỹ năng thành công.", "success");
      await loadPage();
    } catch (error) {
      view.setMessage(error.message || "Không thể lưu kỹ năng.", "error");
    }
  });

  loadPage();
}
