import { AppError } from "../../models/common/appError.js";
import { findCareerById } from "../../repositories/careers/careerRepository.js";
import { getCompanyJobs, findCompanyById } from "../../repositories/companies/companyRepository.js";
import { getJobs, getJobSkills } from "../../repositories/jobs/jobRepository.js";
import { findProfileByUserId } from "../../repositories/profiles/profileRepository.js";
import { getUserSkillsByUserId } from "../../repositories/userSkills/userSkillRepository.js";
import { explainJobMatches } from "../ai/aiServiceClient.js";

const buildFallbackExplanation = (job, userSkills) => {
  const matchedSkills = userSkills
    .filter((skill) => Number(skill.current_level || 0) >= 50)
    .slice(0, 2)
    .map((skill) => skill.skill_name);

  if (!matchedSkills.length) {
    return `Vị trí này phù hợp ở mức nền tảng. Bạn nên tiếp tục cải thiện kỹ năng cốt lõi trước khi ứng tuyển.`;
  }

  return `Vị trí này đang phù hợp nhờ các kỹ năng ${matchedSkills.join(", ")}. Hãy đối chiếu thêm yêu cầu cụ thể của công việc trước khi ứng tuyển.`;
};

const enrichJobsWithSkills = async (jobs) => {
  const skillGroups = await Promise.all(
    jobs.map(async (job) => ({
      job_id: job.job_id,
      skills: await getJobSkills(job.job_id)
    }))
  );

  const skillMap = new Map(skillGroups.map((group) => [group.job_id, group.skills]));

  return jobs.map((job) => ({
    ...job,
    required_skills: skillMap.get(job.job_id) || []
  }));
};

export const listJobs = async (userId, params) => {
  if (params.careerId) {
    const career = await findCareerById(params.careerId);

    if (!career) {
      throw new AppError("Nghề nghiệp không tồn tại.", 400, "CAREER_NOT_FOUND");
    }
  }

  return enrichJobsWithSkills(
    await getJobs({
      userId,
      ...params
    })
  );
};

export const listRecommendedJobs = async (userId, params) => {
  const profile = await findProfileByUserId(userId);
  const userSkills = await getUserSkillsByUserId(userId);
  const preferredLocation = params.location ?? profile?.preferred_location ?? null;

  let jobs = await getJobs({
    userId,
    careerId: params.careerId ?? null,
    location: preferredLocation,
    workingType: params.workingType ?? null,
    salaryMin: params.salaryMin ?? null,
    salaryMax: params.salaryMax ?? null,
    limit: params.limit ?? 10
  });

  if (!jobs.length && preferredLocation) {
    jobs = await getJobs({
      userId,
      careerId: params.careerId ?? null,
      location: null,
      workingType: params.workingType ?? null,
      salaryMin: params.salaryMin ?? null,
      salaryMax: params.salaryMax ?? null,
      limit: params.limit ?? 10
    });
  }

  jobs = await enrichJobsWithSkills(jobs);

  let aiExplanations = [];

  try {
    const response = await explainJobMatches({
      user_id: userId,
      preferred_location: profile?.preferred_location ?? null,
      top_skills: userSkills.slice(0, 5).map((skill) => ({
        skill_name: skill.skill_name,
        current_level: skill.current_level
      })),
      jobs: jobs.map((job) => ({
        job_id: job.job_id,
        job_title: job.job_title,
        company_name: job.company_name,
        match_percent: job.match_percent ?? 0
      }))
    });

    aiExplanations = response.jobs || [];
  } catch (_error) {
    aiExplanations = [];
  }

  const explanationMap = new Map(aiExplanations.map((job) => [job.job_id, job.explanation]));

  return jobs.map((job) => ({
    ...job,
    match_explanation: explanationMap.get(job.job_id) || buildFallbackExplanation(job, userSkills)
  }));
};

export const getCompanyDetail = async (companyId) => {
  const company = await findCompanyById(companyId);

  if (!company) {
    throw new AppError("Không tìm thấy công ty.", 404, "COMPANY_NOT_FOUND");
  }

  return {
    ...company,
    jobs: await getCompanyJobs(companyId)
  };
};
