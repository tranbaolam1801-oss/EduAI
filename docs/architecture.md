# Architecture

THIẾT KẾ KIẾN TRÚC HỆ THỐNG

Hệ thống AI hỗ trợ cá nhân hóa lộ trình học tập và định hướng nghề nghiệp cho sinh viên đa ngành

1. Tổng quan kiến trúc hệ thống

Sau khi hoàn thành phân tích nghiệp vụ và thiết kế cơ sở dữ liệu, hệ thống được thiết kế theo kiến trúc nhiều lớp nhằm tách biệt giao diện, xử lý nghiệp vụ, xử lý AI và lưu trữ dữ liệu. Cách thiết kế này giúp hệ thống dễ mở rộng, dễ bảo trì và phù hợp với định hướng phát triển thành nền tảng học tập - nghề nghiệp thông minh.

Mục tiêu của kiến trúc là hỗ trợ các nghiệp vụ chính: khởi tạo hồ sơ sinh viên, đánh giá kỹ năng, phân tích khoảng cách kỹ năng, tạo lộ trình học cá nhân hóa, theo dõi tiến độ, đề xuất tài liệu, kiểm tra đánh giá, AI Mentor, gợi ý cơ hội nghề nghiệp theo khu vực, cộng đồng và báo cáo thống kê.

2. Nguyên tắc thiết kế kiến trúc

3. Sơ đồ kiến trúc tổng thể

Sơ đồ dưới đây mô tả các lớp chính của hệ thống và hướng giao tiếp giữa các thành phần.

Hình 1. Kiến trúc tổng thể của hệ thống AI Learning Career System

4. Mô tả các lớp trong kiến trúc

5. Thiết kế thành phần backend

6. Thiết kế AI Service Layer

AI Service có thể được triển khai bằng Python/FastAPI riêng hoặc tích hợp trong backend ban đầu. Tuy nhiên, để hệ thống dễ mở rộng, nên tách AI Service thành service độc lập khi triển khai thực tế.

7. Luồng dữ liệu tổng quát

Hình 2. Luồng dữ liệu từ hồ sơ sinh viên đến lộ trình học và dashboard

8. Các luồng xử lý nghiệp vụ chính

8.1. Luồng tạo lộ trình học cá nhân hóa

1. Sinh viên đăng nhập và hoàn thành hồ sơ cá nhân.

2. Sinh viên chọn nghề nghiệp mục tiêu.

3. Hệ thống lấy dữ liệu CareerSkills và UserSkills.

4. Skill Gap Engine tính toán các kỹ năng còn thiếu.

5. Roadmap Generator tạo roadmap, chia thành các stage và task.

6. Backend lưu roadmap vào SQL Server.

7. Frontend hiển thị lộ trình học và tiến độ ban đầu.

8.2. Luồng làm bài kiểm tra và cập nhật kỹ năng

1. Sinh viên chọn bài quiz theo kỹ năng hoặc theo task trong roadmap.

2. Hệ thống lấy câu hỏi và đáp án từ QuizQuestions, QuizOptions.

3. Sinh viên nộp bài, hệ thống lưu QuizAttempts và QuizAttemptAnswers.

4. Quiz Evaluator chấm điểm và sinh phản hồi AI.

5. Trigger hoặc service cập nhật UserSkills theo kết quả làm bài.

6. Dashboard cập nhật lại điểm kỹ năng, skill gap và đề xuất học tiếp.

8.3. Luồng gợi ý cơ hội nghề nghiệp theo khu vực

1. Sinh viên chọn nghề mục tiêu và khu vực mong muốn.

2. Backend truy vấn JobPostings, Companies, JobSkills.

3. Job Matching Engine so sánh JobSkills với UserSkills.

4. Hệ thống tính phần trăm phù hợp và kỹ năng còn thiếu.

5. Frontend hiển thị danh sách vị trí, công ty, liên hệ công khai, link ứng tuyển và mức phù hợp.

6. Thiết kế API đề xuất

7. Thiết kế bảo mật

8. Kiến trúc triển khai đề xuất

9. Yêu cầu phi chức năng ở mức kiến trúc

10. Kết luận

Kiến trúc hệ thống được thiết kế theo hướng nhiều lớp, phù hợp với hệ thống AI hỗ trợ học tập và định hướng nghề nghiệp. Thiết kế này giúp tách biệt phần giao diện, xử lý nghiệp vụ, xử lý AI và lưu trữ dữ liệu. Với kiến trúc đề xuất, hệ thống có thể triển khai trước ở mức web app + backend + SQL Server, sau đó mở rộng thêm AI Service độc lập, Vector Database, Mobile App và các nguồn dữ liệu việc làm công khai.
