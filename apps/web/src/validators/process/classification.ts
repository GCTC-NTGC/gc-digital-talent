import { Pool } from "@gc-digital-talent/graphql";

/*
  Checks null state for advertisement details section of edit pool page.
  Note: The pool.classification should not be null, therefore it doesn't need to checked
*/
export function isInNullState({
  workStream,
  name,
  publishingGroup,
}: Pick<Pool, "workStream" | "name" | "publishingGroup">): boolean {
  return !!(
    !workStream &&
    !name?.en &&
    !name?.fr &&
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
  publishingGroup,
  opportunityLength,
}: Pick<
  Pool,
  | "areaOfSelection"
  | "classification"
  | "department"
  | "workStream"
  | "name"
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
    !publishingGroup ||
    !opportunityLength
  );
}
