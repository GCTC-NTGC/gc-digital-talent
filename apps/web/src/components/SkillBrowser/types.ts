import type {
  SkillCategory,
  SkillLevel,
  WhenSkillUsed,
} from "@gc-digital-talent/graphql";

export type SkillBrowserDialogContext =
  | "pool"
  | "experience"
  | "library"
  | "showcase"
  | "skill-proficiency-list-with-level"
  | "skill-proficiency-list-without-level";

export interface SelectedSkill {
  id: string;
  name: string | null;
  category: SkillCategory | null;
}

export interface FormValues {
  category?: SkillCategory | "all" | "";
  family?: string;
  skill?: string;
  details?: string;
  skillLevel?: SkillLevel;
  whenSkillUsed?: WhenSkillUsed;
}
