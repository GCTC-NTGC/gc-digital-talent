import { User } from "@gc-digital-talent/graphql";
import { empty } from "@gc-digital-talent/helpers";

type PartialUser = Pick<
  User,
  | "isGovEmployee"
  | "govEmployeeType"
  | "department"
  | "currentClassification"
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
}: PartialUser): boolean {
  return empty(isGovEmployee) || empty(hasPriorityEntitlement);
}

export function hasEmptyOptionalFields({
  hasPriorityEntitlement,
  priorityNumber,
}: PartialUser): boolean {
  return !!(hasPriorityEntitlement && !priorityNumber);
}
