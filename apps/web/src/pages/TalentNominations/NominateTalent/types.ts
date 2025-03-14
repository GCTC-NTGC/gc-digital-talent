import { Scalars } from "@gc-digital-talent/graphql";

export interface RouteParams extends Record<string, string> {
  id: Scalars["ID"]["output"];
}

export type SubmitIntent = "save-draft" | "next-step";

export interface BaseFormValues {
  intent: SubmitIntent;
}
