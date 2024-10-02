import { faker } from "@faker-js/faker/locale/en";

import {
  AssessmentStep,
  AssessmentStepType,
  Maybe,
} from "@gc-digital-talent/graphql";

import toLocalizedEnum from "./fakeLocalizedEnum";

const generateAssessmentStep = (
  amount: number,
  sortOrder?: number,
  type?: Maybe<AssessmentStepType>,
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
    title: {
      en: `${faker.lorem.word()} EN`,
      fr: `${faker.lorem.word()} FR`,
    },
    poolSkills: [],
  };
};

export default (
  numToGenerate?: number,
  type?: Maybe<AssessmentStepType>,
): AssessmentStep[] => {
  faker.seed(0); // repeatable results
  const amountToGenerate = numToGenerate ?? 20;
  const otherScreeningTypes = Object.values(AssessmentStepType).filter(
    (stepType) =>
      stepType !== AssessmentStepType.ApplicationScreening &&
      stepType !== AssessmentStepType.ScreeningQuestionsAtApplication,
  );
  return [...Array(amountToGenerate)].map((_, index) => {
    switch (index) {
      case 0:
        return generateAssessmentStep(
          amountToGenerate,
          index,
          type ?? AssessmentStepType.ApplicationScreening,
        );
      case 1:
        return generateAssessmentStep(
          amountToGenerate,
          index,
          type ?? AssessmentStepType.ScreeningQuestionsAtApplication,
        );
      default:
        return generateAssessmentStep(
          amountToGenerate,
          index,
          type ?? faker.helpers.arrayElement(otherScreeningTypes),
        );
    }
  });
};
