import { IntlShape } from "react-intl";

import {
  AssessmentResult,
  AssessmentResultJustification,
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

export type FormValues = {
  assessmentDecision: AssessmentResult["assessmentDecision"];
  justifications: AssessmentResult["justifications"];
  assessmentDecisionLevel: AssessmentResult["assessmentDecisionLevel"];
  otherJustificationNotes: AssessmentResult["otherJustificationNotes"];
  skillDecisionNotes: AssessmentResult["skillDecisionNotes"];
  notesForThisAssessment: Maybe<string>; // TODO: Does this field need to be added to AssessmentResult model?
};

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

export const educationJustificationContext = (
  justification: Maybe<AssessmentResultJustification>,
  intl: IntlShape,
) => {
  const acceptedInformationMessages = [
    intl.formatMessage({
      defaultMessage:
        "Duration of study is equivalent to the degree requirement",
      id: "sigMut",
      description:
        "Text for education accepted information context in screening decision dialog",
    }),
    intl.formatMessage({
      defaultMessage: "Specialization is relevant to the degree requirement",
      id: "Aqz3Ma",
      description:
        "Text for education accepted information context in screening decision dialog",
    }),
    intl.formatMessage({
      defaultMessage:
        "Study has been completed at a recognized education institution",
      id: "dXR2A7",
      description:
        "Text for education accepted information context in screening decision dialog",
    }),
  ];
  const combinationAndWorkEquivalentMessages = [
    intl.formatMessage({
      defaultMessage:
        "Is equivalent in terms of duration to the degree requirements",
      id: "W+Lub4",
      description:
        "Text for education accepted information context in screening decision dialog",
    }),
    intl.formatMessage({
      defaultMessage:
        "Is equivalent in terms of intensity/learning to the degree requirements",
      id: "bnhqpY",
      description:
        "Text for education accepted information context in screening decision dialog",
    }),
    intl.formatMessage({
      defaultMessage: "Reflects the necessary specialization",
      id: "93zCaS",
      description:
        "Text for education accepted information context in screening decision dialog",
    }),
  ];

  switch (justification) {
    case AssessmentResultJustification.EducationAcceptedInformation:
      return {
        key: "accepted-info-message",
        messages: acceptedInformationMessages,
      };
    case AssessmentResultJustification.EducationAcceptedCombinationEducationWorkExperience:
      return {
        key: "combination-education-message",
        messages: combinationAndWorkEquivalentMessages,
      };
    case AssessmentResultJustification.EducationAcceptedWorkExperienceEquivalency:
      return {
        key: "work-equivalency-message",
        messages: combinationAndWorkEquivalentMessages,
      };
    default:
      return null;
  }
};
