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
  const {
    assessmentDecision,
    assessmentDecisionLevel,
    justifications,
    otherJustificationNotes,
    skillDecisionNotes,
  } = formValues;

  return {
    assessmentStepId,
    poolCandidateId,
    assessmentDecision,
    assessmentDecisionLevel,
    assessmentResultType,
    justifications: Array.isArray(justifications)
      ? [...justifications]
      : [justifications],
    otherJustificationNotes,
    poolSkillId: skillId,
    skillDecisionNotes,
  };
}
export function convertFormValuesToApiUpdateInput({
  formValues,
  assessmentResultId,
  assessmentResultType,
}: FormValuesToApiUpdateInputArgs): UpdateAssessmentResultInput {
  const {
    assessmentDecision,
    assessmentDecisionLevel,
    justifications,
    otherJustificationNotes,
    skillDecisionNotes,
  } = formValues;
  return {
    id: assessmentResultId,
    assessmentDecision,
    assessmentDecisionLevel,
    assessmentResultType,
    justifications: Array.isArray(justifications)
      ? [...justifications]
      : [justifications],
    otherJustificationNotes,
    skillDecisionNotes,
  };
}
