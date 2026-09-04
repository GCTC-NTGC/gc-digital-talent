import type {
  NominationGroupEvaluationFormFragment,
  UpdateTalentNominationGroupInput,
} from "@gc-digital-talent/graphql";
import { TalentNominationGroupDecision } from "@gc-digital-talent/graphql";
import { uniqueItems, unpackMaybes } from "@gc-digital-talent/helpers";

export interface FormValues {
  advancementDecision: TalentNominationGroupDecision | null;
  advancementReferenceConfirmed: boolean | null;
  advancementApprovedNotes: string | null;
  advancementRejectedNotes: string | null;
  advancementClassifications: string[] | null;
  advancementReferralExpiryDate: string | null;
  lateralMovementDecision: TalentNominationGroupDecision | null;
  lateralMovementApprovedNotes: string | null;
  lateralMovementRejectedNotes: string | null;
  lateralMovementClassificationSubstantive: string | null;
  lateralMovementClassificationsAdditional: string[] | null;
  lateralMovementReferralExpiryDate: string | null;
  developmentProgramsDecision: TalentNominationGroupDecision | null;
  developmentProgramsApprovedNotes: string | null;
  developmentProgramsRejectedNotes: string | null;
}

type Decision =
  { value?: TalentNominationGroupDecision | null } | null | undefined;

// return the value if the decision is approved, or null otherwise
function ifApproved(decision: Decision, value: string | null | undefined) {
  const isApproved = decision?.value == TalentNominationGroupDecision.Approved;
  const maybeReturnValue = isApproved ? value : null;
  return maybeReturnValue ?? null;
}

// return the value if the decision is rejected, or null otherwise
function ifRejected(decision: Decision, value: string | null | undefined) {
  const isRejected = decision?.value == TalentNominationGroupDecision.Rejected;
  const maybeReturnValue = isRejected ? value : null;
  return maybeReturnValue ?? null;
}

// return the right value if the decision is approved or rejected
function chooseValue<T>(
  decision: TalentNominationGroupDecision | null,
  approvedValue: T | null,
  rejectedValue: T | null,
) {
  if (decision == TalentNominationGroupDecision.Approved) return approvedValue;
  if (decision == TalentNominationGroupDecision.Rejected) return rejectedValue;
  return null;
}

export function convertQueryDataToFormData(
  queryData: NominationGroupEvaluationFormFragment,
): FormValues {
  return {
    advancementDecision: queryData?.advancementDecision?.value ?? null,
    advancementReferenceConfirmed:
      queryData?.advancementReferenceConfirmed ?? null,
    advancementApprovedNotes: ifApproved(
      queryData?.advancementDecision,
      queryData?.advancementNotes,
    ),
    advancementRejectedNotes: ifRejected(
      queryData?.advancementDecision,
      queryData?.advancementNotes,
    ),
    advancementClassifications: unpackMaybes(
      queryData?.advancementClassifications,
    ).map(({ id }) => id),
    advancementReferralExpiryDate:
      queryData?.advancementReferralExpiryDate ?? null,
    lateralMovementDecision: queryData?.lateralMovementDecision?.value ?? null,
    lateralMovementApprovedNotes: ifApproved(
      queryData?.lateralMovementDecision,
      queryData?.lateralMovementNotes,
    ),
    lateralMovementRejectedNotes: ifRejected(
      queryData?.lateralMovementDecision,
      queryData?.lateralMovementNotes,
    ),
    lateralMovementClassificationSubstantive:
      queryData.nominee?.classification?.id ?? null,
    lateralMovementClassificationsAdditional: unpackMaybes(
      queryData?.lateralMovementClassifications,
    )
      .map(({ id }) => id)
      .filter((id) => id !== queryData.nominee?.classification?.id), // only want the additional classifications, the substantive is in the field above
    lateralMovementReferralExpiryDate:
      queryData?.lateralMovementReferralExpiryDate ?? null,
    developmentProgramsDecision:
      queryData?.developmentProgramsDecision?.value ?? null,
    developmentProgramsApprovedNotes: ifApproved(
      queryData?.developmentProgramsDecision,
      queryData?.developmentProgramsNotes,
    ),
    developmentProgramsRejectedNotes: ifRejected(
      queryData?.developmentProgramsDecision,
      queryData?.developmentProgramsNotes,
    ),
  };
}

export function convertFormValuesToMutationInput(
  formValues: FormValues,
): UpdateTalentNominationGroupInput {
  return {
    advancementDecision: formValues.advancementDecision,
    advancementReferenceConfirmed: formValues.advancementReferenceConfirmed,
    advancementNotes: chooseValue(
      formValues.advancementDecision,
      formValues.advancementApprovedNotes,
      formValues.advancementRejectedNotes,
    ),
    advancementClassifications: {
      sync: formValues.advancementClassifications,
    },
    advancementReferralExpiryDate:
      formValues.advancementReferralExpiryDate ?? null,
    lateralMovementDecision: formValues.lateralMovementDecision,
    lateralMovementNotes: chooseValue(
      formValues.lateralMovementDecision,
      formValues.lateralMovementApprovedNotes,
      formValues.lateralMovementRejectedNotes,
    ),
    lateralMovementClassifications: {
      sync: uniqueItems(
        unpackMaybes([
          // pack the substantive (if approved) and the additional classifications together
          formValues.lateralMovementDecision ==
          TalentNominationGroupDecision.Approved
            ? formValues.lateralMovementClassificationSubstantive
            : null,
          ...(formValues.lateralMovementClassificationsAdditional ?? []),
        ]),
      ),
    },
    lateralMovementReferralExpiryDate:
      formValues.lateralMovementReferralExpiryDate ?? null,
    developmentProgramsDecision: formValues.developmentProgramsDecision,
    developmentProgramsNotes: chooseValue(
      formValues.developmentProgramsDecision,
      formValues.developmentProgramsApprovedNotes,
      formValues.developmentProgramsRejectedNotes,
    ),
  };
}
