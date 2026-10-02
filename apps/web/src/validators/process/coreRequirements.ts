import type {
  LocalizedString,
  PoolLanguage,
  SecurityStatus,
} from "@gc-digital-talent/graphql";
import type { LocalizedEnumValue } from "@gc-digital-talent/i18n";

interface CoreRequirementsFields {
  language?: LocalizedEnumValue<PoolLanguage> | null;
  securityClearance?: LocalizedEnumValue<SecurityStatus> | null;
  location?: LocalizedString | null;
  isRemote?: boolean | null;
}

export function hasAllEmptyFields({
  language,
  securityClearance,
  location,
  isRemote,
}: CoreRequirementsFields): boolean {
  const hasLocation = isRemote || (location?.en && location.fr);
  return !!(!language && !securityClearance && !hasLocation);
}

export function hasEmptyRequiredFields({
  language,
  securityClearance,
  location,
  isRemote,
}: CoreRequirementsFields): boolean {
  const hasLocation = isRemote || (location?.en && location?.fr);
  return !!(!language || !securityClearance || !hasLocation);
}
