import {
  NominationGroupEvaluationDialog_QueryQuery,
  NominationGroupEvaluationFormFragment,
  TalentNominationGroupDecision,
} from "@gc-digital-talent/graphql";

export interface FormValues {
  advancementDecision: TalentNominationGroupDecision | null;
  advancementReferenceConfirmed: boolean | null;
  advancementNotes: string | null;
  lateralMovementDecision: TalentNominationGroupDecision | null;
  lateralMovementNotes: string | null;
  developmentProgramsDecision: TalentNominationGroupDecision | null;
  developmentProgramsNotes: string | null;
}

export function convertApiDataToFormData(
  apiData: NominationGroupEvaluationFormFragment,
): FormValues {
  return {
    advancementDecision: apiData?.advancementDecision?.value ?? null,
    advancementReferenceConfirmed:
      apiData?.advancementReferenceConfirmed ?? null,
    advancementNotes: apiData?.advancementNotes ?? null,
    lateralMovementDecision: apiData?.lateralMovementDecision?.value ?? null,
    lateralMovementNotes: apiData?.lateralMovementNotes ?? null,
    developmentProgramsDecision:
      apiData?.developmentProgramsDecision?.value ?? null,
    developmentProgramsNotes: apiData?.developmentProgramsNotes ?? null,
  };
}
