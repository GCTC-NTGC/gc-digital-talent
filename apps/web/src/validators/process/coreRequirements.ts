import { Pool } from "@gc-digital-talent/graphql";

export function hasAllEmptyFields({
  language,
  securityClearance,
  location,
  isRemote,
}: Pick<
  Pool,
  "language" | "securityClearance" | "location" | "isRemote"
>): boolean {
  const hasLocation = isRemote || (location?.en && location.fr);
  return !!(!language && !securityClearance && !hasLocation);
}

export function hasEmptyRequiredFields({
  language,
  securityClearance,
  location,
  isRemote,
}: Pick<
  Pool,
  "language" | "securityClearance" | "location" | "isRemote"
>): boolean {
  const hasLocation = isRemote || (location?.en && location?.fr);
  return !!(!language || !securityClearance || !hasLocation);
}
