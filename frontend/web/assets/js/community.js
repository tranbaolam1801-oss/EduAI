import { apiService } from "./api.js";
import {
  getChallengeParticipantStatusLabel,
  getChallengeStatusLabel,
  formatDate,
  formatDateTime,
  initializeLayout,
  renderEmptyState,
  renderMetricCard,
  renderStatusTag,
  setHtml
} from "./layout.js";

const view = initializeLayout({ pageKey: "community", requireAuth: true });

if (view) {
  const refs = {
    metrics: document.querySelector("#community-metrics"),
    statusTag: document.querySelector("#community-status-tag"),
    challengeList: document.querySelector("#community-challenge-list"),
    myChallenges: document.querySelector("#community-my-challenges"),
    detailPanel: document.querySelector("#community-detail-panel"),
    leaderboard: document.querySelector("#community-leaderboard")
  };

  let selectedChallengeId = null;

  const renderChallengeCard = (challenge, mode = "browse") => `
    <article class="resource-card ${challenge.my_joined_at ? "resource-card--active" : ""}">
      <h4 class="job-card__title">${challenge.title}</h4>
      <p class="helper-text">${challenge.skill_name || "Không gắn kỹ năng"} • ${formatDate(challenge.end_date)}</p>
      <div class="resource-card__meta">
        <span>${challenge.participant_count} người tham gia</span>
        <strong>${getChallengeStatusLabel(challenge.status)}</strong>
      </div>
      <div class="career-actions">
        <button class="secondary-button" type="button" data-open-challenge="${challenge.challenge_id}">Xem chi tiết</button>
        ${
          mode === "browse" && !challenge.my_joined_at
            ? `<button class="primary-button" type="button" data-join-challenge="${challenge.challenge_id}">Tham gia</button>`
            : ""
        }
      </div>
    </article>
  `;

  const renderDetail = (challenge) => {
    if (!challenge) {
      setHtml(
        refs.detailPanel,
        renderEmptyState("Chưa chọn thử thách", "Bấm vào một challenge để xem mô tả, kỹ năng liên quan và trạng thái tham gia.")
      );
      return;
    }

    setHtml(
      refs.detailPanel,
      `
        <article class="resource-card">
          <h4 class="job-card__title">${challenge.title}</h4>
          <p class="helper-text">${challenge.description || "Không có mô tả chi tiết."}</p>
        </article>
        <article class="resource-card">
          <h4 class="job-card__title">Thông tin challenge</h4>
          <p class="helper-text">Kỹ năng: ${challenge.skill_name || "Không gắn kỹ năng"}</p>
          <p class="helper-text">Thời gian: ${formatDate(challenge.start_date)} → ${formatDate(challenge.end_date)}</p>
          <p class="helper-text">Điểm tối đa: ${challenge.max_score}</p>
        </article>
        <article class="resource-card">
          <h4 class="job-card__title">Trạng thái của bạn</h4>
          <p class="helper-text">${
            challenge.my_joined_at
              ? `Đã tham gia từ ${formatDateTime(challenge.my_joined_at)} • ${getChallengeParticipantStatusLabel(challenge.my_status)}`
              : "Bạn chưa tham gia thử thách này."
          }</p>
        </article>
      `
    );
  };

  const renderLeaderboard = (items = []) => {
    if (!items.length) {
      setHtml(
        refs.leaderboard,
        renderEmptyState("Chưa có bảng xếp hạng", "Khi có người tham gia và ghi điểm, bảng xếp hạng sẽ hiển thị ở đây.")
      );
      return;
    }

    setHtml(
      refs.leaderboard,
      items
        .map(
          (item, index) => `
            <article class="schedule-item">
              <div>
                <strong>#${index + 1} ${item.full_name}</strong>
                <p class="helper-text">${formatDateTime(item.joined_at)} • ${getChallengeParticipantStatusLabel(item.status)}</p>
              </div>
              <div>
                <div>${item.score}</div>
                <small class="helper-text">điểm</small>
              </div>
            </article>
          `
        )
        .join("")
    );
  };

  const loadPage = async () => {
    try {
      const [challengeResponse, myChallengeResponse, notificationResponse] = await Promise.all([
        apiService.getChallenges({ limit: 12 }),
        apiService.getMyChallenges(),
        apiService.getMyNotifications({ limit: 1 }).catch(() => ({ data: [] }))
      ]);

      const challenges = challengeResponse.data;
      const myChallenges = myChallengeResponse.data;
      const selectedChallenge =
        challenges.find((challenge) => challenge.challenge_id === Number(selectedChallengeId)) ||
        myChallenges.find((challenge) => challenge.challenge_id === Number(selectedChallengeId)) ||
        challenges[0] ||
        myChallenges[0] ||
        null;

      selectedChallengeId = selectedChallenge?.challenge_id || null;

      const detail = selectedChallengeId
        ? (await apiService.getChallengeDetail(selectedChallengeId).catch(() => ({ data: null }))).data
        : null;

      view.setQuickNote(
        challenges.length
          ? `Hiện có ${challenges.length} thử thách đang hiển thị. Hãy chọn challenge phù hợp với nhịp học hiện tại của bạn.`
          : "Chưa có thử thách nào trong dữ liệu hiện tại."
      );
      view.setMentorNote(
        notificationResponse.data[0]?.content ||
          "Challenge chỉ là lớp bổ trợ động lực. Hãy đảm bảo roadmap và skill gap vẫn được cập nhật đều đặn."
      );
      view.setMentorMetrics([
        { label: "Challenge đang mở", value: `${challenges.length}` },
        { label: "Đang tham gia", value: `${myChallenges.length}` },
        { label: "Đang xem", value: selectedChallenge?.title || "Chưa chọn" }
      ]);

      setHtml(
        refs.metrics,
        [
          renderMetricCard({
            label: "Thử thách đang mở",
            value: `${challenges.length}`,
            trend: "Không gian duy trì động lực học tập"
          }),
          renderMetricCard({
            label: "Đã tham gia",
            value: `${myChallenges.length}`,
            trend: myChallenges.length ? "Bạn đã bước vào hành trình challenge" : "Chưa tham gia challenge nào",
            tone: myChallenges.length ? "success" : "warning"
          }),
          renderMetricCard({
            label: "Người tham gia cao nhất",
            value: detail?.participant_count ? `${detail.participant_count}` : "0",
            trend: detail?.title || "Chưa chọn challenge"
          }),
          renderMetricCard({
            label: "Kỹ năng liên quan",
            value: detail?.skill_name || "Chưa có",
            trend: "Challenge chỉ bổ trợ cho hành trình học"
          })
        ].join("")
      );

      setHtml(
        refs.statusTag,
        renderStatusTag(challenges.length ? "Đang có thử thách mở" : "Chưa có thử thách", challenges.length ? "success" : "warning")
      );

      setHtml(
        refs.challengeList,
        challenges.length
          ? challenges.map((challenge) => renderChallengeCard(challenge, "browse")).join("")
          : renderEmptyState("Chưa có thử thách", "Seed hiện tại chưa có challenge hoặc backend chưa tìm thấy dữ liệu.")
      );

      setHtml(
        refs.myChallenges,
        myChallenges.length
          ? myChallenges.map((challenge) => renderChallengeCard(challenge, "joined")).join("")
          : renderEmptyState("Chưa tham gia challenge nào", "Chọn thử thách phù hợp rồi tham gia để theo dõi tiến độ cộng đồng.")
      );

      renderDetail(detail);
      renderLeaderboard(detail?.leaderboard || []);
    } catch (error) {
      view.setMessage(error.message || "Không thể tải trang cộng đồng & thử thách.", "error");
      setHtml(
        refs.challengeList,
        renderEmptyState("Không tải được challenge", "Kiểm tra lại backend hoặc phiên đăng nhập rồi thử lại.")
      );
    }
  };

  const handleActionClick = async (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.dataset.openChallenge) {
      selectedChallengeId = Number(target.dataset.openChallenge);
      await loadPage();
      return;
    }

    if (target.dataset.joinChallenge) {
      try {
        await apiService.joinChallenge(Number(target.dataset.joinChallenge));
        view.setMessage("Đã tham gia thử thách thành công.", "success");
        selectedChallengeId = Number(target.dataset.joinChallenge);
        await loadPage();
      } catch (error) {
        view.setMessage(error.message || "Không thể tham gia thử thách.", "error");
      }
    }
  };

  refs.challengeList?.addEventListener("click", handleActionClick);
  refs.myChallenges?.addEventListener("click", handleActionClick);

  loadPage();
}
