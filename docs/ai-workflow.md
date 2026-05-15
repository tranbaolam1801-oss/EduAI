# docs/ai-workflow.md

# AI WORKFLOW DOCUMENT

AI Learning & Career System

---

# 1. Tổng quan AI System

Hệ thống AI được thiết kế theo hướng:

```text id="x9fqzq"
Python FastAPI + LLM API + Prompt Engineering + Database Data
```

Hệ thống KHÔNG train model từ đầu.

AI sử dụng:

- dữ liệu database
- hồ sơ sinh viên
- kỹ năng
- roadmap
- quiz
- việc làm
- prompt engineering
- rule-based logic

để tạo:

- roadmap cá nhân hóa
- phân tích skill gap
- AI mentor
- recommendation
- quiz
- job matching

---

# 2. AI Architecture

```text id="p6u0m2"
Frontend (Web / Flutter)
            ↓
      Backend API Server
            ↓
         AI Service
            ↓
   LLM API + SQL Server
```

Frontend:

- gửi request

Backend:

- validate dữ liệu
- load context
- gọi AI Service

AI Service:

- xử lý AI agents
- gọi LLM API
- trả structured result

---

# 3. AI Service Structure

```text id="5knh5n"
ai-service/
└── app/
    ├── agents/
    ├── prompts/
    ├── repositories/
    ├── schemas/
    ├── services/
    └── utils/
```

---

# 4. AI Agents

## 4.1 Skill Assessment Agent

### Mục đích

Đánh giá kỹ năng hiện tại của sinh viên.

### Input

- self assessment
- quiz result
- project evaluation

### Output

- current skill level
- confidence level

### Database

- UserSkills
- QuizAttempts

---

## 4.2 Career Recommendation Agent

### Mục đích

Gợi ý nghề nghiệp phù hợp.

### Input

- skills
- interests
- academic field
- learning history

### Output

- recommended careers
- match score
- explanation

### Database

- Careers
- CareerSkills
- UserSkills

---

## 4.3 Skill Gap Agent

### Mục đích

Phân tích kỹ năng còn thiếu.

### Formula

```text id="q12vl8"
gap_level = required_level - current_level
```

### Input

- UserSkills
- CareerSkills

### Output

- missing skills
- priority order
- difficulty level

### Database

- UserSkills
- CareerSkills
- Skills

---

# 5. Roadmap Generator Agent

### Mục đích

Tạo lộ trình học cá nhân hóa.

### Input

- skill gap
- target career
- study hours
- deadline

### Output

- roadmap
- stages
- tasks
- estimated hours

### Database

- LearningRoadmaps
- RoadmapStages
- RoadmapTasks

---

# 6. Resource Recommendation Agent

### Mục đích

Gợi ý tài liệu học tập.

### Input

- skill
- difficulty
- progress
- roadmap stage

### Output

- courses
- books
- articles
- projects

### Database

- LearningResources
- TaskResources

---

# 7. Quiz Generator Agent

### Mục đích

Tạo bài kiểm tra AI.

### Input

- skill
- difficulty
- number_of_questions

### Output

- quizzes
- questions
- options
- explanations

### Database

- Quizzes
- QuizQuestions
- QuizOptions

---

# 8. Quiz Evaluator Agent

### Mục đích

Chấm điểm và cập nhật kỹ năng.

### Input

- answers
- correct answers

### Output

- score
- AI feedback
- updated skills

### Database

- QuizAttempts
- QuizAttemptAnswers
- UserSkills

---

# 9. AI Mentor Agent

### Mục đích

Trợ lý học tập AI.

### Input

- student profile
- roadmap
- quiz history
- user skills
- progress

### Output

- personalized advice
- learning explanation
- next learning steps
- motivation support

### Database

- ChatSessions
- ChatMessages
- StudentProfiles
- UserSkills

---

# 10. Job Opportunity Agent

### Mục đích

Gợi ý việc làm phù hợp.

### Formula

```text id="5lyydm"
match_percent =
matched_skills / total_required_skills * 100
```

### Input

- UserSkills
- JobSkills
- preferred location

### Output

- recommended jobs
- match score
- missing skills

### Database

- JobPostings
- JobSkills
- Companies

---

# 11. AI Data Flow

## 11.1 Skill Gap Flow

```text id="h7jpsj"
UserSkills
    ↓
CareerSkills
    ↓
Skill Gap Engine
    ↓
Gap Analysis Result
```

---

## 11.2 Roadmap Flow

```text id="4bktbq"
Skill Gap
    ↓
Roadmap Generator
    ↓
RoadmapStages
    ↓
RoadmapTasks
```

---

## 11.3 Quiz Flow

```text id="zjlwmx"
Skill
    ↓
Quiz Generator
    ↓
Questions
    ↓
User Answers
    ↓
Quiz Evaluator
    ↓
Update UserSkills
```

---

## 11.4 AI Mentor Flow

```text id="5jlwmx"
Student Question
    ↓
Load Context
(Profile + Skills + Roadmap + Quiz)
    ↓
LLM API
    ↓
AI Response
```

---

## 11.5 Job Matching Flow

```text id="jlwmxx"
UserSkills
    ↓
JobSkills
    ↓
Match Engine
    ↓
Job Match Result
```

---

# 12. AI Rules

## General Rules

- AI must return valid JSON for structured data.
- AI must use database data.
- AI should explain recommendations.
- AI should not hallucinate jobs or skills.
- AI mentor must use student context.

---

## Database Rules

- Never invent table names.
- Follow database/migrations/schema.sql exactly.
- Respect PK/FK relationships.

---

## Recommendation Rules

- Prioritize high-weight skill gaps.
- Recommend foundational skills first.
- Roadmap must match study hours and deadline.

---

## Quiz Rules

- Questions must match difficulty level.
- Explanations should be educational.
- Quiz results can update UserSkills.

---

# 13. Future AI Upgrades

## Planned Upgrades

- Vector Database
- RAG
- Embedding Search
- AI Project Review
- Adaptive Learning
- Learning Prediction
- Voice AI Mentor

---

# 14. AI Service APIs

## Main AI Endpoints

```text id="jlwmxy"
/ai/skill-gap
/ai/roadmap/generate
/ai/resources/recommend
/ai/quiz/generate
/ai/quiz/evaluate
/ai/mentor/chat
/ai/jobs/match
```

---

# 15. Environment Variables

## AI Service

```env id="jlwmxz"
OPENAI_API_KEY=your_api_key
AI_MODEL=gpt-4o-mini
BACKEND_API_URL=http://localhost:3000/api/v1
```

---

# 16. Conclusion

The AI workflow is designed around:

- personalized learning
- skill analysis
- roadmap generation
- AI mentoring
- intelligent recommendation
- job matching

The system can later expand to:

- RAG
- Vector DB
- adaptive learning
- advanced recommendation systems
  without rebuilding the whole platform.
