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
}: Pick<
  Pool,
  "stream" | "name" | "processNumber" | "publishingGroup"
>): boolean {
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
  areaOfSelection,
  classification,
  department,
  stream,
  name,
  processNumber,
  publishingGroup,
  opportunityLength,
}: Pick<
  Pool,
  | "areaOfSelection"
  | "classification"
  | "department"
  | "stream"
  | "name"
  | "processNumber"
  | "publishingGroup"
  | "opportunityLength"
>): boolean {
  return !!(
    !areaOfSelection?.value ||
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
