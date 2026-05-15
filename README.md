# AI Learning System

# README.md

# AI Learning & Career System

AI-powered personalized learning and career guidance platform for students from multiple majors.

---

# 1. Project Overview

AI Learning & Career System is a platform designed to help students:

- assess their current skills
- choose target careers
- analyze skill gaps
- generate personalized learning roadmaps
- track learning progress
- receive AI learning recommendations
- take quizzes and assessments
- interact with an AI Mentor
- explore job opportunities by location
- participate in learning challenges
- view analytics and reports

The system acts as:

> an AI-powered Learning & Career Operating System.

---

# 2. Main Objectives

The system aims to solve these problems:

- Students do not know what to learn first.
- Students do not know which skills they are missing.
- Learning roadmaps are not personalized.
- Students struggle to track learning progress.
- Students cannot connect learning with real job opportunities.
- Students lack continuous mentoring and career guidance.

The platform uses AI to:

- analyze skills
- recommend careers
- generate roadmaps
- recommend resources
- generate quizzes
- support learning conversations
- recommend jobs

---

# 3. Main Users

| User      | Role                                                                   |
| --------- | ---------------------------------------------------------------------- |
| Student   | Main user using learning roadmap, quizzes, AI mentor, and job matching |
| Admin     | Manage skills, careers, jobs, resources, users, and reports            |
| Advisor   | Monitor and advise student progress                                    |
| AI Mentor | AI assistant for roadmap generation and learning support               |

---

# 4. Main Business Modules

## 1. Onboarding / Student Profile

- Create learning profile
- Select academic field
- Enter study schedule
- Set learning goals

---

## 2. Skill Assessment

- Self assessment
- Quiz-based evaluation
- AI evaluation
- Skill confidence level

---

## 3. Career Selection

- Browse careers
- Compare careers
- Match score
- Career requirements

---

## 4. Skill Gap Analysis

- Compare UserSkills with CareerSkills
- Calculate missing skills
- Prioritize learning order

---

## 5. Personalized Learning Roadmap

- AI-generated roadmap
- Learning stages
- Tasks and deadlines
- Progress tracking

---

## 6. Progress Tracking

- Study logs
- Completion percentage
- Learning analytics
- Progress dashboard

---

## 7. Resource Recommendation

- Courses
- Videos
- Books
- Articles
- Projects

---

## 8. Quiz & Assessment

- AI-generated quizzes
- MCQ
- Coding challenge
- Quiz evaluation
- Skill update after quiz

---

## 9. AI Mentor

- AI chatbot
- Personalized learning support
- Learning explanation
- Career guidance

---

## 10. Job Opportunities

- Job search by location
- Job match percentage
- Company information
- Apply links

---

## 11. Community & Challenges

- Challenges
- Leaderboards
- Study groups
- Learning activities

---

## 12. Analytics & Reports

- Skill growth
- Quiz results
- Roadmap completion
- Career readiness
- Job match score

---

# 5. Technology Stack

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

## Future AI Storage

- ChromaDB
- Pinecone

## Deployment

- Docker
- Docker Compose

---

# 6. System Architecture

```text id="h53uy4"
Frontend (Web / Mobile)
            ↓
      Backend API Server
            ↓
 ┌───────────────┬────────────────┐
 ↓               ↓                ↓
SQL Server    AI Service      Vector DB
                    ↓
              LLM APIs
```

---

# 7. Project Structure

```text id="7q8gbv"
ai-learning-system/
│
├── frontend/
│   ├── web/
│   └── app/
│
├── backend/
│
├── ai-service/
│
├── database/
│
├── storage/
│
├── docs/
│
├── docker/
│
├── docker-compose.yml
├── AGENTS.md
└── README.md
```

---

# 8. Database Overview

Main database tables include:

- Roles
- Users
- StudentProfiles
- Skills
- Careers
- CareerSkills
- UserSkills
- LearningRoadmaps
- RoadmapStages
- RoadmapTasks
- LearningResources
- Quizzes
- QuizQuestions
- QuizOptions
- QuizAttempts
- QuizAttemptAnswers
- Companies
- JobPostings
- JobSkills
- AIRecommendations
- ChatSessions
- ChatMessages
- Challenges
- Notifications

Database source of truth:

```text id="m8o2h0"
database/schema.sql
```

---

# 9. AI Workflow Overview

The system uses:

```text id="zlmvv8"
Python FastAPI + LLM API + Prompt Engineering + Database Data
```

The system does NOT train models from scratch.

Main AI agents:

- Skill Gap Agent
- Roadmap Generator
- Quiz Generator
- AI Mentor
- Job Matching Agent
- Resource Recommendation Agent

---

# 10. API Design

Base URL:

```text id="2kp8p3"
/api/v1
```

Main API groups:

- /auth
- /profiles
- /skills
- /careers
- /roadmaps
- /resources
- /quizzes
- /chat
- /jobs
- /analytics

Full API documentation:

```text id="1c1v6m"
docs/api-document.md
```

---

# 11. UI/UX Design

The system uses:

- AI SaaS dashboard style
- modern enterprise UI
- responsive layout
- dark/light mode

Main pages:

- onboarding
- dashboard
- roadmap
- AI mentor
- jobs
- analytics

UI/UX document:

```text id="3fl4u4"
docs/ui-ux.md
```

---

# 12. AI Service Design

AI Service is separated from backend for scalability.

AI Service responsibilities:

- skill gap analysis
- roadmap generation
- quiz generation
- AI mentor
- resource recommendation
- job matching

AI workflow document:

```text id="q5zjlwm"
docs/ai-workflow.md
```

---

# 13. Security

- JWT Authentication
- Role-based authorization
- Password hashing
- Account locking
- Input validation
- SQL injection prevention

Roles:

- ADMIN
- STUDENT
- ADVISOR

---

# 14. Development Order

## Phase 1

- Database
- Authentication
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
- Docker Deployment
- AI Upgrade

---

# 15. Running the Project

## Database

Run:

```text id="0x9qzq"
database/schema.sql
```

Then:

```text id="zjvtj9"
database/seed.sql
```

---

## Backend

```bash id="cwwm58"
cd backend
npm install
npm run dev
```

---

## AI Service

```bash id="vysynw"
cd ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## Frontend Web

Open:

```text id="xal0zf"
frontend/web/
```

---

## Flutter Mobile App

```bash id="6hjc09"
cd frontend/app
flutter pub get
flutter run
```

---

# 16. Documentation

| File                      | Purpose                         |
| ------------------------- | ------------------------------- |
| docs/business-analysis.md | Business analysis and workflows |
| docs/database-design.md   | Database design                 |
| docs/api-document.md      | API documentation               |
| docs/architecture.md      | System architecture             |
| docs/ai-workflow.md       | AI workflow                     |
| docs/ui-ux.md             | UI/UX rules                     |

---

# 17. Important Rules

- Do not invent database table names.
- Follow database/schema.sql.
- Keep frontend and backend separated.
- Keep AI logic inside ai-service.
- Use API-driven architecture.
- Do not hardcode business data.

---

# 18. Final Goal

The final platform should become:

> an AI-powered personalized learning and career development platform for students.

The system should:

- understand user skills
- understand career goals
- generate learning plans
- monitor progress
- evaluate learning performance
- provide AI mentorship
- recommend jobs
- help students become career-ready.
