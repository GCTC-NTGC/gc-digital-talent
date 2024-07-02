import { AssessmentStep, AssessmentStepType } from "@gc-digital-talent/graphql";

export type DialogType =
  | "EDUCATION"
  | "APPLICATION_SCREENING"
  | "SCREENING_QUESTIONS"
  | "GENERIC";

const useDialogType = (assessmentStep?: AssessmentStep): DialogType => {
  if (assessmentStep?.type?.value === AssessmentStepType.ApplicationScreening) {
    return "APPLICATION_SCREENING";
  }
  if (
    assessmentStep?.type?.value ===
    AssessmentStepType.ScreeningQuestionsAtApplication
  ) {
    return "SCREENING_QUESTIONS";
  }
  if (assessmentStep?.type !== undefined) {
    return "GENERIC";
  }

  return "EDUCATION";
};

export default useDialogType;
