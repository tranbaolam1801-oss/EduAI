   10. DỮ LIỆU MẪU
   ========================= */
INSERT INTO Roles(role_name, description) VALUES
(N'ADMIN', N'Quản trị toàn hệ thống'),
(N'STUDENT', N'Sinh viên sử dụng hệ thống'),
(N'ADVISOR', N'Cố vấn học tập/nghề nghiệp');

INSERT INTO AcademicFields(field_name, description) VALUES
(N'Công nghệ thông tin', N'Nhóm ngành CNTT và phần mềm'),
(N'Kinh tế - Quản trị', N'Nhóm ngành kinh tế, quản trị, tài chính'),
(N'Marketing - Truyền thông', N'Nhóm ngành marketing và truyền thông'),
(N'Y tế - Sức khỏe', N'Nhóm ngành y tế và chăm sóc sức khỏe');

INSERT INTO SkillCategories(category_name) VALUES
(N'Lập trình'), (N'Dữ liệu'), (N'Kinh doanh'), (N'Ngoại ngữ'), (N'Kỹ năng mềm');

INSERT INTO Skills(category_id, skill_name, description, difficulty_level) VALUES
(1, N'Python', N'Ngôn ngữ lập trình Python', N'BASIC'),
(2, N'SQL', N'Truy vấn và thao tác dữ liệu quan hệ', N'BASIC'),
(2, N'Excel', N'Xử lý dữ liệu bảng tính', N'BASIC'),
(2, N'Power BI', N'Trực quan hóa dữ liệu', N'INTERMEDIATE'),
(2, N'Thống kê', N'Nền tảng thống kê ứng dụng', N'INTERMEDIATE'),
(3, N'Phân tích nghiệp vụ', N'Phân tích yêu cầu và quy trình kinh doanh', N'INTERMEDIATE'),
(4, N'Tiếng Anh chuyên ngành', N'Đọc hiểu tài liệu chuyên ngành', N'BASIC');

INSERT INTO Careers(field_id, career_name, description, market_demand_level, avg_salary_min, avg_salary_max) VALUES
(2, N'Data Analyst', N'Phân tích dữ liệu, báo cáo và hỗ trợ ra quyết định.', N'HIGH', 8000000, 25000000),
(1, N'AI Engineer', N'Xây dựng mô hình và ứng dụng trí tuệ nhân tạo.', N'HIGH', 15000000, 50000000),
(2, N'Business Analyst', N'Phân tích nghiệp vụ và cầu nối giữa business với technical.', N'HIGH', 10000000, 30000000);

INSERT INTO CareerSkills(career_id, skill_id, required_level, importance_weight) VALUES
(1, 1, 60, 8), (1, 2, 80, 10), (1, 3, 80, 9), (1, 4, 70, 8), (1, 5, 70, 8), (1, 7, 50, 5),
(2, 1, 85, 10), (2, 2, 70, 7), (2, 5, 80, 8), (2, 7, 60, 6),
(3, 2, 50, 5), (3, 3, 70, 7), (3, 6, 85, 10), (3, 7, 60, 6);

INSERT INTO Users(role_id, full_name, email, password_hash, phone) VALUES
(2, N'Nguyễn Văn An', N'an@example.com', N'HASH_DEMO_ONLY', N'0900000001'),
(1, N'Quản trị viên', N'admin@example.com', N'HASH_DEMO_ONLY', N'0900000002');

INSERT INTO StudentProfiles(user_id, field_id, university, major, academic_year, current_level, study_hours_per_week, target_completion_months, preferred_location)
VALUES (1, 2, N'Đại học Kinh tế', N'Hệ thống thông tin quản lý', 2, N'Cơ bản', 10, 6, N'Đà Nẵng');

INSERT INTO UserCareerGoals(user_id, career_id, priority_order, status) VALUES (1, 1, 1, N'ACTIVE');
EXEC sp_UpsertUserSkill 1, 1, 30, 70, N'SELF_ASSESSMENT';
EXEC sp_UpsertUserSkill 1, 2, 20, 60, N'SELF_ASSESSMENT';
EXEC sp_UpsertUserSkill 1, 3, 65, 80, N'SELF_ASSESSMENT';
EXEC sp_UpsertUserSkill 1, 5, 40, 70, N'SELF_ASSESSMENT';

INSERT INTO LearningResources(skill_id, title, resource_type, provider, url, difficulty_level, estimated_hours, rating, is_free) VALUES
(2, N'SQL for Data Analysis', N'COURSE', N'Coursera', N'https://example.com/sql', N'BASIC', 12, 4.7, 1),
(1, N'Python for Data Analysis', N'COURSE', N'Udemy', N'https://example.com/python', N'BASIC', 20, 4.6, 0),
(4, N'Power BI Dashboard Project', N'PROJECT', N'Internal', N'https://example.com/powerbi', N'INTERMEDIATE', 10, 4.8, 1);

INSERT INTO Quizzes(skill_id, quiz_title, description, difficulty_level, time_limit_minutes, passing_score) VALUES
(2, N'Kiểm tra SQL cơ bản', N'Đánh giá truy vấn SELECT, WHERE, GROUP BY.', N'BASIC', 30, 60);
INSERT INTO QuizQuestions(quiz_id, question_text, question_type, correct_answer, score, explanation) VALUES
(1, N'Lệnh nào dùng để lấy dữ liệu từ bảng?', N'MCQ', N'SELECT', 1, N'SELECT dùng để truy vấn dữ liệu trong SQL.');
INSERT INTO QuizOptions(question_id, option_text, is_correct) VALUES
(1, N'SELECT', 1), (1, N'INSERT', 0), (1, N'DELETE', 0), (1, N'UPDATE', 0);
INSERT INTO QuizAttempts(user_id, quiz_id, score, status, submitted_at, ai_feedback) VALUES
(1, 1, 75, N'GRADED', SYSDATETIME(), N'Bạn nắm được kiến thức SQL cơ bản, cần luyện thêm JOIN.');

INSERT INTO Companies(company_name, industry, website, email_public, phone_public, address, city) VALUES
(N'FPT Software', N'Công nghệ thông tin', N'https://www.fpt-software.com', N'hr@example.com', N'0236xxxxxxx', N'Đà Nẵng', N'Đà Nẵng'),
(N'VN Analytics', N'Dữ liệu', N'https://example.com', N'career@example.com', N'090xxxxxxx', N'Hải Châu', N'Đà Nẵng');

INSERT INTO JobPostings(company_id, career_id, job_title, job_description, location, working_type, salary_min, salary_max, contact_email, apply_url, posted_date)
VALUES
(1, 1, N'Data Analyst Intern', N'Thực tập phân tích dữ liệu, SQL, Excel, Power BI.', N'Đà Nẵng', N'INTERNSHIP', 3000000, 6000000, N'hr@example.com', N'https://example.com/apply1', GETDATE()),
(2, 1, N'Junior Data Analyst', N'Phân tích dữ liệu kinh doanh và xây dựng dashboard.', N'Đà Nẵng', N'FULL_TIME', 8000000, 15000000, N'career@example.com', N'https://example.com/apply2', GETDATE());

INSERT INTO JobSkills(job_id, skill_id, required_level) VALUES
(1, 2, 50), (1, 3, 60), (1, 4, 40),
(2, 2, 70), (2, 3, 70), (2, 4, 60), (2, 5, 60);
GO