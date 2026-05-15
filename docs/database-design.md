# Database Design

TRƯỜNG ĐẠI HỌC KINH TẾ
KHOA THỐNG KÊ - TIN HỌC

BÁO CÁO THIẾT KẾ CƠ SỞ DỮ LIỆU

Đề tài: XÂY DỰNG HỆ THỐNG AI HỖ TRỢ CÁ NHÂN HÓA LỘ TRÌNH HỌC TẬP VÀ ĐỊNH HƯỚNG NGHỀ NGHIỆP CHO SINH VIÊN ĐA NGÀNH

Sinh viên thực hiện: ........................................

Lớp: ...........................................................

Giảng viên hướng dẫn: ....................................

Đà Nẵng, 2026

MỤC LỤC TÓM TẮT

CHƯƠNG 1. TỔNG QUAN THIẾT KẾ CƠ SỞ DỮ LIỆU

CHƯƠNG 2. PHÂN TÍCH VÀ THIẾT KẾ CƠ SỞ DỮ LIỆU

CHƯƠNG 3. LẬP TRÌNH VỚI CƠ SỞ DỮ LIỆU

CHƯƠNG 4. BẢO MẬT VÀ SAO LƯU CƠ SỞ DỮ LIỆU

PHỤ LỤC. FILE SQL SERVER ĐI KÈM

CHƯƠNG 1. TỔNG QUAN THIẾT KẾ CƠ SỞ DỮ LIỆU

1.1. Bối cảnh và lý do thiết kế cơ sở dữ liệu

Sau khi phân tích nghiệp vụ hệ thống AI hỗ trợ cá nhân hóa lộ trình học tập và định hướng nghề nghiệp, bước tiếp theo là thiết kế cơ sở dữ liệu để lưu trữ tập trung các dữ liệu cốt lõi: hồ sơ sinh viên, năng lực kỹ năng, nghề nghiệp mục tiêu, lộ trình học, tài liệu học tập, bài kiểm tra, AI Mentor, cơ hội nghề nghiệp và báo cáo tiến độ.

Nếu không thiết kế CSDL chuẩn hóa, hệ thống dễ gặp các vấn đề: trùng lặp kỹ năng, khó truy vết kết quả học tập, không thống nhất giữa yêu cầu nghề nghiệp và năng lực hiện tại, khó tính toán mức độ phù hợp với công việc, khó mở rộng cho nhiều ngành nghề.

1.2. Mục tiêu thiết kế CSDL

Chuẩn hóa dữ liệu người dùng, sinh viên, ngành học, nghề nghiệp và kỹ năng.

Lưu được lịch sử đánh giá kỹ năng và kết quả kiểm tra của sinh viên.

Hỗ trợ AI phân tích khoảng cách kỹ năng và tạo lộ trình học cá nhân hóa.

Theo dõi tiến độ học tập theo lộ trình, giai đoạn và nhiệm vụ.

Lưu tài liệu, khóa học, bài test và gợi ý AI theo từng kỹ năng.

Hỗ trợ thống kê cơ hội nghề nghiệp theo khu vực và mức độ phù hợp với sinh viên.

Đảm bảo toàn vẹn dữ liệu bằng khóa chính, khóa ngoại, ràng buộc CHECK, UNIQUE và trigger.

1.3. Phạm vi hệ thống dữ liệu

CHƯƠNG 2. PHÂN TÍCH VÀ THIẾT KẾ CƠ SỞ DỮ LIỆU

2.1. Khảo sát dữ liệu đầu vào

2.2. Xác định thực thể và thuộc tính

2.3. Mô hình dữ liệu quan hệ sau chuẩn hóa

Roles(role_id, role_name, description)

Users(user_id, role_id, full_name, email, password_hash, phone, status, failed_login_count, locked_until, created_at)

AcademicFields(field_id, field_name, description)

StudentProfiles(profile_id, user_id, field_id, university, major, academic_year, study_hours_per_week, preferred_location)

SkillCategories(category_id, category_name, description)

Skills(skill_id, category_id, skill_name, description, difficulty_level)

Careers(career_id, field_id, career_name, description, market_demand_level, avg_salary_min, avg_salary_max)

CareerSkills(career_id, skill_id, required_level, importance_weight, is_required)

UserCareerGoals(goal_id, user_id, career_id, priority_order, target_deadline, status)

UserSkills(user_id, skill_id, current_level, confidence_level, source, last_assessed_at)

LearningRoadmaps(roadmap_id, user_id, career_id, title, start_date, expected_end_date, status)

RoadmapStages(stage_id, roadmap_id, stage_order, stage_name, expected_weeks)

RoadmapTasks(task_id, stage_id, skill_id, task_order, task_title, task_type, estimated_hours, status)

LearningProgressLogs(progress_id, user_id, task_id, progress_percent, study_minutes, logged_at)

LearningResources(resource_id, skill_id, title, resource_type, provider, url, difficulty_level, rating)

TaskResources(task_id, resource_id, priority_order)

Quizzes(quiz_id, skill_id, quiz_title, difficulty_level, time_limit_minutes, passing_score)

QuizQuestions(question_id, quiz_id, question_text, question_type, correct_answer, score)

QuizOptions(option_id, question_id, option_text, is_correct)

QuizAttempts(attempt_id, user_id, quiz_id, started_at, submitted_at, score, status)

Companies(company_id, company_name, industry, website, email_public, phone_public, address, city)

JobPostings(job_id, company_id, career_id, job_title, location, working_type, salary_min, salary_max, contact_email, apply_url)

JobSkills(job_id, skill_id, required_level)

SavedJobs(user_id, job_id, saved_at, status)

AIRecommendations(recommendation_id, user_id, recommendation_type, title, content, priority_score, status)

ChatSessions(session_id, user_id, title, created_at)

ChatMessages(message_id, session_id, sender_type, message_content, created_at)

Challenges(challenge_id, skill_id, title, start_date, end_date, max_score, status)

ChallengeParticipants(challenge_id, user_id, joined_at, score, status)

Notifications(notification_id, user_id, title, content, notification_type, is_read, created_at)

2.4. Chuẩn hóa dữ liệu

2.5. Mô tả chi tiết các bảng vật lý tiêu biểu

Bảng Users

Bảng Skills

Bảng Careers

Bảng CareerSkills

Bảng UserSkills

Bảng LearningRoadmaps

Bảng RoadmapTasks

Bảng JobPostings

2.6. Quy tắc toàn vẹn dữ liệu

Email người dùng không được trùng.

Mức kỹ năng hiện tại, mức kỹ năng yêu cầu và điểm bài test nằm trong khoảng 0-100.

Một nghề có thể yêu cầu nhiều kỹ năng và một kỹ năng có thể thuộc nhiều nghề.

Một người dùng chỉ có một hồ sơ sinh viên chính.

Một lộ trình gồm nhiều giai đoạn; một giai đoạn gồm nhiều nhiệm vụ học tập.

Thông tin liên hệ công ty chỉ lưu các dữ liệu công khai như email tuyển dụng, website, số điện thoại công khai.

Không xóa cascade dữ liệu người dùng quan trọng; chỉ cascade các bảng con thuộc roadmap/task/question khi cần.

CHƯƠNG 3. LẬP TRÌNH VỚI CƠ SỞ DỮ LIỆU

3.1. Tạo cơ sở dữ liệu

File SQL đi kèm có tên AI_LearningCareerDB_SQLServer.sql. File này có thể chạy trực tiếp trên SQL Server Management Studio để tạo database, bảng, khóa chính, khóa ngoại, view, stored procedure, trigger và dữ liệu mẫu.

IF DB_ID(N'AI_LearningCareerDB') IS NOT NULL
BEGIN
ALTER DATABASE AI_LearningCareerDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
DROP DATABASE AI_LearningCareerDB;
END
GO
CREATE DATABASE AI_LearningCareerDB;
GO

3.2. View hỗ trợ báo cáo và AI phân tích

3.3. Stored Procedure nghiệp vụ

3.4. Trigger kiểm soát dữ liệu

3.5. Dữ liệu mẫu

SQL script có sẵn dữ liệu mẫu cho vai trò, ngành học, kỹ năng, nghề nghiệp, yêu cầu kỹ năng, người dùng demo, hồ sơ sinh viên, việc làm và công ty. Sau khi chạy script, có thể kiểm tra nhanh bằng:

SELECT _ FROM vw_SkillGapAnalysis WHERE user_id = 1;
SELECT _ FROM vw_JobMatchScore WHERE user_id = 1;

CHƯƠNG 4. BẢO MẬT VÀ SAO LƯU CƠ SỞ DỮ LIỆU

4.1. Định hướng bảo mật

Mật khẩu phải lưu dạng hash, không lưu plain text.

Phân quyền theo vai trò: ADMIN, STUDENT, ADVISOR.

Sinh viên chỉ xem/sửa hồ sơ và lộ trình của chính mình.

Admin quản lý danh mục ngành, nghề, kỹ năng, tài liệu và việc làm.

Cần kiểm soát SQL Injection bằng stored procedure/tham số hóa khi kết nối từ backend.

Dữ liệu chat AI và kết quả học tập cần được bảo vệ vì có thể chứa thông tin cá nhân.

4.2. Định hướng sao lưu

Backup Full hằng ngày đối với môi trường production.

Backup Differential mỗi 4-6 giờ nếu dữ liệu thay đổi nhiều.

Backup Transaction Log nếu dùng chế độ Full Recovery.

Kiểm tra phục hồi định kỳ để đảm bảo file backup dùng được.

Có thể triển khai replication hoặc Always On khi hệ thống có nhiều người dùng.

KẾT LUẬN

Thiết kế cơ sở dữ liệu trên đáp ứng các nghiệp vụ trọng tâm của hệ thống: khởi tạo hồ sơ, đánh giá kỹ năng, chọn nghề nghiệp, phân tích khoảng cách kỹ năng, tạo lộ trình học, theo dõi tiến độ, đề xuất tài liệu, kiểm tra đánh giá, AI Mentor, cơ hội nghề nghiệp theo khu vực, cộng đồng và báo cáo. Mô hình được chuẩn hóa đến 3NF, có ràng buộc toàn vẹn và có sẵn script SQL Server để triển khai thử nghiệm.

PHỤ LỤC. HƯỚNG DẪN CHẠY FILE SQL

Mở SQL Server Management Studio.

Kết nối SQL Server.

Mở file AI_LearningCareerDB_SQLServer.sql.

Nhấn Execute để chạy toàn bộ script.

Kiểm tra database AI_LearningCareerDB được tạo thành công.

Chạy thử các câu SELECT cuối file để xem dữ liệu mẫu và view phân tích.
MÔ TẢ CHI TIẾT TẤT CẢ CÁC BẢNG CƠ SỞ DỮ LIỆU

Hệ thống AI hỗ trợ cá nhân hóa lộ trình học tập và định hướng nghề nghiệp

Tài liệu này bổ sung phần mô tả vật lý cho toàn bộ các bảng sau chuẩn hóa của hệ thống. Mỗi bảng được trình bày theo mẫu: thuộc tính, kiểu dữ liệu, ràng buộc và mô tả nghiệp vụ.

1. Danh sách bảng sau chuẩn hóa

2. Mô tả chi tiết các bảng vật lý

2.1. Bảng Roles

Mục đích: Lưu danh sách vai trò dùng để phân quyền người dùng.

2.2. Bảng Users

Mục đích: Lưu thông tin tài khoản, trạng thái đăng nhập và bảo mật.

2.3. Bảng AcademicFields

Mục đích: Lưu danh mục lĩnh vực/ngành học dùng cho hồ sơ sinh viên và nghề nghiệp.

2.4. Bảng StudentProfiles

Mục đích: Lưu hồ sơ học tập của sinh viên sau bước onboarding.

2.5. Bảng SkillCategories

Mục đích: Phân nhóm kỹ năng/môn học để dễ quản lý và gợi ý.

2.6. Bảng Skills

Mục đích: Lưu danh mục kỹ năng/môn học trong hệ thống.

2.7. Bảng Careers

Mục đích: Lưu danh sách nghề nghiệp mục tiêu theo từng lĩnh vực.

2.8. Bảng CareerSkills

Mục đích: Bảng trung gian xác định mỗi nghề cần những kỹ năng nào.

2.9. Bảng UserCareerGoals

Mục đích: Lưu nghề nghiệp mục tiêu mà sinh viên lựa chọn.

2.10. Bảng UserSkills

Mục đích: Lưu năng lực hiện tại của sinh viên theo từng kỹ năng.

2.11. Bảng LearningRoadmaps

Mục đích: Lưu lộ trình học cá nhân hóa của sinh viên.

2.12. Bảng RoadmapStages

Mục đích: Lưu các giai đoạn/phần lớn trong một lộ trình học.

2.13. Bảng RoadmapTasks

Mục đích: Lưu nhiệm vụ học tập cụ thể trong từng giai đoạn.

2.14. Bảng LearningProgressLogs

Mục đích: Lưu nhật ký tiến độ học tập theo từng nhiệm vụ.

2.15. Bảng LearningResources

Mục đích: Lưu tài liệu, khóa học, video, sách, bài viết gắn với kỹ năng.

2.16. Bảng TaskResources

Mục đích: Bảng trung gian gắn tài liệu vào từng nhiệm vụ trong roadmap.

2.17. Bảng Quizzes

Mục đích: Lưu thông tin bài kiểm tra theo từng kỹ năng.

2.18. Bảng QuizQuestions

Mục đích: Lưu câu hỏi thuộc một bài kiểm tra.

2.19. Bảng QuizOptions

Mục đích: Lưu phương án trả lời cho câu hỏi trắc nghiệm.

2.20. Bảng QuizAttempts

Mục đích: Lưu lịch sử làm bài kiểm tra của sinh viên.

2.21. Bảng Companies

Mục đích: Lưu thông tin công ty và thông tin liên hệ công khai.

2.22. Bảng JobPostings

Mục đích: Lưu tin tuyển dụng/cơ hội nghề nghiệp theo khu vực.

2.23. Bảng JobSkills

Mục đích: Bảng trung gian mô tả kỹ năng yêu cầu của từng tin tuyển dụng.

2.24. Bảng SavedJobs

Mục đích: Lưu danh sách việc làm sinh viên quan tâm hoặc đã ứng tuyển.

2.25. Bảng AIRecommendations

Mục đích: Lưu các gợi ý do AI sinh ra cho từng sinh viên.

2.26. Bảng ChatSessions

Mục đích: Lưu phiên trò chuyện giữa sinh viên và AI Mentor.

2.27. Bảng ChatMessages

Mục đích: Lưu từng tin nhắn trong phiên trò chuyện.

2.28. Bảng Challenges

Mục đích: Lưu thử thách học tập/cộng đồng.

2.29. Bảng ChallengeParticipants

Mục đích: Lưu danh sách sinh viên tham gia thử thách.

2.30. Bảng Notifications

Mục đích: Lưu thông báo hệ thống gửi cho sinh viên.

3. Ghi chú thiết kế và quan hệ chính
