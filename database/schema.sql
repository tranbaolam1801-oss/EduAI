/* =============================================================
   DATABASE: AI_LearningCareerDB
   Mục đích: CSDL cho hệ thống AI cá nhân hóa lộ trình học tập
            và định hướng nghề nghiệp cho sinh viên đa ngành.
   Hệ QTCSDL: Microsoft SQL Server
   Ghi chú: Script có thể chạy trực tiếp trên SQL Server Management Studio.
   ============================================================= */

IF DB_ID(N'AI_LearningCareerDB') IS NOT NULL
BEGIN
    ALTER DATABASE AI_LearningCareerDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE AI_LearningCareerDB;
END
GO

CREATE DATABASE AI_LearningCareerDB;
GO
USE AI_LearningCareerDB;
GO

/* =========================
   1. DANH MỤC VÀ NGƯỜI DÙNG
   ========================= */
CREATE TABLE Roles (
    role_id INT IDENTITY(1,1) PRIMARY KEY,
    role_name NVARCHAR(50) NOT NULL UNIQUE,
    description NVARCHAR(255) NULL
);
GO

CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    role_id INT NOT NULL,
    full_name NVARCHAR(120) NOT NULL,
    email NVARCHAR(120) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    phone NVARCHAR(20) NULL,
    status NVARCHAR(20) NOT NULL DEFAULT N'ACTIVE',
    failed_login_count INT NOT NULL DEFAULT 0,
    locked_until DATETIME2 NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NULL,
    CONSTRAINT FK_Users_Roles FOREIGN KEY (role_id) REFERENCES Roles(role_id),
    CONSTRAINT CK_Users_Status CHECK (status IN (N'ACTIVE', N'LOCKED', N'INACTIVE')),
    CONSTRAINT CK_Users_Email CHECK (email LIKE N'%_@_%._%')
);
GO

CREATE TABLE AcademicFields (
    field_id INT IDENTITY(1,1) PRIMARY KEY,
    field_name NVARCHAR(120) NOT NULL UNIQUE,
    description NVARCHAR(500) NULL
);
GO

CREATE TABLE StudentProfiles (
    profile_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    field_id INT NULL,
    university NVARCHAR(150) NULL,
    major NVARCHAR(150) NULL,
    academic_year INT NULL,
    current_level NVARCHAR(50) NULL,
    study_hours_per_week DECIMAL(5,2) NOT NULL DEFAULT 5,
    target_completion_months INT NOT NULL DEFAULT 6,
    preferred_location NVARCHAR(120) NULL,
    career_goal_note NVARCHAR(500) NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Profiles_Users FOREIGN KEY (user_id) REFERENCES Users(user_id),
    CONSTRAINT FK_Profiles_Fields FOREIGN KEY (field_id) REFERENCES AcademicFields(field_id),
    CONSTRAINT CK_Profiles_Hours CHECK (study_hours_per_week >= 0 AND study_hours_per_week <= 80),
    CONSTRAINT CK_Profiles_Months CHECK (target_completion_months BETWEEN 1 AND 60)
);
GO

/* =========================
   2. KỸ NĂNG VÀ NGHỀ NGHIỆP
   ========================= */
CREATE TABLE SkillCategories (
    category_id INT IDENTITY(1,1) PRIMARY KEY,
    category_name NVARCHAR(120) NOT NULL UNIQUE,
    description NVARCHAR(500) NULL
);
GO

CREATE TABLE Skills (
    skill_id INT IDENTITY(1,1) PRIMARY KEY,
    category_id INT NULL,
    skill_name NVARCHAR(120) NOT NULL UNIQUE,
    description NVARCHAR(500) NULL,
    difficulty_level NVARCHAR(20) NOT NULL DEFAULT N'BASIC',
    CONSTRAINT FK_Skills_Categories FOREIGN KEY (category_id) REFERENCES SkillCategories(category_id),
    CONSTRAINT CK_Skills_Difficulty CHECK (difficulty_level IN (N'BASIC', N'INTERMEDIATE', N'ADVANCED'))
);
GO

CREATE TABLE Careers (
    career_id INT IDENTITY(1,1) PRIMARY KEY,
    field_id INT NULL,
    career_name NVARCHAR(150) NOT NULL UNIQUE,
    description NVARCHAR(800) NULL,
    market_demand_level NVARCHAR(20) NULL,
    avg_salary_min DECIMAL(18,2) NULL,
    avg_salary_max DECIMAL(18,2) NULL,
    CONSTRAINT FK_Careers_Fields FOREIGN KEY (field_id) REFERENCES AcademicFields(field_id),
    CONSTRAINT CK_Careers_Demand CHECK (market_demand_level IS NULL OR market_demand_level IN (N'LOW', N'MEDIUM', N'HIGH')),
    CONSTRAINT CK_Careers_Salary CHECK ((avg_salary_min IS NULL AND avg_salary_max IS NULL) OR avg_salary_min <= avg_salary_max)
);
GO

CREATE TABLE CareerSkills (
    career_id INT NOT NULL,
    skill_id INT NOT NULL,
    required_level INT NOT NULL,
    importance_weight DECIMAL(5,2) NOT NULL DEFAULT 1,
    is_required BIT NOT NULL DEFAULT 1,
    PRIMARY KEY (career_id, skill_id),
    CONSTRAINT FK_CareerSkills_Careers FOREIGN KEY (career_id) REFERENCES Careers(career_id),
    CONSTRAINT FK_CareerSkills_Skills FOREIGN KEY (skill_id) REFERENCES Skills(skill_id),
    CONSTRAINT CK_CareerSkills_Level CHECK (required_level BETWEEN 0 AND 100),
    CONSTRAINT CK_CareerSkills_Weight CHECK (importance_weight > 0 AND importance_weight <= 10)
);
GO

CREATE TABLE UserCareerGoals (
    goal_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    career_id INT NOT NULL,
    priority_order INT NOT NULL DEFAULT 1,
    target_deadline DATE NULL,
    status NVARCHAR(20) NOT NULL DEFAULT N'ACTIVE',
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_UserCareerGoals_Users FOREIGN KEY (user_id) REFERENCES Users(user_id),
    CONSTRAINT FK_UserCareerGoals_Careers FOREIGN KEY (career_id) REFERENCES Careers(career_id),
    CONSTRAINT CK_UserCareerGoals_Status CHECK (status IN (N'ACTIVE', N'PAUSED', N'COMPLETED', N'CANCELLED')),
    CONSTRAINT UQ_UserCareerGoals UNIQUE (user_id, career_id)
);
GO

CREATE TABLE UserSkills (
    user_id INT NOT NULL,
    skill_id INT NOT NULL,
    current_level INT NOT NULL DEFAULT 0,
    confidence_level INT NULL,
    source NVARCHAR(30) NOT NULL DEFAULT N'SELF_ASSESSMENT',
    last_assessed_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    PRIMARY KEY (user_id, skill_id),
    CONSTRAINT FK_UserSkills_Users FOREIGN KEY (user_id) REFERENCES Users(user_id),
    CONSTRAINT FK_UserSkills_Skills FOREIGN KEY (skill_id) REFERENCES Skills(skill_id),
    CONSTRAINT CK_UserSkills_Level CHECK (current_level BETWEEN 0 AND 100),
    CONSTRAINT CK_UserSkills_Confidence CHECK (confidence_level IS NULL OR confidence_level BETWEEN 0 AND 100),
    CONSTRAINT CK_UserSkills_Source CHECK (source IN (N'SELF_ASSESSMENT', N'QUIZ', N'PROJECT', N'AI_EVALUATION', N'ADMIN'))
);
GO

/* =========================
   3. LỘ TRÌNH HỌC TẬP
   ========================= */
CREATE TABLE LearningRoadmaps (
    roadmap_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    career_id INT NOT NULL,
    title NVARCHAR(200) NOT NULL,
    description NVARCHAR(1000) NULL,
    start_date DATE NOT NULL DEFAULT CONVERT(DATE, GETDATE()),
    expected_end_date DATE NULL,
    status NVARCHAR(20) NOT NULL DEFAULT N'DRAFT',
    ai_generated BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Roadmaps_Users FOREIGN KEY (user_id) REFERENCES Users(user_id),
    CONSTRAINT FK_Roadmaps_Careers FOREIGN KEY (career_id) REFERENCES Careers(career_id),
    CONSTRAINT CK_Roadmaps_Status CHECK (status IN (N'DRAFT', N'ACTIVE', N'COMPLETED', N'PAUSED', N'CANCELLED'))
);
GO

CREATE TABLE RoadmapStages (
    stage_id INT IDENTITY(1,1) PRIMARY KEY,
    roadmap_id INT NOT NULL,
    stage_order INT NOT NULL,
    stage_name NVARCHAR(150) NOT NULL,
    description NVARCHAR(800) NULL,
    expected_weeks INT NOT NULL DEFAULT 1,
    CONSTRAINT FK_Stages_Roadmaps FOREIGN KEY (roadmap_id) REFERENCES LearningRoadmaps(roadmap_id) ON DELETE CASCADE,
    CONSTRAINT UQ_Stages_Order UNIQUE (roadmap_id, stage_order),
    CONSTRAINT CK_Stages_Weeks CHECK (expected_weeks BETWEEN 1 AND 52)
);
GO

CREATE TABLE RoadmapTasks (
    task_id INT IDENTITY(1,1) PRIMARY KEY,
    stage_id INT NOT NULL,
    skill_id INT NULL,
    task_order INT NOT NULL,
    task_title NVARCHAR(200) NOT NULL,
    task_type NVARCHAR(30) NOT NULL DEFAULT N'LESSON',
    description NVARCHAR(1000) NULL,
    estimated_hours DECIMAL(5,2) NOT NULL DEFAULT 1,
    status NVARCHAR(20) NOT NULL DEFAULT N'NOT_STARTED',
    due_date DATE NULL,
    completed_at DATETIME2 NULL,
    CONSTRAINT FK_Tasks_Stages FOREIGN KEY (stage_id) REFERENCES RoadmapStages(stage_id) ON DELETE CASCADE,
    CONSTRAINT FK_Tasks_Skills FOREIGN KEY (skill_id) REFERENCES Skills(skill_id),
    CONSTRAINT UQ_Tasks_Order UNIQUE (stage_id, task_order),
    CONSTRAINT CK_Tasks_Type CHECK (task_type IN (N'LESSON', N'PRACTICE', N'QUIZ', N'PROJECT', N'REVIEW')),
    CONSTRAINT CK_Tasks_Status CHECK (status IN (N'NOT_STARTED', N'IN_PROGRESS', N'COMPLETED', N'SKIPPED')),
    CONSTRAINT CK_Tasks_Hours CHECK (estimated_hours > 0 AND estimated_hours <= 200)
);
GO

CREATE TABLE LearningProgressLogs (
    progress_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    task_id INT NOT NULL,
    progress_percent INT NOT NULL DEFAULT 0,
    study_minutes INT NOT NULL DEFAULT 0,
    note NVARCHAR(1000) NULL,
    logged_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Progress_Users FOREIGN KEY (user_id) REFERENCES Users(user_id),
    CONSTRAINT FK_Progress_Tasks FOREIGN KEY (task_id) REFERENCES RoadmapTasks(task_id),
    CONSTRAINT CK_Progress_Percent CHECK (progress_percent BETWEEN 0 AND 100),
    CONSTRAINT CK_Progress_Minutes CHECK (study_minutes >= 0)
);
GO

/* =========================
   4. TÀI LIỆU, KHÓA HỌC, KIỂM TRA
   ========================= */
CREATE TABLE LearningResources (
    resource_id INT IDENTITY(1,1) PRIMARY KEY,
    skill_id INT NULL,
    title NVARCHAR(250) NOT NULL,
    resource_type NVARCHAR(30) NOT NULL,
    provider NVARCHAR(120) NULL,
    url NVARCHAR(500) NULL,
    difficulty_level NVARCHAR(20) NOT NULL DEFAULT N'BASIC',
    estimated_hours DECIMAL(5,2) NULL,
    rating DECIMAL(3,2) NULL,
    is_free BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_Resources_Skills FOREIGN KEY (skill_id) REFERENCES Skills(skill_id),
    CONSTRAINT CK_Resources_Type CHECK (resource_type IN (N'COURSE', N'VIDEO', N'BOOK', N'ARTICLE', N'EXERCISE', N'PROJECT', N'PODCAST')),
    CONSTRAINT CK_Resources_Difficulty CHECK (difficulty_level IN (N'BASIC', N'INTERMEDIATE', N'ADVANCED')),
    CONSTRAINT CK_Resources_Rating CHECK (rating IS NULL OR rating BETWEEN 0 AND 5)
);
GO

CREATE TABLE TaskResources (
    task_id INT NOT NULL,
    resource_id INT NOT NULL,
    priority_order INT NOT NULL DEFAULT 1,
    PRIMARY KEY (task_id, resource_id),
    CONSTRAINT FK_TaskResources_Tasks FOREIGN KEY (task_id) REFERENCES RoadmapTasks(task_id) ON DELETE CASCADE,
    CONSTRAINT FK_TaskResources_Resources FOREIGN KEY (resource_id) REFERENCES LearningResources(resource_id)
);
GO

CREATE TABLE Quizzes (
    quiz_id INT IDENTITY(1,1) PRIMARY KEY,
    skill_id INT NULL,
    quiz_title NVARCHAR(200) NOT NULL,
    description NVARCHAR(800) NULL,
    difficulty_level NVARCHAR(20) NOT NULL DEFAULT N'BASIC',
    time_limit_minutes INT NULL,
    passing_score DECIMAL(5,2) NOT NULL DEFAULT 60,
    created_by_ai BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_Quizzes_Skills FOREIGN KEY (skill_id) REFERENCES Skills(skill_id),
    CONSTRAINT CK_Quizzes_Difficulty CHECK (difficulty_level IN (N'BASIC', N'INTERMEDIATE', N'ADVANCED')),
    CONSTRAINT CK_Quizzes_Time CHECK (time_limit_minutes IS NULL OR time_limit_minutes BETWEEN 1 AND 240),
    CONSTRAINT CK_Quizzes_Passing CHECK (passing_score BETWEEN 0 AND 100)
);
GO

CREATE TABLE QuizQuestions (
    question_id INT IDENTITY(1,1) PRIMARY KEY,
    quiz_id INT NOT NULL,
    question_text NVARCHAR(MAX) NOT NULL,
    question_type NVARCHAR(30) NOT NULL DEFAULT N'MCQ',
    correct_answer NVARCHAR(MAX) NULL,
    score DECIMAL(5,2) NOT NULL DEFAULT 1,
    explanation NVARCHAR(MAX) NULL,
    CONSTRAINT FK_Questions_Quizzes FOREIGN KEY (quiz_id) REFERENCES Quizzes(quiz_id) ON DELETE CASCADE,
    CONSTRAINT CK_Questions_Type CHECK (question_type IN (N'MCQ', N'TRUE_FALSE', N'SHORT_ANSWER', N'CODING', N'CASE_STUDY')),
    CONSTRAINT CK_Questions_Score CHECK (score > 0)
);
GO

CREATE TABLE QuizOptions (
    option_id INT IDENTITY(1,1) PRIMARY KEY,
    question_id INT NOT NULL,
    option_text NVARCHAR(MAX) NOT NULL,
    is_correct BIT NOT NULL DEFAULT 0,
    CONSTRAINT FK_Options_Questions FOREIGN KEY (question_id) REFERENCES QuizQuestions(question_id) ON DELETE CASCADE
);
GO

CREATE TABLE QuizAttempts (
    attempt_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    quiz_id INT NOT NULL,
    started_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    submitted_at DATETIME2 NULL,
    score DECIMAL(5,2) NULL,
    status NVARCHAR(20) NOT NULL DEFAULT N'IN_PROGRESS',
    ai_feedback NVARCHAR(MAX) NULL,
    CONSTRAINT FK_Attempts_Users FOREIGN KEY (user_id) REFERENCES Users(user_id),
    CONSTRAINT FK_Attempts_Quizzes FOREIGN KEY (quiz_id) REFERENCES Quizzes(quiz_id),
    CONSTRAINT CK_Attempts_Status CHECK (status IN (N'IN_PROGRESS', N'SUBMITTED', N'GRADED')),
    CONSTRAINT CK_Attempts_Score CHECK (score IS NULL OR score BETWEEN 0 AND 100)
);
GO

CREATE TABLE QuizAttemptAnswers (
    answer_id INT IDENTITY(1,1) PRIMARY KEY,
    attempt_id INT NOT NULL,
    question_id INT NOT NULL,
    user_answer NVARCHAR(MAX) NULL,
    is_correct BIT NULL,
    earned_score DECIMAL(5,2) NULL,
    CONSTRAINT FK_Answers_Attempts FOREIGN KEY (attempt_id) REFERENCES QuizAttempts(attempt_id) ON DELETE CASCADE,
    CONSTRAINT FK_Answers_Questions FOREIGN KEY (question_id) REFERENCES QuizQuestions(question_id),
    CONSTRAINT CK_Answers_Score CHECK (earned_score IS NULL OR earned_score >= 0)
);
GO

/* =========================
   5. AI MENTOR, GỢI Ý, VIỆC LÀM
   ========================= */
CREATE TABLE AIRecommendations (
    recommendation_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    recommendation_type NVARCHAR(40) NOT NULL,
    title NVARCHAR(250) NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    priority_score DECIMAL(5,2) NOT NULL DEFAULT 0,
    status NVARCHAR(20) NOT NULL DEFAULT N'NEW',
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Recommendations_Users FOREIGN KEY (user_id) REFERENCES Users(user_id),
    CONSTRAINT CK_Recommendations_Type CHECK (recommendation_type IN (N'SKILL_GAP', N'ROADMAP', N'RESOURCE', N'JOB', N'MOTIVATION', N'REVIEW')),
    CONSTRAINT CK_Recommendations_Status CHECK (status IN (N'NEW', N'VIEWED', N'APPLIED', N'DISMISSED'))
);
GO

CREATE TABLE ChatSessions (
    session_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    title NVARCHAR(200) NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_ChatSessions_Users FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
GO

CREATE TABLE ChatMessages (
    message_id INT IDENTITY(1,1) PRIMARY KEY,
    session_id INT NOT NULL,
    sender_type NVARCHAR(20) NOT NULL,
    message_content NVARCHAR(MAX) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_ChatMessages_Sessions FOREIGN KEY (session_id) REFERENCES ChatSessions(session_id) ON DELETE CASCADE,
    CONSTRAINT CK_ChatMessages_Sender CHECK (sender_type IN (N'USER', N'AI', N'SYSTEM'))
);
GO

CREATE TABLE Companies (
    company_id INT IDENTITY(1,1) PRIMARY KEY,
    company_name NVARCHAR(200) NOT NULL,
    industry NVARCHAR(120) NULL,
    website NVARCHAR(300) NULL,
    email_public NVARCHAR(120) NULL,
    phone_public NVARCHAR(30) NULL,
    address NVARCHAR(300) NULL,
    city NVARCHAR(120) NULL,
    country NVARCHAR(120) NOT NULL DEFAULT N'Việt Nam',
    CONSTRAINT UQ_Companies_Name_City UNIQUE (company_name, city)
);
GO

CREATE TABLE JobPostings (
    job_id INT IDENTITY(1,1) PRIMARY KEY,
    company_id INT NOT NULL,
    career_id INT NULL,
    job_title NVARCHAR(200) NOT NULL,
    job_description NVARCHAR(MAX) NULL,
    location NVARCHAR(150) NULL,
    working_type NVARCHAR(30) NOT NULL DEFAULT N'FULL_TIME',
    salary_min DECIMAL(18,2) NULL,
    salary_max DECIMAL(18,2) NULL,
    contact_email NVARCHAR(120) NULL,
    apply_url NVARCHAR(500) NULL,
    posted_date DATE NULL,
    deadline DATE NULL,
    status NVARCHAR(20) NOT NULL DEFAULT N'OPEN',
    CONSTRAINT FK_Jobs_Companies FOREIGN KEY (company_id) REFERENCES Companies(company_id),
    CONSTRAINT FK_Jobs_Careers FOREIGN KEY (career_id) REFERENCES Careers(career_id),
    CONSTRAINT CK_Jobs_Type CHECK (working_type IN (N'FULL_TIME', N'PART_TIME', N'INTERNSHIP', N'REMOTE', N'HYBRID')),
    CONSTRAINT CK_Jobs_Status CHECK (status IN (N'OPEN', N'CLOSED', N'DRAFT')),
    CONSTRAINT CK_Jobs_Salary CHECK ((salary_min IS NULL AND salary_max IS NULL) OR salary_min <= salary_max)
);
GO

CREATE TABLE JobSkills (
    job_id INT NOT NULL,
    skill_id INT NOT NULL,
    required_level INT NOT NULL DEFAULT 50,
    PRIMARY KEY (job_id, skill_id),
    CONSTRAINT FK_JobSkills_Jobs FOREIGN KEY (job_id) REFERENCES JobPostings(job_id) ON DELETE CASCADE,
    CONSTRAINT FK_JobSkills_Skills FOREIGN KEY (skill_id) REFERENCES Skills(skill_id),
    CONSTRAINT CK_JobSkills_Level CHECK (required_level BETWEEN 0 AND 100)
);
GO

CREATE TABLE SavedJobs (
    user_id INT NOT NULL,
    job_id INT NOT NULL,
    saved_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    status NVARCHAR(20) NOT NULL DEFAULT N'SAVED',
    PRIMARY KEY (user_id, job_id),
    CONSTRAINT FK_SavedJobs_Users FOREIGN KEY (user_id) REFERENCES Users(user_id),
    CONSTRAINT FK_SavedJobs_Jobs FOREIGN KEY (job_id) REFERENCES JobPostings(job_id),
    CONSTRAINT CK_SavedJobs_Status CHECK (status IN (N'SAVED', N'APPLIED', N'REJECTED', N'INTERVIEW'))
);
GO

/* =========================
   6. CỘNG ĐỒNG, THỬ THÁCH, THÔNG BÁO
   ========================= */
CREATE TABLE Challenges (
    challenge_id INT IDENTITY(1,1) PRIMARY KEY,
    skill_id INT NULL,
    title NVARCHAR(200) NOT NULL,
    description NVARCHAR(1000) NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    max_score INT NOT NULL DEFAULT 100,
    status NVARCHAR(20) NOT NULL DEFAULT N'OPEN',
    CONSTRAINT FK_Challenges_Skills FOREIGN KEY (skill_id) REFERENCES Skills(skill_id),
    CONSTRAINT CK_Challenges_Date CHECK (end_date >= start_date),
    CONSTRAINT CK_Challenges_Status CHECK (status IN (N'OPEN', N'CLOSED', N'DRAFT'))
);
GO

CREATE TABLE ChallengeParticipants (
    challenge_id INT NOT NULL,
    user_id INT NOT NULL,
    joined_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    score INT NOT NULL DEFAULT 0,
    status NVARCHAR(20) NOT NULL DEFAULT N'JOINED',
    PRIMARY KEY (challenge_id, user_id),
    CONSTRAINT FK_Participants_Challenges FOREIGN KEY (challenge_id) REFERENCES Challenges(challenge_id) ON DELETE CASCADE,
    CONSTRAINT FK_Participants_Users FOREIGN KEY (user_id) REFERENCES Users(user_id),
    CONSTRAINT CK_Participants_Score CHECK (score >= 0),
    CONSTRAINT CK_Participants_Status CHECK (status IN (N'JOINED', N'SUBMITTED', N'COMPLETED'))
);
GO

CREATE TABLE Notifications (
    notification_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    title NVARCHAR(200) NOT NULL,
    content NVARCHAR(1000) NULL,
    notification_type NVARCHAR(40) NOT NULL DEFAULT N'SYSTEM',
    is_read BIT NOT NULL DEFAULT 0,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_Notifications_Users FOREIGN KEY (user_id) REFERENCES Users(user_id),
    CONSTRAINT CK_Notifications_Type CHECK (notification_type IN (N'SYSTEM', N'ROADMAP', N'QUIZ', N'JOB', N'CHALLENGE', N'AI'))
);
GO

/* =========================
   7. VIEW BÁO CÁO
   ========================= */
CREATE VIEW vw_SkillGapAnalysis AS
SELECT
    u.user_id,
    u.full_name,
    c.career_id,
    c.career_name,
    s.skill_id,
    s.skill_name,
    ISNULL(us.current_level, 0) AS current_level,
    cs.required_level,
    CASE WHEN cs.required_level - ISNULL(us.current_level, 0) > 0
         THEN cs.required_level - ISNULL(us.current_level, 0)
         ELSE 0 END AS gap_level,
    cs.importance_weight
FROM UserCareerGoals ucg
JOIN Users u ON ucg.user_id = u.user_id
JOIN Careers c ON ucg.career_id = c.career_id
JOIN CareerSkills cs ON c.career_id = cs.career_id
JOIN Skills s ON cs.skill_id = s.skill_id
LEFT JOIN UserSkills us ON us.user_id = u.user_id AND us.skill_id = s.skill_id
WHERE ucg.status = N'ACTIVE';
GO

CREATE VIEW vw_RoadmapProgressSummary AS
SELECT
    lr.roadmap_id,
    lr.user_id,
    lr.title,
    lr.status,
    COUNT(rt.task_id) AS total_tasks,
    SUM(CASE WHEN rt.status = N'COMPLETED' THEN 1 ELSE 0 END) AS completed_tasks,
    CAST(CASE WHEN COUNT(rt.task_id) = 0 THEN 0
              ELSE 100.0 * SUM(CASE WHEN rt.status = N'COMPLETED' THEN 1 ELSE 0 END) / COUNT(rt.task_id)
         END AS DECIMAL(5,2)) AS progress_percent,
    SUM(rt.estimated_hours) AS total_estimated_hours
FROM LearningRoadmaps lr
LEFT JOIN RoadmapStages rs ON lr.roadmap_id = rs.roadmap_id
LEFT JOIN RoadmapTasks rt ON rs.stage_id = rt.stage_id
GROUP BY lr.roadmap_id, lr.user_id, lr.title, lr.status;
GO

CREATE VIEW vw_JobMatchScore AS
SELECT
    u.user_id,
    u.full_name,
    j.job_id,
    j.job_title,
    co.company_name,
    j.location,
    CAST(CASE WHEN COUNT(js.skill_id) = 0 THEN 0
              ELSE 100.0 * SUM(CASE WHEN ISNULL(us.current_level,0) >= js.required_level THEN 1 ELSE 0 END) / COUNT(js.skill_id)
         END AS DECIMAL(5,2)) AS match_percent
FROM Users u
CROSS JOIN JobPostings j
JOIN Companies co ON j.company_id = co.company_id
LEFT JOIN JobSkills js ON j.job_id = js.job_id
LEFT JOIN UserSkills us ON u.user_id = us.user_id AND js.skill_id = us.skill_id
WHERE j.status = N'OPEN'
GROUP BY u.user_id, u.full_name, j.job_id, j.job_title, co.company_name, j.location;
GO

CREATE VIEW vw_QuizResultSummary AS
SELECT
    qa.attempt_id,
    qa.user_id,
    u.full_name,
    qa.quiz_id,
    q.quiz_title,
    s.skill_name,
    qa.started_at,
    qa.submitted_at,
    qa.score,
    q.passing_score,
    CASE WHEN qa.score >= q.passing_score THEN N'PASS' ELSE N'FAIL' END AS result_status,
    qa.status
FROM QuizAttempts qa
JOIN Users u ON qa.user_id = u.user_id
JOIN Quizzes q ON qa.quiz_id = q.quiz_id
LEFT JOIN Skills s ON q.skill_id = s.skill_id
WHERE qa.status IN (N'SUBMITTED', N'GRADED');
GO

/* =========================
   8. STORED PROCEDURE
   ========================= */
CREATE PROCEDURE sp_UpsertUserSkill
    @user_id INT,
    @skill_id INT,
    @current_level INT,
    @confidence_level INT = NULL,
    @source NVARCHAR(30) = N'SELF_ASSESSMENT'
AS
BEGIN
    SET NOCOUNT ON;
    IF @current_level NOT BETWEEN 0 AND 100
        THROW 50001, N'Mức kỹ năng phải nằm trong khoảng 0-100.', 1;

    MERGE UserSkills AS target
    USING (SELECT @user_id AS user_id, @skill_id AS skill_id) AS src
    ON target.user_id = src.user_id AND target.skill_id = src.skill_id
    WHEN MATCHED THEN
        UPDATE SET current_level = @current_level,
                   confidence_level = @confidence_level,
                   source = @source,
                   last_assessed_at = SYSDATETIME()
    WHEN NOT MATCHED THEN
        INSERT (user_id, skill_id, current_level, confidence_level, source)
        VALUES (@user_id, @skill_id, @current_level, @confidence_level, @source);
END;
GO

CREATE PROCEDURE sp_CreateRoadmapFromCareerSkills
    @user_id INT,
    @career_id INT,
    @months INT = 6
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        DECLARE @roadmap_id INT;
        INSERT INTO LearningRoadmaps(user_id, career_id, title, description, expected_end_date, status)
        VALUES (@user_id, @career_id,
                N'Lộ trình học cá nhân hóa - ' + (SELECT career_name FROM Careers WHERE career_id = @career_id),
                N'Lộ trình được tạo tự động dựa trên khoảng cách kỹ năng.',
                DATEADD(MONTH, @months, CONVERT(DATE, GETDATE())),
                N'ACTIVE');
        SET @roadmap_id = SCOPE_IDENTITY();

        INSERT INTO RoadmapStages(roadmap_id, stage_order, stage_name, description, expected_weeks)
        VALUES
        (@roadmap_id, 1, N'Giai đoạn 1: Nền tảng', N'Học các kỹ năng nền tảng còn thiếu.', 4),
        (@roadmap_id, 2, N'Giai đoạn 2: Chuyên môn', N'Học kỹ năng chuyên môn theo nghề mục tiêu.', 8),
        (@roadmap_id, 3, N'Giai đoạn 3: Dự án thực hành', N'Làm bài tập, mini project và portfolio.', 6);

        ;WITH Gap AS (
            SELECT cs.skill_id, s.skill_name, cs.required_level, ISNULL(us.current_level,0) AS current_level,
                   ROW_NUMBER() OVER (ORDER BY (cs.required_level - ISNULL(us.current_level,0)) DESC, cs.importance_weight DESC) AS rn
            FROM CareerSkills cs
            JOIN Skills s ON cs.skill_id = s.skill_id
            LEFT JOIN UserSkills us ON us.user_id = @user_id AND us.skill_id = cs.skill_id
            WHERE cs.career_id = @career_id AND cs.required_level > ISNULL(us.current_level,0)
        )
        INSERT INTO RoadmapTasks(stage_id, skill_id, task_order, task_title, task_type, description, estimated_hours)
        SELECT
            CASE WHEN rn <= 3 THEN (SELECT stage_id FROM RoadmapStages WHERE roadmap_id=@roadmap_id AND stage_order=1)
                 WHEN rn <= 7 THEN (SELECT stage_id FROM RoadmapStages WHERE roadmap_id=@roadmap_id AND stage_order=2)
                 ELSE (SELECT stage_id FROM RoadmapStages WHERE roadmap_id=@roadmap_id AND stage_order=3)
            END,
            skill_id,
            rn,
            N'Học và luyện tập: ' + skill_name,
            CASE WHEN rn <= 7 THEN N'LESSON' ELSE N'PROJECT' END,
            N'Nâng mức kỹ năng từ ' + CAST(current_level AS NVARCHAR(10)) + N'% lên mục tiêu ' + CAST(required_level AS NVARCHAR(10)) + N'%.',
            6
        FROM Gap;

        COMMIT TRANSACTION;
        SELECT @roadmap_id AS roadmap_id;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

CREATE PROCEDURE sp_UpdateTaskProgress
    @user_id INT,
    @task_id INT,
    @progress_percent INT,
    @study_minutes INT = 0,
    @note NVARCHAR(1000) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    IF @progress_percent NOT BETWEEN 0 AND 100
        THROW 50002, N'Tiến độ phải nằm trong khoảng 0-100.', 1;

    INSERT INTO LearningProgressLogs(user_id, task_id, progress_percent, study_minutes, note)
    VALUES (@user_id, @task_id, @progress_percent, @study_minutes, @note);

    UPDATE RoadmapTasks
    SET status = CASE WHEN @progress_percent = 100 THEN N'COMPLETED'
                      WHEN @progress_percent > 0 THEN N'IN_PROGRESS'
                      ELSE N'NOT_STARTED' END,
        completed_at = CASE WHEN @progress_percent = 100 THEN SYSDATETIME() ELSE completed_at END
    WHERE task_id = @task_id;
END;
GO

CREATE PROCEDURE sp_SearchJobsByLocationCareer
    @career_id INT = NULL,
    @location NVARCHAR(150) = NULL,
    @user_id INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        j.job_id, j.job_title, co.company_name, co.email_public, co.phone_public,
        j.contact_email, j.location, j.working_type, j.salary_min, j.salary_max,
        j.apply_url,
        jm.match_percent
    FROM JobPostings j
    JOIN Companies co ON j.company_id = co.company_id
    LEFT JOIN vw_JobMatchScore jm ON jm.job_id = j.job_id AND (@user_id IS NULL OR jm.user_id = @user_id)
    WHERE j.status = N'OPEN'
      AND (@career_id IS NULL OR j.career_id = @career_id)
      AND (@location IS NULL OR j.location LIKE N'%' + @location + N'%')
    ORDER BY ISNULL(jm.match_percent,0) DESC, j.posted_date DESC;
END;
GO

CREATE PROCEDURE sp_SubmitQuizAttempt
    @attempt_id INT,
    @score DECIMAL(5,2),
    @ai_feedback NVARCHAR(MAX) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    IF @score NOT BETWEEN 0 AND 100
        THROW 50003, N'Điểm quiz phải nằm trong khoảng 0-100.', 1;

    UPDATE QuizAttempts
    SET submitted_at = SYSDATETIME(), score = @score, status = N'GRADED', ai_feedback = @ai_feedback
    WHERE attempt_id = @attempt_id;
END;
GO

/* =========================
   9. TRIGGER
   ========================= */
CREATE TRIGGER trg_QuizAttempt_UpdateUserSkill
ON QuizAttempts
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO UserSkills(user_id, skill_id, current_level, confidence_level, source, last_assessed_at)
    SELECT i.user_id, q.skill_id, CAST(i.score AS INT), 80, N'QUIZ', SYSDATETIME()
    FROM inserted i
    JOIN Quizzes q ON i.quiz_id = q.quiz_id
    WHERE i.status IN (N'SUBMITTED', N'GRADED') AND i.score IS NOT NULL AND q.skill_id IS NOT NULL
      AND NOT EXISTS (SELECT 1 FROM UserSkills us WHERE us.user_id = i.user_id AND us.skill_id = q.skill_id);

    UPDATE us
    SET current_level = CASE WHEN i.score > us.current_level THEN CAST(i.score AS INT) ELSE us.current_level END,
        confidence_level = 80,
        source = N'QUIZ',
        last_assessed_at = SYSDATETIME()
    FROM UserSkills us
    JOIN inserted i ON us.user_id = i.user_id
    JOIN Quizzes q ON i.quiz_id = q.quiz_id AND us.skill_id = q.skill_id
    WHERE i.status IN (N'SUBMITTED', N'GRADED') AND i.score IS NOT NULL;
END;
GO

CREATE TRIGGER trg_RoadmapTask_CompletedNotification
ON RoadmapTasks
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Notifications(user_id, title, content, notification_type)
    SELECT lr.user_id,
           N'Hoàn thành nhiệm vụ học tập',
           N'Bạn đã hoàn thành: ' + i.task_title,
           N'ROADMAP'
    FROM inserted i
    JOIN deleted d ON i.task_id = d.task_id
    JOIN RoadmapStages rs ON i.stage_id = rs.stage_id
    JOIN LearningRoadmaps lr ON rs.roadmap_id = lr.roadmap_id
    WHERE i.status = N'COMPLETED' AND d.status <> N'COMPLETED';
END;
GO

CREATE TRIGGER trg_PreventDeleteSkillInUse
ON Skills
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM deleted d JOIN UserSkills us ON d.skill_id = us.skill_id)
        OR EXISTS (SELECT 1 FROM deleted d JOIN CareerSkills cs ON d.skill_id = cs.skill_id)
        OR EXISTS (SELECT 1 FROM deleted d JOIN RoadmapTasks rt ON d.skill_id = rt.skill_id)
    BEGIN
        THROW 50004, N'Không thể xóa kỹ năng đã phát sinh dữ liệu nghiệp vụ.', 1;
    END
    DELETE s FROM Skills s JOIN deleted d ON s.skill_id = d.skill_id;
END;
GO