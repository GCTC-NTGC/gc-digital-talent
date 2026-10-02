import type { ExperienceForInfo } from "~/utils/experienceUtils";

import type { ExperienceSkill } from "../ExperienceCard/SkillsContent";

export interface ExperienceDetails {
  details?: string | null;
}

export interface ExperienceWithSkills extends ExperienceForInfo {
  skills?: ExperienceSkill[] | null;
}

export type DialogExperience<E> = E & ExperienceWithSkills;
