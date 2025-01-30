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
  | "showcase";

export interface FormValues {
  category?: SkillCategory | "all" | "";
  family?: Scalars["ID"]["output"];
  skill?: Scalars["ID"]["output"];
  details?: string;
  skillLevel?: SkillLevel;
  whenSkillUsed?: WhenSkillUsed;
}

export interface BaseSkillBrowserProps {
  skills: Skill[];
}
