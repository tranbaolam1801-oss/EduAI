import { getSkillCategories } from "../../repositories/skillCategories/skillCategoryRepository.js";

export const listSkillCategories = async () => getSkillCategories();
