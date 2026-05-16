from app.schemas.ai.chat import MentorChatRequest
from app.schemas.ai.job import JobExplainRequest
from app.schemas.ai.quiz import QuizEvaluateRequest, QuizGenerateRequest


def build_quiz_draft(payload: QuizGenerateRequest) -> dict:
    skill_name = payload.skill_name
    difficulty_label = {
        "BASIC": "cơ bản",
        "INTERMEDIATE": "trung bình",
        "ADVANCED": "nâng cao",
    }.get(payload.difficulty_level, payload.difficulty_level.lower())

    questions = []

    for index in range(payload.number_of_questions):
        question_number = index + 1
        questions.append(
            {
                "question_text": f"Câu {question_number}: Nội dung nào phù hợp nhất với kỹ năng {skill_name} ở mức {difficulty_label}?",
                "question_type": "MCQ",
                "correct_answer": skill_name,
                "score": 1,
                "explanation": f"Câu hỏi này dùng để kiểm tra hiểu biết nền tảng về {skill_name}.",
                "options": [
                    {"option_text": skill_name, "is_correct": True},
                    {"option_text": f"Khái niệm sai {question_number}", "is_correct": False},
                    {"option_text": f"Ví dụ chưa đúng {question_number}", "is_correct": False},
                    {"option_text": f"Thuật ngữ ngoài phạm vi {question_number}", "is_correct": False},
                ],
            }
        )

    return {
        "quiz_title": f"Kiểm tra {skill_name} {difficulty_label}",
        "description": f"Bộ câu hỏi luyện tập nhanh dành cho kỹ năng {skill_name}.",
        "difficulty_level": payload.difficulty_level,
        "time_limit_minutes": payload.time_limit_minutes or 20,
        "passing_score": 60,
        "questions": questions,
        "provider_mode": "structured_placeholder",
    }


def build_quiz_feedback(payload: QuizEvaluateRequest) -> dict:
    passed = payload.score >= payload.passing_score
    if passed:
        feedback = (
            f"Bạn đã vượt qua bài kiểm tra {payload.quiz_title} với {payload.correct_count}/{payload.total_questions} câu đúng. "
            "Hãy tiếp tục luyện thêm các dạng bài tương tự để giữ vững kiến thức."
        )
    else:
        feedback = (
            f"Bạn mới đạt {payload.score} điểm ở bài kiểm tra {payload.quiz_title}. "
            "Nên ôn lại phần nền tảng, xem lại đáp án sai và làm thêm một bài luyện tập ngắn."
        )

    return {
        "feedback": feedback,
        "result_status": "PASS" if passed else "FAIL",
        "provider_mode": "structured_placeholder",
    }


def build_mentor_reply(payload: MentorChatRequest) -> dict:
    profile = payload.context.get("profile") or {}
    goals = payload.context.get("goals") or []
    roadmaps = payload.context.get("roadmaps") or []
    top_skills = payload.context.get("top_skills") or []

    major = profile.get("major") or "ngành học hiện tại"
    goal_name = goals[0].get("career_name") if goals else "mục tiêu nghề nghiệp của bạn"
    roadmap_name = roadmaps[0].get("title") if roadmaps else "lộ trình học hiện tại"
    skill_names = ", ".join(skill.get("skill_name", "") for skill in top_skills[:3] if skill.get("skill_name"))

    if not skill_names:
        skill_names = "các kỹ năng nền tảng"

    reply = (
        f"Mình đã đọc câu hỏi của bạn: \"{payload.message}\". "
        f"Với bối cảnh {major} và mục tiêu {goal_name}, bạn nên ưu tiên {skill_names}. "
        f"Nếu đã có {roadmap_name}, hãy hoàn thành các nhiệm vụ đang mở trước rồi quay lại đánh giá tiến độ."
    )

    return {
        "reply": reply,
        "next_actions": [
            "Xem lại nhiệm vụ đang mở trong lộ trình học",
            "Làm thêm một bài kiểm tra ngắn để tự đánh giá",
            "Ghi lại vướng mắc cụ thể để AI Mentor hỗ trợ sâu hơn",
        ],
        "provider_mode": "structured_placeholder",
    }


def build_job_explanations(payload: JobExplainRequest) -> dict:
    top_skill_names = [
        skill.get("skill_name")
        for skill in payload.top_skills[:3]
        if isinstance(skill, dict) and skill.get("skill_name")
    ]

    if not top_skill_names:
        top_skill_names = ["các kỹ năng nền tảng"]

    items = []
    for job in payload.jobs:
        explanation = (
            f"Vị trí {job.job_title} tại {job.company_name} phù hợp khoảng {job.match_percent}% "
            f"vì đang gần với nhóm kỹ năng {', '.join(top_skill_names)}"
        )
        if payload.preferred_location:
            explanation += f" và khớp với khu vực ưu tiên {payload.preferred_location}"
        explanation += "."

        items.append(
            {
                "job_id": job.job_id,
                "explanation": explanation,
            }
        )

    return {
        "jobs": items,
        "provider_mode": "structured_placeholder",
    }
