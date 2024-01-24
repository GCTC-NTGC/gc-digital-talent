import { empty } from "@gc-digital-talent/helpers";

import { Pool } from "~/api/generated";

export function hasAllEmptyFields({
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
