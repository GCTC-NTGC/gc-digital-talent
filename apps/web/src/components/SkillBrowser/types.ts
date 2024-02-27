import {
  Scalars,
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
  | "directive_forms";

export interface FormValues {
  category?: SkillCategory | "all" | "";
  family?: Scalars["ID"];
  skill?: Scalars["ID"];
  details?: string;
  skillLevel?: SkillLevel;
  whenSkillUsed?: WhenSkillUsed;
}

export interface BaseSkillBrowserProps {
  skills: Skill[];
  showCategory?: boolean;
}
