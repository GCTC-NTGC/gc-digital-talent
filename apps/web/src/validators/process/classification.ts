import { Pool } from "@gc-digital-talent/graphql";

/*
  Checks null state for advertisement details section of edit pool page.
  Note: The pool.classification should not be null, therefore it doesn't need to checked
*/
export function isInNullState({
  stream,
  name,
  processNumber,
  publishingGroup,
}: Pool): boolean {
  return !!(
    !stream &&
    !name?.en &&
    !name?.fr &&
    !processNumber &&
    !publishingGroup &&
    !publishingGroup
  );
}

export function hasEmptyRequiredFields({
  classification,
  department,
  stream,
  name,
  processNumber,
  publishingGroup,
  opportunityLength,
}: Pool): boolean {
  return !!(
    !classification ||
    !department ||
    !stream ||
    !name?.en ||
    !name?.fr ||
    !processNumber ||
    !publishingGroup ||
    !opportunityLength
  );
}
