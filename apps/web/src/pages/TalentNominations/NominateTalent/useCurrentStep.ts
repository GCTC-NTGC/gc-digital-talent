import { useSearchParams } from "react-router";

import { TalentNominationStep } from "@gc-digital-talent/graphql";

const isValidStep = (step: string | null): step is TalentNominationStep => {
  if (!step) return false;
  return Object.values<string>(TalentNominationStep).includes(step);
};

const useCurrentStep = (): TalentNominationStep | null => {
  const [searchParams] = useSearchParams();
  const step = searchParams.get("step");

  return isValidStep(step) ? step : null;
};

export default useCurrentStep;
