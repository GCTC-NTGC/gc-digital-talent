import { Pool } from "~/api/generated";

export function hasAllEmptyFields({
  language,
  securityClearance,
  location,
  isRemote,
}: Pool): boolean {
  const hasLocation = isRemote || (location?.en && location.fr);
  return !!(!language && !securityClearance && !hasLocation);
}

export function hasEmptyRequiredFields({
  language,
  securityClearance,
  location,
  isRemote,
}: Pool): boolean {
  const hasLocation = isRemote || location?.en || location?.fr;
  return !!(!language || !securityClearance || !hasLocation);
}
