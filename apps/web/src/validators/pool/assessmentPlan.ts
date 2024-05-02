/* eslint-disable import/prefer-default-export */
import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  AssessmentStepType,
  Pool,
  PoolSkillType,
} from "@gc-digital-talent/graphql";

import { PoolCompleteness } from "~/types/pool";

export function getAssessmentPlanStatus(pool: Pool): PoolCompleteness {
  if (!pool || !pool.poolSkills || !pool.assessmentSteps) {
    return "incomplete";
  }

  if (pool.publishedAt && new Date() > parseDateTimeUtc(pool.publishedAt)) {
    return "submitted";
  }

  const allEssentialPoolSkillIds = pool.poolSkills
    .filter(notEmpty)
    .filter((poolSkill) => poolSkill.type === PoolSkillType.Essential)
    .map((poolSkill) => poolSkill.id);
  const assessedPoolSkillIds = pool.assessmentSteps
    .filter(notEmpty)
    .flatMap((step) =>
      step.poolSkills?.filter(notEmpty).map((poolSkill) => poolSkill.id),
    );
  const thereAreUnassessedEssentialPoolSkills = allEssentialPoolSkillIds.some(
    (poolSkillId) => !assessedPoolSkillIds.includes(poolSkillId),
  );

  // disregard application screening step for step validation
  const assessmentStepsWithoutApplicationScreening =
    pool.assessmentSteps.filter(
      (step) => step?.type !== AssessmentStepType.ApplicationScreening,
    );
  const thereAreAssessmentStepsWithNoSkills =
    assessmentStepsWithoutApplicationScreening.some(
      (assessmentStep) => !assessmentStep?.poolSkills?.length,
    );

  if (
    !thereAreUnassessedEssentialPoolSkills &&
    !thereAreAssessmentStepsWithNoSkills
  ) {
    return "complete";
  }

  return "incomplete";
}
