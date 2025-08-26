import { faker } from "@faker-js/faker/locale/en";

import {
  AssessmentStep,
  AssessmentStepType,
  Maybe,
  PoolSkill,
} from "@gc-digital-talent/graphql";

import toLocalizedString from "./fakeLocalizedString";
import toLocalizedEnum from "./fakeLocalizedEnum";

const generateAssessmentStep = (
  amount: number,
  sortOrder?: number,
  type?: Maybe<AssessmentStepType>,
  poolSkills?: Maybe<PoolSkill>[],
): AssessmentStep => {
  return {
    id: faker.string.uuid(),
    type: toLocalizedEnum(
      type ??
        faker.helpers.arrayElement<AssessmentStepType>(
          Object.values(AssessmentStepType),
        ),
    ),
    sortOrder:
      sortOrder ??
      faker.number.int({
        max: amount,
      }),
    title: toLocalizedString(faker.lorem.word()),
    poolSkills: poolSkills ?? [],
  };
};

export default (
  numToGenerate?: number,
  type?: Maybe<AssessmentStepType>,
  poolSkills?: Maybe<PoolSkill>[],
): AssessmentStep[] => {
  faker.seed(0); // repeatable results
  const amountToGenerate = numToGenerate ?? 20;
  const otherScreeningTypes = Object.values(AssessmentStepType).filter(
    (stepType) =>
      stepType !== AssessmentStepType.ApplicationScreening &&
      stepType !== AssessmentStepType.ScreeningQuestionsAtApplication,
  );
  return Array.from({ length: amountToGenerate }, (_, index) => {
    switch (index) {
      case 0:
        return generateAssessmentStep(
          amountToGenerate,
          index,
          type ?? AssessmentStepType.ApplicationScreening,
          poolSkills,
        );
      case 1:
        return generateAssessmentStep(
          amountToGenerate,
          index,
          type ?? AssessmentStepType.ScreeningQuestionsAtApplication,
          poolSkills,
        );
      default:
        return generateAssessmentStep(
          amountToGenerate,
          index,
          type ?? faker.helpers.arrayElement(otherScreeningTypes),
          poolSkills,
        );
    }
  });
};
