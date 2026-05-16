import { getDatabasePool } from "../../config/database.js";

export const getChallenges = async ({ userId = null, limit = 20, status = null } = {}) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("userId", userId)
    .input("limit", limit)
    .input("status", status)
    .query(`
      SELECT TOP (@limit)
        c.challenge_id,
        c.skill_id,
        s.skill_name,
        c.title,
        c.description,
        c.start_date,
        c.end_date,
        c.max_score,
        c.status,
        COUNT(cp_all.user_id) AS participant_count,
        cp_user.joined_at AS my_joined_at,
        cp_user.score AS my_score,
        cp_user.status AS my_status
      FROM Challenges c
      LEFT JOIN Skills s ON s.skill_id = c.skill_id
      LEFT JOIN ChallengeParticipants cp_all ON cp_all.challenge_id = c.challenge_id
      LEFT JOIN ChallengeParticipants cp_user
        ON cp_user.challenge_id = c.challenge_id
       AND cp_user.user_id = @userId
      WHERE (@status IS NULL OR c.status = @status)
      GROUP BY
        c.challenge_id,
        c.skill_id,
        s.skill_name,
        c.title,
        c.description,
        c.start_date,
        c.end_date,
        c.max_score,
        c.status,
        cp_user.joined_at,
        cp_user.score,
        cp_user.status
      ORDER BY
        CASE c.status
          WHEN N'OPEN' THEN 0
          WHEN N'DRAFT' THEN 1
          ELSE 2
        END,
        c.start_date DESC,
        c.challenge_id DESC;
    `);

  return result.recordset;
};

export const findChallengeById = async (challengeId, userId = null) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("challengeId", challengeId)
    .input("userId", userId)
    .query(`
      SELECT
        c.challenge_id,
        c.skill_id,
        s.skill_name,
        c.title,
        c.description,
        c.start_date,
        c.end_date,
        c.max_score,
        c.status,
        COUNT(cp_all.user_id) AS participant_count,
        cp_user.joined_at AS my_joined_at,
        cp_user.score AS my_score,
        cp_user.status AS my_status
      FROM Challenges c
      LEFT JOIN Skills s ON s.skill_id = c.skill_id
      LEFT JOIN ChallengeParticipants cp_all ON cp_all.challenge_id = c.challenge_id
      LEFT JOIN ChallengeParticipants cp_user
        ON cp_user.challenge_id = c.challenge_id
       AND cp_user.user_id = @userId
      WHERE c.challenge_id = @challengeId
      GROUP BY
        c.challenge_id,
        c.skill_id,
        s.skill_name,
        c.title,
        c.description,
        c.start_date,
        c.end_date,
        c.max_score,
        c.status,
        cp_user.joined_at,
        cp_user.score,
        cp_user.status;
    `);

  return result.recordset[0] || null;
};

export const getChallengeLeaderboard = async (challengeId, limit = 10) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("challengeId", challengeId).input("limit", limit).query(`
    SELECT TOP (@limit)
      cp.challenge_id,
      cp.user_id,
      u.full_name,
      cp.joined_at,
      cp.score,
      cp.status
    FROM ChallengeParticipants cp
    JOIN Users u ON u.user_id = cp.user_id
    WHERE cp.challenge_id = @challengeId
    ORDER BY cp.score DESC, cp.joined_at ASC, cp.user_id ASC;
  `);

  return result.recordset;
};

export const findChallengeParticipant = async (challengeId, userId) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("challengeId", challengeId)
    .input("userId", userId)
    .query(`
      SELECT
        challenge_id,
        user_id,
        joined_at,
        score,
        status
      FROM ChallengeParticipants
      WHERE challenge_id = @challengeId
        AND user_id = @userId;
    `);

  return result.recordset[0] || null;
};

export const createChallengeParticipant = async (challengeId, userId) => {
  const pool = await getDatabasePool();
  const result = await pool
    .request()
    .input("challengeId", challengeId)
    .input("userId", userId)
    .query(`
      INSERT INTO ChallengeParticipants (
        challenge_id,
        user_id
      )
      OUTPUT
        INSERTED.challenge_id,
        INSERTED.user_id,
        INSERTED.joined_at,
        INSERTED.score,
        INSERTED.status
      VALUES (
        @challengeId,
        @userId
      );
    `);

  return result.recordset[0];
};

export const getChallengesByUserId = async (userId) => {
  const pool = await getDatabasePool();
  const result = await pool.request().input("userId", userId).query(`
    SELECT
      cp.challenge_id,
      cp.user_id,
      cp.joined_at,
      cp.score,
      cp.status AS participant_status,
      c.skill_id,
      s.skill_name,
      c.title,
      c.description,
      c.start_date,
      c.end_date,
      c.max_score,
      c.status AS status,
      participant_stats.participant_count,
      cp.joined_at AS my_joined_at,
      cp.score AS my_score,
      cp.status AS my_status
    FROM ChallengeParticipants cp
    JOIN Challenges c ON c.challenge_id = cp.challenge_id
    LEFT JOIN Skills s ON s.skill_id = c.skill_id
    OUTER APPLY (
      SELECT COUNT(*) AS participant_count
      FROM ChallengeParticipants
      WHERE challenge_id = c.challenge_id
    ) participant_stats
    WHERE cp.user_id = @userId
    ORDER BY cp.joined_at DESC, cp.challenge_id DESC;
  `);

  return result.recordset;
};
