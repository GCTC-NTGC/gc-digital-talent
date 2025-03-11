import { useSearchParams } from "react-router";

import { TalentNominationStep } from "@gc-digital-talent/graphql";

export const stepOrder = [
  TalentNominationStep.Instructions,
  TalentNominationStep.NominatorInformation,
  TalentNominationStep.NomineeInformation,
  TalentNominationStep.NominationDetails,
  TalentNominationStep.Rationale,
  TalentNominationStep.ReviewAndSubmit,
];

const isValidStep = (step: string | null): step is TalentNominationStep => {
  if (!step) return false;
  return Object.values<string>(TalentNominationStep).includes(step);
};

interface UseCurrentStepReturn {
  index: number | null;
  current: TalentNominationStep | null;
  next: TalentNominationStep | null;
  prev: TalentNominationStep | null;
  isLastStep: boolean;
}

const useCurrentStep = (): UseCurrentStepReturn => {
  const [searchParams] = useSearchParams();
  const step = searchParams.get("step");

  if (!isValidStep(step)) {
    return {
      current: null,
      next: null,
      prev: null,
      isLastStep: false,
      index: null,
    };
  }

  const index = stepOrder.indexOf(step);
  const prevIndex = index - 1;
  let prev: TalentNominationStep | null = null;
  if (prevIndex in stepOrder) {
    prev = stepOrder[prevIndex];
  }

  const nextIndex = index + 1;
  let next: TalentNominationStep | null = null;
  if (nextIndex in stepOrder) {
    next = stepOrder[nextIndex];
  }

  return {
    index,
    current: step,
    next,
    prev,
    isLastStep: nextIndex >= stepOrder.length,
  };
};

export default useCurrentStep;
