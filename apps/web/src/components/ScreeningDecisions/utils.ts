import { IntlShape } from "react-intl";

import {
  AssessmentResultType,
  CreateAssessmentResultInput,
  Maybe,
  SkillCategory,
  UpdateAssessmentResultInput,
  UserSkill,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getBehaviouralSkillLevel,
  getTechnicalSkillLevel,
} from "@gc-digital-talent/i18n";

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

export function getLocalizedSkillLevel(
  userSkill: Maybe<UserSkill>,
  intl: IntlShape,
): string {
  if (!userSkill || !userSkill.skill || !userSkill.skillLevel) {
    return intl.formatMessage(commonMessages.notFound);
  }

  if (userSkill.skill.category === SkillCategory.Technical) {
    return intl.formatMessage(getTechnicalSkillLevel(userSkill.skillLevel));
  }

  return intl.formatMessage(getBehaviouralSkillLevel(userSkill.skillLevel));
}
