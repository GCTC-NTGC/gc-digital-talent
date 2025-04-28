import {
  LocalizedTalentNominationGroupDecision,
  NominationGroupEvaluationFormFragment,
  TalentNominationGroupDecision,
  UpdateTalentNominationGroupInput,
} from "@gc-digital-talent/graphql";

export interface FormValues {
  advancementDecision: TalentNominationGroupDecision | null;
  advancementReferenceConfirmed: boolean | null;
  advancementApprovedNotes: string | null;
  advancementRejectedNotes: string | null;
  lateralMovementDecision: TalentNominationGroupDecision | null;
  lateralMovementApprovedNotes: string | null;
  lateralMovementRejectedNotes: string | null;
  developmentProgramsDecision: TalentNominationGroupDecision | null;
  developmentProgramsApprovedNotes: string | null;
  developmentProgramsRejectedNotes: string | null;
}

type Decision =
  | Pick<LocalizedTalentNominationGroupDecision, "value">
  | null
  | undefined;

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
function chooseValue(
  decision: TalentNominationGroupDecision | null,
  approvedValue: string | null,
  rejectedValue: string | null,
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
    lateralMovementDecision: queryData?.lateralMovementDecision?.value ?? null,
    lateralMovementApprovedNotes: ifApproved(
      queryData?.lateralMovementDecision,
      queryData?.lateralMovementNotes,
    ),
    lateralMovementRejectedNotes: ifRejected(
      queryData?.lateralMovementDecision,
      queryData?.lateralMovementNotes,
    ),
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
    lateralMovementDecision: formValues.lateralMovementDecision,
    lateralMovementNotes: chooseValue(
      formValues.lateralMovementDecision,
      formValues.lateralMovementApprovedNotes,
      formValues.lateralMovementRejectedNotes,
    ),
    developmentProgramsDecision: formValues.developmentProgramsDecision,
    developmentProgramsNotes: chooseValue(
      formValues.developmentProgramsDecision,
      formValues.developmentProgramsApprovedNotes,
      formValues.developmentProgramsRejectedNotes,
    ),
  };
}
