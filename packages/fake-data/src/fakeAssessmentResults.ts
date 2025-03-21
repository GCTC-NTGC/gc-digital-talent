import { faker } from "@faker-js/faker/locale/en";

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

import toLocalizedEnum from "./fakeLocalizedEnum";

const generateAssessmentResult = (
  index: number,
  assessmentStep?: Maybe<AssessmentStep>,
  poolSkill?: Maybe<PoolSkill>,
): AssessmentResult => {
  faker.seed(index); // repeatable results

  return {
    id: faker.string.uuid(),
    assessmentStep,
    assessmentDecision: toLocalizedEnum(
      faker.helpers.arrayElement<AssessmentDecision>(
        Object.values(AssessmentDecision),
      ),
    ),
    assessmentDecisionLevel: toLocalizedEnum(
      faker.helpers.arrayElement<AssessmentDecisionLevel>(
        Object.values(AssessmentDecisionLevel),
      ),
    ),
    assessmentResultType: faker.helpers.arrayElement<AssessmentResultType>(
      Object.values(AssessmentResultType),
    ),
    justifications: faker.helpers
      .arrayElements<AssessmentResultJustification>(
        Object.values(AssessmentResultJustification),
      )
      .map((justification) => toLocalizedEnum(justification)),
    poolSkill,
    skillDecisionNotes: "skillDecisionNotes",
  };
};

export default (
  numToGenerate?: number,
  assessmentStep?: Maybe<AssessmentStep>,
  poolSkill?: Maybe<PoolSkill>,
): AssessmentResult[] => {
  return Array.from({ length: numToGenerate ?? 20 }, (_x, index) =>
    generateAssessmentResult(index, assessmentStep, poolSkill),
  );
};
