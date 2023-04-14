import { Applicant } from "@gc-digital-talent/graphql";

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
  return isGovEmployee === null && hasPriorityEntitlement === null;
}

export function hasEmptyRequiredFields({
  isGovEmployee,
  hasPriorityEntitlement,
}: PartialApplicant): boolean {
  return isGovEmployee === null || hasPriorityEntitlement === null;
}

export function hasEmptyOptionalFields({
  hasPriorityEntitlement,
  priorityNumber,
}: PartialApplicant): boolean {
  return !!(hasPriorityEntitlement && !priorityNumber);
}
