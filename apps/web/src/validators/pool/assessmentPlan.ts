import { parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { AssessmentStepType, Pool } from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";

export type AssessmentPlanStatus = "complete" | "incomplete" | "submitted";

type PartialPool = Pool;

export function deriveAssessmentPlanStatus(
  pool: PartialPool,
): AssessmentPlanStatus | null {
  if (!pool || !pool.poolSkills || !pool.assessmentSteps) return null;

  if (pool.publishedAt && parseDateTimeUtc(pool.publishedAt) > new Date())
    return "submitted";

  const allPoolSkillIds = pool.poolSkills
    .filter(notEmpty)
    .map((poolSkill) => poolSkill.id);
  const assessedPoolSkillIds = pool.assessmentSteps
    .filter(notEmpty)
    .flatMap(
      (step) =>
        step.poolSkills?.filter(notEmpty).map((poolSkill) => poolSkill.id),
    );
  const thereAreUnassessedPoolSkills = allPoolSkillIds.some(
    (poolSkillId) => !assessedPoolSkillIds.includes(poolSkillId),
  );

  // disregard screening question step for step validation
  const assessmentStepsWithoutScreeningQuestion = pool.assessmentSteps.filter(
    (step) => step?.type !== AssessmentStepType.ScreeningQuestionsAtApplication,
  );
  const thereAreAssessmentStepsWithNoSkills =
    assessmentStepsWithoutScreeningQuestion.some(
      (assessmentStep) => !assessmentStep?.poolSkills?.length,
    );

  if (!thereAreUnassessedPoolSkills && !thereAreAssessmentStepsWithNoSkills)
    return "complete";

  return "incomplete";
}
