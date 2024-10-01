import {
  Scalars,
  Skill,
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
  category?: string;
  family?: string;
  skill?: Scalars["ID"]["output"];
  details?: string;
  skillLevel?: SkillLevel;
  whenSkillUsed?: WhenSkillUsed;
}

export interface BaseSkillBrowserProps {
  skills: Skill[];
}
