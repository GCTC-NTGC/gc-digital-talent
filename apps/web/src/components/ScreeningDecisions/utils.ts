import { IntlShape } from "react-intl";
import { ReactNode } from "react";

import {
  AssessmentDecision,
  AssessmentResultJustification,
  AssessmentResultType,
  AssessmentStepType,
  CreateAssessmentResultInput,
  EducationRequirementOption,
  Experience,
  FragmentType,
  getFragment,
  graphql,
  Maybe,
  PublishingGroup,
  Scalars,
  SkillCategory,
  SkillLevel,
  UpdateAssessmentResultInput,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getLocale,
  getSkillLevelName,
} from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { NO_DECISION, NullableDecision } from "~/utils/assessmentResults";
import { getExperienceSkills } from "~/utils/skillUtils";
import {
  ClassificationGroup,
  isClassificationGroup,
} from "~/types/classificationGroup";
import { getEducationRequirementOptions } from "~/utils/educationUtils";
import { isIAPPool } from "~/utils/poolUtils";

import { FormValues } from "./types";

interface FormValuesToApiCreateInputArgs {
  formValues: FormValues;
  assessmentStepId: string;
  poolCandidateId: string;
  poolSkillId?: string;
  assessmentResultType: AssessmentResultType;
}

interface FormValuesToApiUpdateInputArgs {
  formValues: FormValues;
  assessmentResultId: string;
  assessmentResultType: AssessmentResultType;
}

// If justification is for education requirement assessment, it is just a string, need to tuck it into an array
const justificationsConverted = (
  justifications: FormValues["justifications"],
  assessmentDecision: FormValues["assessmentDecision"],
) => {
  if (assessmentDecision === AssessmentDecision.Hold) {
    return [AssessmentResultJustification.FailedOther];
  }
  return justifications && !Array.isArray(justifications)
    ? [justifications]
    : justifications;
};

export function convertFormValuesToApiCreateInput({
  formValues,
  assessmentStepId,
  poolCandidateId,
  poolSkillId,
  assessmentResultType,
}: FormValuesToApiCreateInputArgs): CreateAssessmentResultInput {
  const {
    assessmentDecision,
    assessmentDecisionLevel,
    justifications,
    skillDecisionNotes,
  } = formValues;

  return {
    assessmentStepId,
    poolCandidateId,
    assessmentDecision:
      assessmentDecision === NO_DECISION ? null : assessmentDecision,
    assessmentDecisionLevel,
    assessmentResultType,
    justifications:
      justificationsConverted(justifications, assessmentDecision) ?? undefined,
    poolSkillId,
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
    skillDecisionNotes,
  } = formValues;

  return {
    id: assessmentResultId,
    assessmentDecision:
      assessmentDecision === NO_DECISION ? null : assessmentDecision,
    assessmentDecisionLevel,
    assessmentResultType,
    justifications:
      justificationsConverted(justifications, assessmentDecision) ?? undefined,
    skillDecisionNotes,
  };
}

const ACCEPTED_EDUCATION_JUSTIFICATIONS = [
  AssessmentResultJustification.EducationAcceptedInformation,
  AssessmentResultJustification.EducationAcceptedCombinationEducationWorkExperience,
  AssessmentResultJustification.EducationAcceptedWorkExperienceEquivalency,
];

const ScreeningDialogFormValues_Fragment = graphql(/** GraphQL */ `
  fragment ScreeningDialogFormValues on AssessmentResult {
    id
    assessmentDecision {
      value
    }
    assessmentDecisionLevel {
      value
    }
    justifications {
      value
    }
    skillDecisionNotes
  }
`);

export const convertApiToFormValues = (
  query?: FragmentType<typeof ScreeningDialogFormValues_Fragment>,
): FormValues => {
  const data = getFragment(ScreeningDialogFormValues_Fragment, query);
  const assessed = Boolean(data?.id);
  let assessmentDecision: NullableDecision | undefined =
    data?.assessmentDecision?.value;
  if (assessed && !assessmentDecision) {
    assessmentDecision = NO_DECISION;
  }

  const isEducationAcceptedJustification = data?.justifications?.some(
    (justification) =>
      justification?.value &&
      ACCEPTED_EDUCATION_JUSTIFICATIONS.includes(justification.value),
  );
  let justifications:
    | AssessmentResultJustification[]
    | AssessmentResultJustification = unpackMaybes(
    data?.justifications?.flatMap((justification) => justification?.value),
  );
  if (isEducationAcceptedJustification) {
    justifications = justifications[0];
  }

  return {
    assessmentDecision,
    assessmentDecisionLevel: data?.assessmentDecisionLevel?.value,
    justifications,
    skillDecisionNotes: data?.skillDecisionNotes ?? undefined,
  };
};

export const educationJustificationContext = (
  justification: Maybe<AssessmentResultJustification> | undefined,
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

export const DIALOG_TYPE = {
  ApplicationScreening: "APPLICATION_SCREENING",
  ScreeningQuestions: "SCREENING_QUESTIONS",
  Generic: "GENERIC",
  Education: "EDUCATION",
} as const;

type ObjectValues<T> = T[keyof T];
export type DialogType = ObjectValues<typeof DIALOG_TYPE>;

export function getDialogType(
  type?: Maybe<AssessmentStepType>,
  poolSkillId?: Maybe<Scalars["UUID"]["output"]>,
): DialogType {
  if (!poolSkillId || !type) return DIALOG_TYPE.Education;

  if (type === AssessmentStepType.ApplicationScreening) {
    return DIALOG_TYPE.ApplicationScreening;
  }

  if (type === AssessmentStepType.ScreeningQuestionsAtApplication) {
    return DIALOG_TYPE.ScreeningQuestions;
  }

  return DIALOG_TYPE.Generic;
}

export const getSkillLevelMessage = (
  intl: IntlShape,
  poolSkill?: {
    requiredLevel?: Maybe<SkillLevel>;
    skill?: Maybe<{
      category: {
        value: SkillCategory;
      };
    }>;
  },
): string => {
  let skillLevel = "";
  if (poolSkill?.requiredLevel && poolSkill.skill?.category.value) {
    skillLevel = intl.formatMessage(
      getSkillLevelName(
        poolSkill.requiredLevel,
        poolSkill.skill.category.value,
      ),
    );
  }
  return skillLevel;
};

export const hasAttachedExperiences = (
  experiences?: Maybe<Maybe<Experience>[]>,
  skill?: Maybe<{ id: Scalars["UUID"]["output"] }>,
) => {
  if (!skill) return false;
  return getExperienceSkills(unpackMaybes(experiences), skill)?.length > 0;
};

interface GetEducationRequirementLabelArgs {
  intl: IntlShape;
  educationRequirementOption?: Maybe<EducationRequirementOption>;
  group?: Maybe<ClassificationGroup>;
  publishingGroup?: Maybe<PublishingGroup>;
}

export const getEducationRequirementLabel = ({
  intl,
  group,
  publishingGroup,
  educationRequirementOption,
}: GetEducationRequirementLabelArgs): ReactNode => {
  const locale = getLocale(intl);
  let classificationGroup: ClassificationGroup = "IT";
  if (isClassificationGroup(group)) {
    classificationGroup = group;
  }

  const option = getEducationRequirementOptions(
    intl,
    locale,
    classificationGroup,
    isIAPPool(publishingGroup),
  )?.find(({ value }) => value === educationRequirementOption);

  return option?.label ?? intl.formatMessage(commonMessages.notAvailable);
};
