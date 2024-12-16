import { Pool } from "@gc-digital-talent/graphql";

/*
  Checks null state for advertisement details section of edit pool page.
  Note: The pool.classification should not be null, therefore it doesn't need to checked
*/
export function isInNullState({
  workStream,
  name,
  processNumber,
  publishingGroup,
}: Pick<
  Pool,
  "workStream" | "name" | "processNumber" | "publishingGroup"
>): boolean {
  return !!(
    !workStream &&
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
  workStream,
  name,
  processNumber,
  publishingGroup,
  opportunityLength,
}: Pick<
  Pool,
  | "areaOfSelection"
  | "classification"
  | "department"
  | "workStream"
  | "name"
  | "processNumber"
  | "publishingGroup"
  | "opportunityLength"
>): boolean {
  return !!(
    !areaOfSelection?.value ||
    !classification ||
    !department ||
    !workStream ||
    !name?.en ||
    !name?.fr ||
    !processNumber ||
    !publishingGroup ||
    !opportunityLength
  );
}
