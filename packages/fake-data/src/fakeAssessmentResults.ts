import { faker } from "@faker-js/faker";

import {
  PoolSkill,
  AssessmentStep,
  Maybe,
  AssessmentResult,
  AssessmentDecision,
  AssessmentDecisionLevel,
  AssessmentResultType,
  AssessmentResultJustification,
} from "@gc-digital-talent/graphql";

const generateAssessmentResult = (
  amount: number,
  assessmentStep?: Maybe<AssessmentStep>,
  poolSkill?: Maybe<PoolSkill>,
): AssessmentResult => {
  return {
    id: faker.string.uuid(),
    assessmentStep,
    assessmentDecision: faker.helpers.arrayElement<AssessmentDecision>(
      Object.values(AssessmentDecision),
    ),
    assessmentDecisionLevel:
      faker.helpers.arrayElement<AssessmentDecisionLevel>(
        Object.values(AssessmentDecisionLevel),
      ),
    assessmentResultType: faker.helpers.arrayElement<AssessmentResultType>(
      Object.values(AssessmentResultType),
    ),
    justifications: faker.helpers.arrayElements<AssessmentResultJustification>(
      Object.values(AssessmentResultJustification),
    ),
    poolSkill,
    skillDecisionNotes: "skillDecisionNotes",
  };
};

export default (
  numToGenerate?: number,
  assessmentStep?: Maybe<AssessmentStep>,
  poolSkill?: Maybe<PoolSkill>,
): AssessmentResult[] => {
  faker.seed(0); // repeatable results
  const amountToGenerate = numToGenerate || 20;
  return [...Array(amountToGenerate)].map(() =>
    generateAssessmentResult(amountToGenerate, assessmentStep, poolSkill),
  );
};
