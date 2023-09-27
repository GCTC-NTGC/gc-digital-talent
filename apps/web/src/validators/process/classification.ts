import { Pool } from "@gc-digital-talent/graphql";
import { empty } from "@gc-digital-talent/helpers";

// eslint-disable-next-line import/prefer-default-export
export function hasAllEmptyFields({
  classifications,
  stream,
  name,
  processNumber,
  publishingGroup,
}: Pool): boolean {
  return !!(
    empty(classifications) &&
    !stream &&
    !name?.en &&
    !name?.fr &&
    !processNumber &&
    !publishingGroup
  );
}

export function hasEmptyRequiredFields({
  classifications,
  stream,
  name,
  processNumber,
  publishingGroup,
}: Pool): boolean {
  return !!(
    empty(classifications) ||
    !stream ||
    !name?.en ||
    !name?.fr ||
    !processNumber ||
    !publishingGroup
  );
}
