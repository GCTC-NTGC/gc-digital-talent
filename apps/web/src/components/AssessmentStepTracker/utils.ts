import {
  AssessmentStep,
  Pool,
  PoolCandidate,
} from "@gc-digital-talent/graphql";
import { notEmpty } from "@gc-digital-talent/helpers";

export type CandidatesByStep = {
  step: AssessmentStep;
  candidates: PoolCandidate[];
};

export const groupPoolCandidatesByStep = (pool: Pool): CandidatesByStep[] => {
  const steps =
    pool.assessmentSteps
      ?.sort((stepA, stepB) => {
        return (stepA?.sortOrder ?? 0) - (stepB?.sortOrder ?? 0);
      })
      .filter(notEmpty) ?? [];

  let groupedCandidates: CandidatesByStep[] = [];
  let availableCandidates: PoolCandidate[] =
    pool.poolCandidates?.filter(notEmpty) ?? [];

  steps.forEach((step) => {
    const candidatesInStep = availableCandidates.filter((candidate) => {
      return candidate.assessmentResults?.some(
        (result) => result?.assessmentStep?.id === step.id,
      );
    });

    groupedCandidates = [
      ...groupedCandidates,
      {
        step,
        candidates: candidatesInStep,
      },
    ];

    // Remove candidates from available array
    availableCandidates = availableCandidates.filter((available) =>
      candidatesInStep.some(
        (candidateInStep) => candidateInStep.id === available.id,
      ),
    );
  });

  return groupedCandidates.sort((groupA, groupB) => {
    return (groupB.step.sortOrder ?? 0) - (groupA.step.sortOrder ?? 0);
  });
};
