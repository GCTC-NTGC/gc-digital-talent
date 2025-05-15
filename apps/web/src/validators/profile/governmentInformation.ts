import { empty } from "@gc-digital-talent/helpers";

export interface PartialUser {
  isGovEmployee?: boolean | null;
  hasPriorityEntitlement?: boolean | null;
  priorityNumber?: string | null;
}

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
