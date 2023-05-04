import { Applicant } from "@gc-digital-talent/graphql";
import { empty } from "@gc-digital-talent/helpers";

type PartialApplicant = Pick<
  Applicant,
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
}: PartialApplicant): boolean {
  return empty(isGovEmployee) && empty(hasPriorityEntitlement);
}

export function hasEmptyRequiredFields({
  isGovEmployee,
  hasPriorityEntitlement,
}: PartialApplicant): boolean {
  return empty(isGovEmployee) || empty(hasPriorityEntitlement);
}

export function hasEmptyOptionalFields({
  hasPriorityEntitlement,
  priorityNumber,
}: PartialApplicant): boolean {
  return !!(hasPriorityEntitlement && !priorityNumber);
}
