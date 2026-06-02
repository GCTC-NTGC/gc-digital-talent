import type {
  User,
  Pool,
  LocalizedIndigenousCommunity,
} from "@gc-digital-talent/graphql";
import { PublishingGroup } from "@gc-digital-talent/graphql";

export interface PartialUser extends Pick<
  User,
  "isWoman" | "hasDisability" | "isVisibleMinority"
> {
  indigenousCommunities?:
    | (Pick<LocalizedIndigenousCommunity, "value"> | null | undefined)[]
    | null;
}

export function hasEmptyRequiredFields(
  applicant: PartialUser,
  pool?: Pick<Pool, "publishingGroup"> | null,
): boolean {
  if (!(pool?.publishingGroup?.value === PublishingGroup.Iap)) {
    return false;
  }
  return !(
    applicant.indigenousCommunities &&
    applicant.indigenousCommunities.length > 0
  );
}
