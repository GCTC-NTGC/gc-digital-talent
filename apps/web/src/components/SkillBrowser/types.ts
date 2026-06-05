import type {
  Skill,
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

export interface FormValues {
  category?: SkillCategory | "all" | "";
  family?: string;
  skill?: string;
  details?: string;
  skillLevel?: SkillLevel;
  whenSkillUsed?: WhenSkillUsed;
}

export interface BaseSkillBrowserProps {
  skills: Skill[];
}
