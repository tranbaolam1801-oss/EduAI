# Agents

# AGENTS.md

# AI Learning & Career System - Codex Instructions

---

# 1. PROJECT OVERVIEW

## Project Name

AI Learning & Career System

## Project Goal

Build an AI-powered platform that helps students from multiple majors:

- assess current skills
- choose target careers
- analyze skill gaps
- generate personalized learning roadmaps
- track learning progress
- receive AI recommendations
- take quizzes and assessments
- interact with AI Mentor
- find job opportunities
- monitor analytics and reports

The platform acts as:

> an AI-powered Learning & Career Operating System.

---

# 2. MAIN USERS

| User      | Role                                          |
| --------- | --------------------------------------------- |
| Student   | Main user of the system                       |
| Admin     | Manage data and system configuration          |
| Advisor   | Monitor and guide students                    |
| AI Mentor | AI assistant for learning and career guidance |

---

# 3. TECH STACK

## Frontend Web

- HTML
- CSS
- JavaScript

## Mobile App

- Flutter

## Backend

- Node.js
- Express.js

## AI Service

- Python
- FastAPI
- OpenAI API / Gemini API

## Database

- Microsoft SQL Server

## Deployment

- Docker
- Docker Compose

---

# 4. PROJECT STRUCTURE

```text id="1jjlwm"
frontend/
├── web/
└── app/

backend/

ai-service/

database/

docs/

storage/
```

---

# 5. IMPORTANT DOCUMENTS

Before coding, ALWAYS read:

```text id="2jjlwm"
docs/business-analysis.md
docs/database-design.md
docs/api-document.md
docs/architecture.md
docs/ai-workflow.md
docs/ui-ux.md
database/schema.sql
README.md
```

---

# 6. DATABASE RULES

## Database Source of Truth

```text id="3jjlwm"
database/schema.sql
```

Rules:

- Never invent table names.
- Never invent columns.
- Never change schema without approval.
- Respect PK/FK relationships.
- Respect CHECK constraints.
- Respect business logic in procedures and triggers.

---

# 7. MAIN BUSINESS MODULES

- Onboarding
- Skill Assessment
- Career Selection
- Skill Gap Analysis
- Personalized Learning Roadmap
- Progress Tracking
- Resource Recommendation
- Quiz & Assessment
- AI Mentor
- Job Opportunities
- Community & Challenges
- Analytics & Reports

---

# 8. BACKEND RULES

## Architecture

```text id="4jjlwm"
routes/
controllers/
services/
models/
middlewares/
```

Rules:

- routes = API routes only
- controllers = request handling
- services = business logic
- models = database access
- never put business logic inside routes

---

# 9. API RULES

## Base URL

```text id="5jjlwm"
/api/v1
```

## Response Success Format

```json id="6jjlwm"
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

## Response Error Format

```json id="7jjlwm"
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid data",
    "details": []
  }
}
```

---

# 10. FRONTEND RULES

## Web

Location:

```text id="8jjlwm"
frontend/web/
```

## Mobile Flutter

Location:

```text id="9jjlwm"
frontend/app/
```

Rules:

- Web and mobile may have different UI.
- Both use the same backend API.
- Do not duplicate backend business logic in frontend.
- Use reusable components.
- Keep layout consistent.

---

# 11. UI/UX RULES

## Design Style

- AI SaaS Dashboard
- Modern UI
- Glassmorphism
- Responsive Design

## Main Colors

```text id="10jjlwm"
Primary: #6C63FF
Secondary: #7B61FF
Dark: #0F172A
Background: #F8FAFC
```

## Main Layout

```text id="11jjlwm"
Sidebar
Topbar
Main Content
AI Panel
```

Do not change layout structure without approval.

---

# 12. AI SERVICE RULES

## AI Level

Use:

```text id="12jjlwm"
Python FastAPI + LLM API + Prompt Engineering + Database Data
```

DO NOT train models from scratch.

---

# 13. AI AGENTS

```text id="13jjlwm"
skill_assessment_agent.py
career_recommendation_agent.py
skill_gap_agent.py
learning_path_agent.py
resource_recommendation_agent.py
quiz_agent.py
ai_mentor_agent.py
job_opportunity_agent.py
report_agent.py
```

---

# 14. AI RULES

- AI must return valid JSON.
- AI must use database data.
- AI recommendations must be explainable.
- AI should not hallucinate jobs or skills.
- AI mentor should use user context.

---

# 15. MAIN AI LOGIC

## Skill Gap Formula

```text id="14jjlwm"
gap_level = required_level - current_level
```

## Job Match Formula

```text id="15jjlwm"
match_percent =
matched_skills / total_required_skills * 100
```

---

# 16. SECURITY RULES

- Use JWT authentication.
- Store only password_hash.
- Prevent SQL injection.
- Validate all input.
- Use role-based authorization.

Roles:

- ADMIN
- STUDENT
- ADVISOR

---

# 17. FILE UPLOAD RULES

Uploads location:

```text id="16jjlwm"
storage/uploads/
```

Folders:

- avatars
- certificates
- projects
- challenge-submissions
- resources

Rules:

- Do not store binary images in SQL Server.
- Store only file path/url.
- Backend uses multer.

---

# 18. DEVELOPMENT WORKFLOW

## Phase 1

- Database
- Auth
- User Profile

## Phase 2

- Skills
- Careers
- Skill Gap

## Phase 3

- Roadmaps
- Progress Tracking
- Resources

## Phase 4

- Quiz System
- AI Mentor
- Job Matching

## Phase 5

- Analytics
- Community
- Reports

## Phase 6

- Mobile App
- Deployment
- AI Upgrade

---

# 19. ENVIRONMENT VARIABLES

## Backend

```env id="17jjlwm"
PORT=3000
DB_HOST=localhost
DB_PORT=1433
DB_NAME=AI_LearningCareerDB
DB_USER=sa
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
AI_SERVICE_URL=http://localhost:8000
```

## AI Service

```env id="18jjlwm"
OPENAI_API_KEY=your_api_key
AI_MODEL=gpt-4o-mini
BACKEND_API_URL=http://localhost:3000/api/v1
```

---

# 20. CODING RULES

- Keep code modular.
- Keep naming consistent.
- Follow existing architecture.
- Do not generate fake business logic.
- Explain major changes before large refactors.
- List changed files after modifications.

---

# 21. DEFINITION OF DONE

A task is complete only when:

- business flow is correct
- database schema is respected
- API format is correct
- frontend can use the API
- AI output is valid
- no major architecture violation exists

---

# 22. FINAL GOAL

The final system should become:

> an AI-powered personalized learning and career development platform for students.

The platform must:

- understand user skills
- understand career goals
- generate learning plans
- monitor progress
- evaluate performance
- provide AI mentorship
- recommend jobs
- help students become career-ready
