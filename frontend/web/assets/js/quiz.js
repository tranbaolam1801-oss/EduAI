import { apiService } from "./api.js";
import {
  buildOptions,
  formatDateTime,
  formatPercent,
  getDifficultyLabel,
  getQuizStatusLabel,
  initializeLayout,
  renderEmptyState,
  renderMetricCard,
  renderStatusTag,
  serializeForm,
  setElementOptions,
  setHtml,
  setText
} from "./layout.js";

const view = initializeLayout({ pageKey: "quiz", requireAuth: true });

if (view) {
  const refs = {
    metrics: document.querySelector("#quiz-metrics"),
    statusTag: document.querySelector("#quiz-status-tag"),
    generateForm: document.querySelector("#quiz-generate-form"),
    skillSelect: document.querySelector("#quiz-skill-select"),
    cardList: document.querySelector("#quiz-card-list"),
    attemptHistory: document.querySelector("#quiz-attempt-history"),
    detailTitle: document.querySelector("#quiz-detail-title"),
    detailMeta: document.querySelector("#quiz-detail-meta"),
    detailDescription: document.querySelector("#quiz-detail-description"),
    startButton: document.querySelector("#quiz-start-button"),
    questionList: document.querySelector("#quiz-question-list"),
    attemptForm: document.querySelector("#quiz-attempt-form")
  };

  let selectedQuizId = null;
  let selectedQuizDetail = null;
  let activeAttempt = null;

  const renderQuestionCard = (question, index) => `
    <article class="quiz-card">
      <h4 class="quiz-card__title">Câu ${index + 1}. ${question.question_text}</h4>
      <p class="helper-text">${question.explanation || "Chọn đáp án phù hợp nhất."}</p>
      <div class="list-stack">
        ${(question.options || [])
          .map(
            (option) => `
              <label class="resource-card quiz-option">
                <input type="radio" name="question-${question.question_id}" value="${option.option_text}" />
                <span>${option.option_text}</span>
              </label>
            `
          )
          .join("")}
      </div>
    </article>
  `;

  const loadPage = async () => {
    try {
      const [skillsResponse, quizzesResponse, attemptsResponse] = await Promise.all([
        apiService.getSkills(),
        apiService.getQuizzes({ limit: 12 }),
        apiService.getMyQuizAttempts().catch(() => ({ data: [] }))
      ]);

      setElementOptions(refs.skillSelect, skillsResponse.data, "", "Chọn kỹ năng", "skill_id", "skill_name");

      const quizzes = quizzesResponse.data;
      const attempts = attemptsResponse.data;
      const selectedQuiz = quizzes.find((quiz) => quiz.quiz_id === Number(selectedQuizId)) || quizzes[0] || null;
      selectedQuizId = selectedQuiz?.quiz_id || null;

      selectedQuizDetail = selectedQuiz ? (await apiService.getQuizDetail(selectedQuiz.quiz_id)).data : null;

      const latestAttempt = attempts[0] || null;
      const gradedAttempts = attempts.filter((attempt) => attempt.status === "GRADED");
      const averageScore =
        gradedAttempts.length > 0
          ? Math.round(
              gradedAttempts.reduce((sum, attempt) => sum + Number(attempt.score || 0), 0) / gradedAttempts.length
            )
          : 0;

      view.setQuickNote(
        selectedQuizDetail
          ? `Quiz hiện tại có ${selectedQuizDetail.questions.length} câu hỏi và sẽ ghi điểm trực tiếp về QuizAttempts khi nộp bài.`
          : "Hãy tạo hoặc chọn một bài kiểm tra để bắt đầu đánh giá kỹ năng."
      );
      view.setMentorNote(
        latestAttempt?.ai_feedback ||
          "Sau khi nộp bài, AI Mentor sẽ dùng điểm số và phản hồi để gợi ý bước học tiếp theo."
      );
      view.setMentorMetrics([
        { label: "Quiz đã có", value: `${quizzes.length}` },
        { label: "Điểm gần nhất", value: latestAttempt?.score ? `${latestAttempt.score}` : "Chưa có" },
        { label: "Kỹ năng trọng tâm", value: selectedQuizDetail?.skill_name || "Đang chờ" }
      ]);

      setHtml(
        refs.metrics,
        [
          renderMetricCard({
            label: "Số quiz hiện có",
            value: `${quizzes.length}`,
            trend: "Dữ liệu từ Quizzes"
          }),
          renderMetricCard({
            label: "Lượt làm bài",
            value: `${attempts.length}`,
            trend: "Dữ liệu từ QuizAttempts"
          }),
          renderMetricCard({
            label: "Điểm trung bình",
            value: gradedAttempts.length ? `${averageScore}` : "Chưa có",
            trend: gradedAttempts.length ? "Các lượt đã chấm điểm" : "Chưa có lượt đã chấm"
          }),
          renderMetricCard({
            label: "Quiz đang xem",
            value: selectedQuizDetail ? `${selectedQuizDetail.questions.length} câu` : "Chưa có",
            trend: selectedQuizDetail?.quiz_title || "Hãy chọn quiz"
          })
        ].join("")
      );

      setHtml(
        refs.statusTag,
        renderStatusTag(selectedQuizDetail ? "Sẵn sàng làm bài" : "Chưa có quiz", selectedQuizDetail ? "success" : "warning")
      );

      setHtml(
        refs.cardList,
        quizzes.length
          ? quizzes
              .map(
                (quiz) => `
                  <article class="quiz-card ${quiz.quiz_id === selectedQuizId ? "job-card--active" : ""}">
                    <h4 class="quiz-card__title">${quiz.quiz_title}</h4>
                    <div class="job-card__meta">
                      <span>${quiz.skill_name || "Không gắn kỹ năng"}</span>
                      <strong>${quiz.question_count} câu</strong>
                    </div>
                    <p class="helper-text">${getDifficultyLabel(quiz.difficulty_level)} • ${quiz.time_limit_minutes || 0} phút</p>
                    <div class="career-actions">
                      <button class="secondary-button" type="button" data-open-quiz="${quiz.quiz_id}">Xem quiz</button>
                    </div>
                  </article>
                `
              )
              .join("")
          : renderEmptyState("Chưa có bài kiểm tra", "Tạo quiz mới theo kỹ năng để bắt đầu đánh giá.")
      );

      setHtml(
        refs.attemptHistory,
        attempts.length
          ? attempts
              .map(
                (attempt) => `
                  <article class="schedule-item">
                    <div>
                      <strong>${attempt.quiz_title}</strong>
                      <p class="helper-text">${formatDateTime(attempt.started_at)} • ${getQuizStatusLabel(attempt.status)}</p>
                    </div>
                    <div>
                      <div>${attempt.score !== null ? `${attempt.score}` : "Chưa chấm"}</div>
                      <small class="helper-text">${attempt.result_status || "Đang làm"}</small>
                    </div>
                  </article>
                `
              )
              .join("")
          : renderEmptyState("Chưa có lượt làm bài", "Bắt đầu một quiz để hệ thống lưu lại lịch sử đánh giá.")
      );

      setText(refs.detailTitle, selectedQuizDetail?.quiz_title || "Chưa chọn bài kiểm tra");
      setText(
        refs.detailMeta,
        selectedQuizDetail
          ? `${selectedQuizDetail.skill_name || "Không gắn kỹ năng"} • ${getDifficultyLabel(selectedQuizDetail.difficulty_level)} • ${selectedQuizDetail.time_limit_minutes || 0} phút`
          : "Hãy chọn một quiz để xem chi tiết."
      );
      setText(refs.detailDescription, selectedQuizDetail?.description || "Thông tin chi tiết và danh sách câu hỏi sẽ hiển thị ở đây.");
      setHtml(
        refs.questionList,
        selectedQuizDetail?.questions?.length
          ? selectedQuizDetail.questions.map((question, index) => renderQuestionCard(question, index)).join("")
          : renderEmptyState("Chưa có câu hỏi", "Quiz này hiện chưa có câu hỏi để làm bài.")
      );

      refs.startButton.disabled = !selectedQuizDetail;
      refs.attemptForm.hidden = !activeAttempt;
    } catch (error) {
      view.setMessage(error.message || "Không thể tải trang kiểm tra & đánh giá.", "error");
      setHtml(
        refs.cardList,
        renderEmptyState("Không tải được quiz", "Kiểm tra lại backend, dữ liệu kỹ năng hoặc phiên đăng nhập rồi thử lại.")
      );
    }
  };

  refs.generateForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const payload = serializeForm(refs.generateForm);
      const response = await apiService.generateQuiz({
        skill_id: Number(payload.skill_id),
        difficulty_level: payload.difficulty_level,
        number_of_questions: Number(payload.number_of_questions),
        time_limit_minutes: payload.time_limit_minutes ? Number(payload.time_limit_minutes) : undefined
      });
      selectedQuizId = response.data.quiz_id;
      activeAttempt = null;
      refs.attemptForm.hidden = true;
      view.setMessage("Đã tạo bài kiểm tra mới thành công.", "success");
      await loadPage();
    } catch (error) {
      view.setMessage(error.message || "Không thể tạo quiz mới.", "error");
    }
  });

  refs.cardList?.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.dataset.openQuiz) {
      return;
    }

    selectedQuizId = Number(target.dataset.openQuiz);
    activeAttempt = null;
    refs.attemptForm.hidden = true;
    await loadPage();
  });

  refs.startButton?.addEventListener("click", async () => {
    if (!selectedQuizDetail) {
      return;
    }

    try {
      activeAttempt = (await apiService.createQuizAttempt({ quiz_id: selectedQuizDetail.quiz_id })).data;
      refs.attemptForm.reset();
      refs.attemptForm.hidden = false;
      view.setMessage("Đã bắt đầu lượt làm bài mới. Hãy trả lời toàn bộ câu hỏi rồi nộp bài.", "success");
    } catch (error) {
      view.setMessage(error.message || "Không thể bắt đầu lượt làm bài.", "error");
    }
  });

  refs.attemptForm?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!activeAttempt || !selectedQuizDetail) {
      view.setMessage("Hãy bắt đầu lượt làm bài trước khi nộp bài.", "error");
      return;
    }

    const answers = selectedQuizDetail.questions.map((question) => {
      const field = refs.attemptForm.querySelector(`[name="question-${question.question_id}"]:checked`);
      return {
        question_id: question.question_id,
        user_answer: field?.value || ""
      };
    });

    if (answers.some((answer) => !answer.user_answer)) {
      view.setMessage("Hãy trả lời đầy đủ tất cả câu hỏi trước khi nộp bài.", "error");
      return;
    }

    try {
      const response = await apiService.submitQuizAttempt(activeAttempt.attempt_id, { answers });
      activeAttempt = null;
      refs.attemptForm.hidden = true;
      view.setMessage(
        `Đã nộp bài thành công. Điểm hiện tại: ${response.data.score}. ${response.data.ai_feedback || ""}`,
        "success"
      );
      await loadPage();
    } catch (error) {
      view.setMessage(error.message || "Không thể nộp bài kiểm tra.", "error");
    }
  });

  loadPage();
}
