from app.agents.ai_mentor_agent import agent as ai_mentor_agent
from app.agents.career_recommendation_agent import agent as career_recommendation_agent
from app.agents.job_opportunity_agent import agent as job_opportunity_agent
from app.agents.learning_path_agent import agent as learning_path_agent
from app.agents.quiz_agent import agent as quiz_agent
from app.agents.report_agent import agent as report_agent
from app.agents.resource_recommendation_agent import agent as resource_recommendation_agent
from app.agents.skill_assessment_agent import agent as skill_assessment_agent
from app.agents.skill_gap_agent import agent as skill_gap_agent

AGENT_REGISTRY = [
    skill_assessment_agent,
    career_recommendation_agent,
    skill_gap_agent,
    learning_path_agent,
    resource_recommendation_agent,
    quiz_agent,
    ai_mentor_agent,
    job_opportunity_agent,
    report_agent,
]
