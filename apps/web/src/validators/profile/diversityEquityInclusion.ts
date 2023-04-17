import { Applicant } from "@gc-digital-talent/graphql";

type PartialApplicant = Pick<
  Applicant,
  "isWoman" | "hasDisability" | "isVisibleMinority" | "indigenousCommunities"
>;

export function anyCriteriaSelected({
  isWoman,
  hasDisability,
  isVisibleMinority,
  indigenousCommunities,
}: PartialApplicant): boolean {
  return !!(
    isWoman ||
    isVisibleMinority ||
    hasDisability ||
    (indigenousCommunities && indigenousCommunities.length > 0)
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function hasEmptyRequiredFields(applicant: PartialApplicant): boolean {
  // no required fields for this section
  return false;
}

export function hasEmptyOptionalFields(applicant: PartialApplicant): boolean {
  return !anyCriteriaSelected(applicant);
}

export function hasAllEmptyFields(applicant: PartialApplicant): boolean {
  return !anyCriteriaSelected(applicant);
}
