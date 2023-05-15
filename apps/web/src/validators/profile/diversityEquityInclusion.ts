import {
  Applicant,
  Maybe,
  PoolAdvertisement,
  PublishingGroup,
} from "@gc-digital-talent/graphql";

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

export function hasEmptyRequiredFields(
  applicant: PartialApplicant,
  poolAdvertisement?: Maybe<PoolAdvertisement>,
): boolean {
  if (!(poolAdvertisement?.publishingGroup === PublishingGroup.Iap)) {
    return false;
  }
  return !(
    applicant.indigenousCommunities &&
    applicant.indigenousCommunities.length > 0
  );
}

export function hasEmptyOptionalFields(applicant: PartialApplicant): boolean {
  return !anyCriteriaSelected(applicant);
}

export function hasAllEmptyFields(applicant: PartialApplicant): boolean {
  return !anyCriteriaSelected(applicant);
}
