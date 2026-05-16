import sql from "mssql";

import { getDatabasePool } from "../../config/database.js";

const mapQuizQuestions = (rows) => {
  const questionMap = new Map();

  rows.forEach((row) => {
    if (!questionMap.has(row.question_id)) {
      questionMap.set(row.question_id, {
        question_id: row.question_id,
        quiz_id: row.quiz_id,
        question_text: row.question_text,
        question_type: row.question_type,
        correct_answer: row.correct_answer,
        score: row.score,
        explanation: row.explanation,
        options: []
      });
    }

    if (row.option_id) {
      questionMap.get(row.question_id).options.push({
        option_id: row.option_id,
        option_text: row.option_text,
        is_correct: row.is_correct
      });
    }
  });

  return [...questionMap.values()];
};

export const getQuizzes = async ({ skillId, difficultyLevel, limit = 20 } = {}) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("skillId", skillId ?? null)
    .input("difficultyLevel", difficultyLevel ?? null)
    .input("limit", limit)
    .query(`
      SELECT TOP (@limit)
        q.quiz_id,
        q.skill_id,
        s.skill_name,
        q.quiz_title,
        q.description,
        q.difficulty_level,
        q.time_limit_minutes,
        q.passing_score,
        q.created_by_ai,
        COUNT(qq.question_id) AS question_count
      FROM Quizzes q
      LEFT JOIN Skills s ON s.skill_id = q.skill_id
      LEFT JOIN QuizQuestions qq ON qq.quiz_id = q.quiz_id
      WHERE (@skillId IS NULL OR q.skill_id = @skillId)
        AND (@difficultyLevel IS NULL OR q.difficulty_level = @difficultyLevel)
      GROUP BY
        q.quiz_id,
        q.skill_id,
        s.skill_name,
        q.quiz_title,
        q.description,
        q.difficulty_level,
        q.time_limit_minutes,
        q.passing_score,
        q.created_by_ai
      ORDER BY q.quiz_id DESC;
    `);

  return result.recordset;
};

export const findQuizById = async (quizId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("quizId", quizId).query(`
    SELECT
      q.quiz_id,
      q.skill_id,
      s.skill_name,
      q.quiz_title,
      q.description,
      q.difficulty_level,
      q.time_limit_minutes,
      q.passing_score,
      q.created_by_ai
    FROM Quizzes q
    LEFT JOIN Skills s ON s.skill_id = q.skill_id
    WHERE q.quiz_id = @quizId;
  `);

  return result.recordset[0] || null;
};

export const getQuizQuestions = async (quizId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("quizId", quizId).query(`
    SELECT
      qq.question_id,
      qq.quiz_id,
      qq.question_text,
      qq.question_type,
      qq.correct_answer,
      qq.score,
      qq.explanation,
      qo.option_id,
      qo.option_text,
      qo.is_correct
    FROM QuizQuestions qq
    LEFT JOIN QuizOptions qo ON qo.question_id = qq.question_id
    WHERE qq.quiz_id = @quizId
    ORDER BY qq.question_id, qo.option_id;
  `);

  return mapQuizQuestions(result.recordset);
};

export const createQuizWithQuestions = async ({
  skillId,
  quizTitle,
  description,
  difficultyLevel,
  timeLimitMinutes,
  passingScore,
  createdByAi,
  questions
}) => {
  const pool = await getDatabasePool();
  const transaction = new sql.Transaction(pool);

  await transaction.begin();

  try {
    const quizResult = await new sql.Request(transaction)
      .input("skillId", skillId ?? null)
      .input("quizTitle", quizTitle)
      .input("description", description ?? null)
      .input("difficultyLevel", difficultyLevel)
      .input("timeLimitMinutes", timeLimitMinutes ?? null)
      .input("passingScore", passingScore)
      .input("createdByAi", createdByAi ? 1 : 0)
      .query(`
        INSERT INTO Quizzes (
          skill_id,
          quiz_title,
          description,
          difficulty_level,
          time_limit_minutes,
          passing_score,
          created_by_ai
        )
        OUTPUT INSERTED.quiz_id
        VALUES (
          @skillId,
          @quizTitle,
          @description,
          @difficultyLevel,
          @timeLimitMinutes,
          @passingScore,
          @createdByAi
        );
      `);

    const quizId = quizResult.recordset[0].quiz_id;

    for (const question of questions) {
      const questionResult = await new sql.Request(transaction)
        .input("quizId", quizId)
        .input("questionText", question.question_text)
        .input("questionType", question.question_type)
        .input("correctAnswer", question.correct_answer ?? null)
        .input("score", question.score ?? 1)
        .input("explanation", question.explanation ?? null)
        .query(`
          INSERT INTO QuizQuestions (
            quiz_id,
            question_text,
            question_type,
            correct_answer,
            score,
            explanation
          )
          OUTPUT INSERTED.question_id
          VALUES (
            @quizId,
            @questionText,
            @questionType,
            @correctAnswer,
            @score,
            @explanation
          );
        `);

      const questionId = questionResult.recordset[0].question_id;

      for (const option of question.options || []) {
        await new sql.Request(transaction)
          .input("questionId", questionId)
          .input("optionText", option.option_text)
          .input("isCorrect", option.is_correct ? 1 : 0)
          .query(`
            INSERT INTO QuizOptions (
              question_id,
              option_text,
              is_correct
            )
            VALUES (
              @questionId,
              @optionText,
              @isCorrect
            );
          `);
      }
    }

    await transaction.commit();
    return findQuizById(quizId);
  } catch (error) {
    if (transaction._aborted !== true) {
      await transaction.rollback();
    }

    throw error;
  }
};
