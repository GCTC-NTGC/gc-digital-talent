import { empty } from "@gc-digital-talent/helpers";
import { User } from "@gc-digital-talent/graphql";

export type PartialUser = Pick<
  User,
  | "isGovEmployee"
  | "govEmployeeType"
  | "hasPriorityEntitlement"
  | "priorityNumber"
>;

export function hasAllEmptyFields({
  isGovEmployee,
  hasPriorityEntitlement,
}: PartialUser): boolean {
  return empty(isGovEmployee) && empty(hasPriorityEntitlement);
}

export function hasEmptyRequiredFields({
  isGovEmployee,
  hasPriorityEntitlement,
  priorityNumber,
}: PartialUser): boolean {
  return (
    empty(isGovEmployee) ||
    empty(hasPriorityEntitlement) ||
    (hasPriorityEntitlement && empty(priorityNumber))
  );
}
