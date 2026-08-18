import type { IndigenousCommunity } from "@gc-digital-talent/graphql";
import { PublishingGroup } from "@gc-digital-talent/graphql";
import type { GenericLocalizedEnum } from "@gc-digital-talent/i18n";

interface DiversityEquityInclusionPool {
  publishingGroup?: GenericLocalizedEnum<PublishingGroup> | null;
}

interface PartialIndigenousCommunity {
  value: IndigenousCommunity;
}

export interface PartialUser {
  isWoman?: boolean | null;
  hasDisability?: boolean | null;
  isVisibleMinority?: boolean | null;
  indigenousCommunities?:
    (PartialIndigenousCommunity | null | undefined)[] | null;
}

export function hasEmptyRequiredFields(
  applicant: PartialUser,
  pool?: DiversityEquityInclusionPool | null,
): boolean {
  if (!(pool?.publishingGroup?.value === PublishingGroup.Iap)) {
    return false;
  }
  return !(
    applicant.indigenousCommunities &&
    applicant.indigenousCommunities.length > 0
  );
}
