import { faker } from "@faker-js/faker";

import {
  PoolSkillType,
  AssessmentStep,
  AssessmentStepType,
  Maybe,
} from "@gc-digital-talent/graphql";

import fakeSkills from "./fakeSkills";

const generateAssessmentStep = (
  amount: number,
  type?: Maybe<AssessmentStepType>,
): AssessmentStep => {
  return {
    id: faker.string.uuid(),
    type:
      type ||
      faker.helpers.arrayElement<AssessmentStepType>(
        Object.values(AssessmentStepType),
      ),
    sortOrder: faker.number.int({
      max: amount,
    }),
    title: {
      en: `${faker.lorem.word()} EN`,
      fr: `${faker.lorem.word()} FR`,
    },
    poolSkills: [
      {
        id: faker.string.uuid(),
        type: faker.helpers.arrayElement<PoolSkillType>(
          Object.values(PoolSkillType),
        ),
        skill: fakeSkills(1)[0],
      },
    ],
  };
};

export default (
  numToGenerate?: number,
  type?: Maybe<AssessmentStepType>,
): AssessmentStep[] => {
  faker.seed(0); // repeatable results
  const amountToGenerate = numToGenerate || 20;
  return [...Array(amountToGenerate)].map(() =>
    generateAssessmentStep(amountToGenerate, type),
  );
};
