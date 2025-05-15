import {
  PublishingGroup,
  LocalizedIndigenousCommunity,
  LocalizedPublishingGroup,
} from "@gc-digital-talent/graphql";

export interface PartialUser {
  isWoman?: boolean | null;
  hasDisability?: boolean | null;
  isVisibleMinority?: boolean | null;
  indigenousCommunities?: (LocalizedIndigenousCommunity | null)[] | null;
}

export function anyCriteriaSelected({
  isWoman,
  hasDisability,
  isVisibleMinority,
  indigenousCommunities,
}: PartialUser): boolean {
  return !!(
    isWoman ||
    isVisibleMinority ||
    hasDisability ||
    (indigenousCommunities && indigenousCommunities.length > 0)
  );
}

export function hasEmptyRequiredFields(
  applicant: PartialUser,
  pool?: {
    publishingGroup?: LocalizedPublishingGroup | null;
  } | null,
): boolean {
  if (!(pool?.publishingGroup?.value === PublishingGroup.Iap)) {
    return false;
  }
  return !(
    applicant.indigenousCommunities &&
    applicant.indigenousCommunities.length > 0
  );
}
