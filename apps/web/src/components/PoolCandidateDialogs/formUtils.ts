import { DisqualificationReason } from "@gc-digital-talent/graphql";

import { FormValues as JobPlacementFormValues } from "~/components/PoolCandidateDialogs/JobPlacementForm";

import { FormValues as FinalDecisionFormValues } from "./FinalDecisionForm";
import { FormValues as FinalDecisionAndPlaceFormValues } from "./FinalDecisionAndPlaceDialog";

export function formValuesToQualifyCandidateInput(
  formValues: FinalDecisionFormValues,
) {
  if (!formValues.expiryDate) {
    throw new Error("Missing expiry date");
  }

  return {
    poolCandidate: {
      expiryDate: formValues.expiryDate,
    },
  };
}

export function formValuesToDisqualifyCandidateInput(
  formValues: FinalDecisionFormValues,
) {
  if (!formValues.disqualifiedDecision) {
    throw new Error("Missing disqualification decision");
  }

  return {
    reason:
      formValues.disqualifiedDecision === "application"
        ? DisqualificationReason.ScreenedOutApplication
        : DisqualificationReason.ScreenedOutAssessment,
  };
}

export function formValuesToPlaceCandidateInput(
  formValues: JobPlacementFormValues,
) {
  if (!formValues.placementType) {
    throw new Error("Missing placement type");
  }
  if (formValues.placementType === "NOT_PLACED") {
    throw new Error("Invalid placement type");
  }
  return {
    poolCandidate: {
      departmentId: formValues.placedDepartment ?? "",
      placementType: formValues.placementType,
    },
  };
}

export function formValuesToQualifyAndPlaceCandidateInput(
  formValues: FinalDecisionAndPlaceFormValues,
) {
  if (!formValues.expiryDate) {
    throw new Error("Missing expiry date");
  }
  if (!formValues.placementType) {
    throw new Error("Missing placement type");
  }
  if (formValues.placementType === "NOT_PLACED") {
    throw new Error("Invalid placement type");
  }

  return {
    poolCandidate: {
      expiryDate: formValues.expiryDate,
      departmentId: formValues.placedDepartment ?? "",
      placementType: formValues.placementType,
    },
  };
}
