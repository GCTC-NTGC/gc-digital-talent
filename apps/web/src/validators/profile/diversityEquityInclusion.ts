import type { IndigenousCommunity } from "@gc-digital-talent/graphql";
import type { LocalizedEnumValue } from "@gc-digital-talent/i18n";

export interface PartialUser {
  isWoman?: boolean | null;
  hasDisability?: boolean | null;
  isVisibleMinority?: boolean | null;
  indigenousCommunities?:
    (LocalizedEnumValue<IndigenousCommunity> | null | undefined)[] | null;
}

export function hasEmptyRequiredFields(): boolean {
  return false;
}
