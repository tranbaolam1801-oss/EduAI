import { getSkills } from "../../repositories/skills/skillRepository.js";

export const listSkills = async (filters) => getSkills(filters);
