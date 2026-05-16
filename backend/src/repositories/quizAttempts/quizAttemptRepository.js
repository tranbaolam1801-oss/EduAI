import sql from "mssql";

import { getDatabasePool } from "../../config/database.js";

export const createQuizAttempt = async (userId, quizId) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("userId", userId)
    .input("quizId", quizId)
    .query(`
      INSERT INTO QuizAttempts (user_id, quiz_id)
      OUTPUT
        INSERTED.attempt_id,
        INSERTED.user_id,
        INSERTED.quiz_id,
        INSERTED.started_at,
        INSERTED.submitted_at,
        INSERTED.score,
        INSERTED.status,
        INSERTED.ai_feedback
      VALUES (@userId, @quizId);
    `);

  return result.recordset[0];
};

export const findQuizAttemptByIdAndUserId = async (attemptId, userId) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("attemptId", attemptId)
    .input("userId", userId)
    .query(`
      SELECT
        qa.attempt_id,
        qa.user_id,
        qa.quiz_id,
        q.quiz_title,
        q.skill_id,
        s.skill_name,
        q.passing_score,
        qa.started_at,
        qa.submitted_at,
        qa.score,
        qa.status,
        qa.ai_feedback
      FROM QuizAttempts qa
      JOIN Quizzes q ON q.quiz_id = qa.quiz_id
      LEFT JOIN Skills s ON s.skill_id = q.skill_id
      WHERE qa.attempt_id = @attemptId
        AND qa.user_id = @userId;
    `);

  return result.recordset[0] || null;
};

export const getQuizAttemptAnswers = async (attemptId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("attemptId", attemptId).query(`
    SELECT
      qaa.answer_id,
      qaa.attempt_id,
      qaa.question_id,
      qq.question_text,
      qaa.user_answer,
      qaa.is_correct,
      qaa.earned_score
    FROM QuizAttemptAnswers qaa
    JOIN QuizQuestions qq ON qq.question_id = qaa.question_id
    WHERE qaa.attempt_id = @attemptId
    ORDER BY qaa.answer_id;
  `);

  return result.recordset;
};

export const replaceQuizAttemptAnswers = async (attemptId, answers) => {
  const pool = await getDatabasePool();
  const transaction = new sql.Transaction(pool);

  await transaction.begin();

  try {
    await new sql.Request(transaction)
      .input("attemptId", attemptId)
      .query("DELETE FROM QuizAttemptAnswers WHERE attempt_id = @attemptId;");

    for (const answer of answers) {
      await new sql.Request(transaction)
        .input("attemptId", attemptId)
        .input("questionId", answer.question_id)
        .input("userAnswer", answer.user_answer ?? null)
        .input("isCorrect", answer.is_correct === null ? null : answer.is_correct ? 1 : 0)
        .input("earnedScore", answer.earned_score ?? null)
        .query(`
          INSERT INTO QuizAttemptAnswers (
            attempt_id,
            question_id,
            user_answer,
            is_correct,
            earned_score
          )
          VALUES (
            @attemptId,
            @questionId,
            @userAnswer,
            @isCorrect,
            @earnedScore
          );
        `);
    }

    await transaction.commit();
  } catch (error) {
    if (transaction._aborted !== true) {
      await transaction.rollback();
    }

    throw error;
  }
};

export const submitQuizAttempt = async ({ attemptId, score, aiFeedback }) => {
  const pool = await getDatabasePool();
  await pool
    .request()
    .input("attempt_id", attemptId)
    .input("score", score)
    .input("ai_feedback", aiFeedback ?? null)
    .execute("sp_SubmitQuizAttempt");
};

export const getQuizAttemptsByUserId = async (userId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("userId", userId).query(`
    SELECT
      qa.attempt_id,
      qa.user_id,
      qa.quiz_id,
      q.quiz_title,
      q.skill_id,
      s.skill_name,
      qa.started_at,
      qa.submitted_at,
      qa.score,
      q.passing_score,
      qa.status,
      qa.ai_feedback,
      CASE
        WHEN qa.score IS NULL THEN NULL
        WHEN qa.score >= q.passing_score THEN N'PASS'
        ELSE N'FAIL'
      END AS result_status
    FROM QuizAttempts qa
    JOIN Quizzes q ON q.quiz_id = qa.quiz_id
    LEFT JOIN Skills s ON s.skill_id = q.skill_id
    WHERE qa.user_id = @userId
    ORDER BY qa.started_at DESC, qa.attempt_id DESC;
  `);

  return result.recordset;
};
