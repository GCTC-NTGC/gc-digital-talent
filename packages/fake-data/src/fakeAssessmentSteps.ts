import { faker } from "@faker-js/faker";

import { AssessmentStep, AssessmentStepType } from "@gc-digital-talent/graphql";

const generateAssessmentStep = (amount: number): AssessmentStep => {
  return {
    id: faker.string.uuid(),
    type: faker.helpers.arrayElement<AssessmentStepType>(
      Object.values(AssessmentStepType),
    ),
    sortOrder: faker.number.int({
      max: amount,
    }),
    title: {
      en: `${faker.lorem.word()} EN`,
      fr: `${faker.lorem.word()} FR`,
    },
    poolSkills: [],
  };
};

export default (numToGenerate?: number): AssessmentStep[] => {
  faker.seed(0); // repeatable results
  const amountToGenerate = numToGenerate || 20;
  return [...Array(amountToGenerate)].map(() =>
    generateAssessmentStep(amountToGenerate),
  );
};
