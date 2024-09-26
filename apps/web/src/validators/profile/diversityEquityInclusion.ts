import { User, Maybe, Pool, PublishingGroup } from "@gc-digital-talent/graphql";

export type PartialUser = Pick<
  User,
  "isWoman" | "hasDisability" | "isVisibleMinority" | "indigenousCommunities"
>;

export function anyCriteriaSelected({
  isWoman,
  hasDisability,
  isVisibleMinority,
  indigenousCommunities,
}: PartialUser): boolean {
  return !!(
    isWoman ??
    isVisibleMinority ??
    hasDisability ??
    (indigenousCommunities && indigenousCommunities.length > 0)
  );
}

export function hasEmptyRequiredFields(
  applicant: PartialUser,
  pool?: Maybe<Pick<Pool, "publishingGroup">>,
): boolean {
  if (!(pool?.publishingGroup?.value === PublishingGroup.Iap)) {
    return false;
  }
  return !(
    applicant.indigenousCommunities &&
    applicant.indigenousCommunities.length > 0
  );
}
