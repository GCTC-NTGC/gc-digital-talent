/* eslint-disable import/prefer-default-export */
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { notEmpty } from "@gc-digital-talent/helpers";
import { AssessmentStepType, Pool } from "@gc-digital-talent/graphql";

import { PoolCompleteness } from "~/types/pool";

export function getAssessmentPlanStatus(pool: Pool): PoolCompleteness {
  if (!pool || !pool.poolSkills || !pool.assessmentSteps) {
    return "incomplete";
  }

  if (pool.publishedAt && new Date() > parseDateTimeUtc(pool.publishedAt)) {
    return "submitted";
  }

  const allPoolSkillIds = pool.poolSkills
    .filter(notEmpty)
    .map((poolSkill) => poolSkill.id);
  const assessedPoolSkillIds = pool.assessmentSteps
    .filter(notEmpty)
    .flatMap((step) =>
      step.poolSkills?.filter(notEmpty).map((poolSkill) => poolSkill.id),
    );
  const thereAreUnassessedPoolSkills = allPoolSkillIds.some(
    (poolSkillId) => !assessedPoolSkillIds.includes(poolSkillId),
  );

  // disregard screening questions and application screening step for step validation
  const assessmentStepsWithoutScreeningQuestion = pool.assessmentSteps.filter(
    (step) =>
      ![
        AssessmentStepType.ApplicationScreening,
        AssessmentStepType.ScreeningQuestionsAtApplication,
      ].includes(step?.type ?? AssessmentStepType.ApplicationScreening),
  );
  const thereAreAssessmentStepsWithNoSkills =
    assessmentStepsWithoutScreeningQuestion.some(
      (assessmentStep) => !assessmentStep?.poolSkills?.length,
    );

  if (!thereAreUnassessedPoolSkills && !thereAreAssessmentStepsWithNoSkills) {
    return "complete";
  }

  return "incomplete";
}
