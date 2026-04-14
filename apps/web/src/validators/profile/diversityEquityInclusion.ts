import type {
  User,
  Maybe,
  Pool,
  LocalizedIndigenousCommunity,
} from "@gc-digital-talent/graphql";
import { PublishingGroup } from "@gc-digital-talent/graphql";

export interface PartialUser extends Pick<
  User,
  "isWoman" | "hasDisability" | "isVisibleMinority"
> {
  indigenousCommunities?: Maybe<
    Maybe<Pick<LocalizedIndigenousCommunity, "value">>[]
  >;
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
