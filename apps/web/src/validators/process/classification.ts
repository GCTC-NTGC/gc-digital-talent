import { empty } from "@gc-digital-talent/helpers";
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
  classifications,
  stream,
  name,
  processNumber,
  publishingGroup,
  opportunityLength,
}: Pool): boolean {
  return !!(
    empty(classifications) ||
    !stream ||
    !name?.en ||
    !name?.fr ||
    !processNumber ||
    !publishingGroup ||
    !opportunityLength
  );
}
