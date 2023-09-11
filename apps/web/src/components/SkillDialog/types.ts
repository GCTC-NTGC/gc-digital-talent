import {
  Scalars,
  SkillCategory,
  SkillLevel,
  WhenSkillUsed,
} from "@gc-digital-talent/graphql";

export type SkillDialogContext =
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
