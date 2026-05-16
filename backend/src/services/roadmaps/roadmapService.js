import { AppError } from "../../models/common/appError.js";
import { findCareerById } from "../../repositories/careers/careerRepository.js";
import { findProfileByUserId } from "../../repositories/profiles/profileRepository.js";
import {
  findRoadmapByIdAndUserId,
  generateRoadmapFromCareerSkills,
  getCareerSkillGapForRoadmap,
  getRoadmapStagesWithTasks,
  getRoadmapsByUserId
} from "../../repositories/roadmaps/roadmapRepository.js";

const mapStagesWithTasks = (rows) => {
  const stages = [];
  const stageMap = new Map();

  rows.forEach((row) => {
    let stage = stageMap.get(row.stage_id);

    if (!stage) {
      stage = {
        stage_id: row.stage_id,
        roadmap_id: row.roadmap_id,
        stage_order: row.stage_order,
        stage_name: row.stage_name,
        description: row.stage_description,
        expected_weeks: row.expected_weeks,
        tasks: []
      };
      stageMap.set(row.stage_id, stage);
      stages.push(stage);
    }

    if (!row.task_id) {
      return;
    }

    stage.tasks.push({
      task_id: row.task_id,
      skill_id: row.skill_id,
      skill_name: row.skill_name,
      task_order: row.task_order,
      task_title: row.task_title,
      task_type: row.task_type,
      description: row.task_description,
      estimated_hours: row.estimated_hours,
      status: row.task_status,
      due_date: row.due_date,
      completed_at: row.completed_at,
      latest_progress_percent: row.latest_progress_percent ?? 0,
      latest_study_minutes: row.latest_study_minutes ?? 0,
      latest_logged_at: row.latest_logged_at
    });
  });

  return stages;
};

export const generateRoadmap = async (userId, payload) => {
  const career = await findCareerById(payload.career_id);

  if (!career) {
    throw new AppError("Nghề nghiệp không tồn tại.", 400, "CAREER_NOT_FOUND");
  }

  const profile = await findProfileByUserId(userId);

  if (!profile) {
    throw new AppError(
      "Bạn cần tạo hồ sơ học tập trước khi tạo lộ trình.",
      400,
      "PROFILE_REQUIRED"
    );
  }

  const gapItems = await getCareerSkillGapForRoadmap(userId, payload.career_id);

  if (!gapItems.length) {
    throw new AppError(
      "Nghề nghiệp này chưa có dữ liệu kỹ năng để tạo lộ trình.",
      400,
      "CAREER_SKILLS_NOT_FOUND"
    );
  }

  if (!gapItems.some((item) => item.gap_level > 0)) {
    throw new AppError(
      "Hiện tại chưa có khoảng cách kỹ năng để tạo lộ trình mới.",
      400,
      "ROADMAP_NOT_REQUIRED"
    );
  }

  const generated = await generateRoadmapFromCareerSkills({
    userId,
    careerId: payload.career_id,
    months: payload.target_completion_months ?? profile.target_completion_months
  });

  if (!generated?.roadmap_id) {
    throw new AppError("Không thể tạo lộ trình học vào lúc này.", 500, "ROADMAP_GENERATION_FAILED");
  }

  return getRoadmapDetail(userId, generated.roadmap_id);
};

export const getMyRoadmaps = async (userId) => getRoadmapsByUserId(userId);

export const getRoadmapDetail = async (userId, roadmapId) => {
  const roadmap = await findRoadmapByIdAndUserId(roadmapId, userId);

  if (!roadmap) {
    throw new AppError("Không tìm thấy lộ trình học.", 404, "ROADMAP_NOT_FOUND");
  }

  return roadmap;
};

export const getRoadmapStages = async (userId, roadmapId) => {
  await getRoadmapDetail(userId, roadmapId);
  const rows = await getRoadmapStagesWithTasks(roadmapId, userId);

  return mapStagesWithTasks(rows);
};
