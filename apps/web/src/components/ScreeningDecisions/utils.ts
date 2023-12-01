import {
  AssessmentResultType,
  CreateAssessmentResultInput,
  UpdateAssessmentResultInput,
} from "@gc-digital-talent/graphql";

import { FormValues } from "./ScreeningDecisionDialogForm";

export type FormValuesToApiCreateInputArgs = {
  formValues: FormValues;
  assessmentStepId: string;
  poolCandidateId: string;
  skillId: string;
  assessmentResultType: AssessmentResultType;
};

export type FormValuesToApiUpdateInputArgs = {
  formValues: FormValues;
  assessmentResultId: string;
  assessmentResultType: AssessmentResultType;
};

export function convertFormValuesToApiCreateInput({
  formValues,
  assessmentStepId,
  poolCandidateId,
  skillId,
  assessmentResultType,
}: FormValuesToApiCreateInputArgs): CreateAssessmentResultInput {
  return {
    assessmentStepId,
    poolCandidateId,
    assessmentDecision: formValues.assessmentDecision,
    assessmentDecisionLevel: formValues.assessmentDecisionLevel,
    assessmentResultType,
    justifications: formValues.justifications,
    otherJustificationNotes: formValues.notesForThisAssessment,
    poolSkillId: skillId,
    skillDecisionNotes: formValues.skillDecisionNotes,
  };
}
export function convertFormValuesToApiUpdateInput({
  formValues,
  assessmentResultId,
  assessmentResultType,
}: FormValuesToApiUpdateInputArgs): UpdateAssessmentResultInput {
  return {
    id: assessmentResultId,
    assessmentDecision: formValues.assessmentDecision,
    assessmentDecisionLevel: formValues.assessmentDecisionLevel,
    assessmentResultType,
    justifications: formValues.justifications,
    otherJustificationNotes: formValues.notesForThisAssessment,
    skillDecisionNotes: formValues.skillDecisionNotes,
  };
}
