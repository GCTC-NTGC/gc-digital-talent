export interface RouteParams extends Record<string, string> {
  id: string;
}

export type SubmitIntent = "save-draft" | "next-step";

export interface BaseFormValues {
  intent: SubmitIntent;
}
