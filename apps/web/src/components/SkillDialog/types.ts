import { Scalars, SkillCategory } from "@gc-digital-talent/graphql";

export type SkillDialogContext = "experience" | "library" | "showcase";

export interface FormValues {
  category?: SkillCategory | "all" | "";
  family?: Scalars["ID"];
  skill?: Scalars["ID"];
  details?: string;
}
