import { Pool } from "@gc-digital-talent/graphql";

export function hasAllEmptyFields({
  language,
  securityClearance,
  location,
}: Pool): boolean {
  return !!(!language && !securityClearance && !location);
}

export function hasEmptyRequiredFields({
  language,
  securityClearance,
  location,
}: Pool): boolean {
  return !!(!language || !securityClearance || !location);
}
