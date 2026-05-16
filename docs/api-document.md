# API Document

THIẾT KẾ API CHO HỆ THỐNG
AI CÁ NHÂN HÓA LỘ TRÌNH HỌC TẬP VÀ ĐỊNH HƯỚNG NGHỀ NGHIỆP

Phiên bản: 1.0
Hệ quản trị CSDL: Microsoft SQL Server
Kiến trúc đề xuất: Frontend - Backend API - AI Service - Database

MỤC LỤC TÓM TẮT

1. Mục tiêu thiết kế API

2. Nguyên tắc thiết kế API

3. Kiến trúc giao tiếp API

4. Quy ước chung

5. Danh sách API theo phân hệ

6. Đặc tả API chi tiết

7. Mã lỗi và phản hồi chuẩn

8. Bảo mật API

9. Mapping API với bảng dữ liệu

10. Kết luận

11. Mục tiêu thiết kế API

Tài liệu này mô tả thiết kế API cho hệ thống AI hỗ trợ cá nhân hóa lộ trình học tập và định hướng nghề nghiệp cho sinh viên đa ngành. API đóng vai trò trung gian giữa giao diện người dùng, cơ sở dữ liệu SQL Server và các dịch vụ AI như phân tích khoảng cách kỹ năng, tạo lộ trình học, gợi ý tài liệu, tạo bài kiểm tra và tư vấn nghề nghiệp.

2. Nguyên tắc thiết kế API

3. Kiến trúc giao tiếp API

API Server là lớp xử lý nghiệp vụ chính. Frontend gửi yêu cầu đến Backend API. Backend kiểm tra xác thực, phân quyền, xử lý logic nghiệp vụ, truy vấn SQL Server và gọi AI Service khi cần.

Luồng tổng quát: User -> Frontend -> Backend API -> SQL Server / AI Service -> Backend API -> Frontend.

4. Quy ước chung

4.1. Base URL

Môi trường phát triển Backend API: http://localhost:3000/api/v1

AI Service nội bộ: http://localhost:8000

Môi trường triển khai: https://domain-cua-he-thong/api/v1

4.2. Header chuẩn

4.3. Cấu trúc response thành công

{
"success": true,
"message": "Thao tác thành công",
"data": { },
"meta": { }
}

4.4. Cấu trúc response lỗi

{
"success": false,
"error": {
"code": "VALIDATION_ERROR",
"message": "Dữ liệu không hợp lệ",
"details": []
}
}

5. Danh sách API theo phân hệ

6. Đặc tả API chi tiết

6.1. Đăng nhập

Request mẫu:

{
"email": "an@example.com",
"password": "123456"
}

Response mẫu:

{
"success": true,
"data": {
"access_token": "jwt_token",
"user": {"user_id": 1, "full_name": "Nguyễn Văn An", "role": "STUDENT"}
}
}

6.2. Khởi tạo hồ sơ sinh viên

Request mẫu:

{
"field_id": 2,
"university": "Đại học Kinh tế",
"major": "Hệ thống thông tin quản lý",
"academic_year": 2,
"study_hours_per_week": 10,
"preferred_location": "Đà Nẵng"
}

Response mẫu:

{
"success": true,
"message": "Khởi tạo hồ sơ thành công",
"data": {"profile_id": 1}
}

6.3. Cập nhật kỹ năng hiện tại

Request mẫu:

{
"skill_id": 2,
"current_level": 45,
"confidence_level": 70,
"source": "SELF_ASSESSMENT"
}

Response mẫu:

{
"success": true,
"message": "Cập nhật kỹ năng thành công"
}

6.4. Phân tích khoảng cách kỹ năng

Request mẫu:

Không có body. Tham số query: career_id.

Response mẫu:

{
"success": true,
"data": [
{"skill_name": "SQL", "current_level": 20, "required_level": 80, "gap_level": 60}
]
}

6.5. AI tạo lộ trình học cá nhân hóa

Request mẫu:

{
"career_id": 1,
"target_completion_months": 6
}

Response mẫu:

{
"success": true,
"message": "Tạo lộ trình thành công",
"data": {"roadmap_id": 10, "title": "Lộ trình Data Analyst"}
}

6.6. Cập nhật tiến độ nhiệm vụ học tập

Request mẫu:

{
"progress_percent": 80,
"study_minutes": 60,
"note": "Đã hoàn thành phần SELECT và WHERE"
}

Response mẫu:

{
"success": true,
"message": "Cập nhật tiến độ thành công"
}

6.7. Gợi ý tài liệu học tập

Request mẫu:

Không có body. Tham số query: skill_id, difficulty_level, is_free.

Response mẫu:

{
"success": true,
"data": [
{"title": "SQL for Data Analysis", "resource_type": "COURSE", "provider": "Coursera", "rating": 4.7}
]
}

6.8. AI tạo bài kiểm tra

Request mẫu:

{
"skill_id": 2,
"difficulty_level": "BASIC",
"number_of_questions": 10,
"time_limit_minutes": 30
}

Response mẫu:

{
"success": true,
"data": {"quiz_id": 5, "quiz_title": "Kiểm tra SQL cơ bản"}
}

6.9. Nộp bài quiz

Request mẫu:

{
"answers": [
{"question_id": 1, "user_answer": "SELECT"}
]
}

Response mẫu:

{
"success": true,
"data": {"score": 75, "result_status": "PASS", "ai_feedback": "Cần luyện thêm JOIN"}
}

6.10. Gửi tin nhắn AI Mentor

Request mẫu:

{
"message_content": "Em yếu SQL thì nên học từ đâu?"
}

Response mẫu:

{
"success": true,
"data": {
"user_message_id": 12,
"ai_message": "Bạn nên bắt đầu với SELECT, WHERE, GROUP BY..."
}
}

6.11. Tìm cơ hội nghề nghiệp theo khu vực

Request mẫu:

Không có body. Tham số query: career_id, location, working_type, salary_min, salary_max.

Response mẫu:

{
"success": true,
"data": [
{"job_title": "Data Analyst Intern", "company_name": "FPT Software", "location": "Đà Nẵng", "match_percent": 85}
]
}

6.12. Dashboard thống kê học tập

Request mẫu:

Không có body.

Response mẫu:

{
"success": true,
"data": {
"roadmap_progress": 68,
"completed_tasks": 34,
"average_quiz_score": 8.6,
"recommended_jobs": 5
}
}

7. Mã lỗi và phản hồi chuẩn

8. Bảo mật API

9. Mapping API với bảng dữ liệu

10. Luồng API nghiệp vụ tiêu biểu

11. Gợi ý triển khai kỹ thuật

12. Kết luận

Thiết kế API trên đảm bảo bao phủ các nghiệp vụ chính của hệ thống: khởi tạo hồ sơ, đánh giá kỹ năng, chọn nghề nghiệp, phân tích skill gap, tạo lộ trình học, theo dõi tiến độ, đề xuất tài liệu, kiểm tra đánh giá, AI Mentor, cơ hội nghề nghiệp, cộng đồng và thống kê báo cáo. Các API được thiết kế theo RESTful, có phân quyền, có cấu trúc phản hồi thống nhất và khớp với cơ sở dữ liệu SQL Server đã xây dựng.
