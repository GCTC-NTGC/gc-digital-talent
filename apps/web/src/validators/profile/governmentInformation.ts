import { empty } from "@gc-digital-talent/helpers";
import {
  LocalizedGovEmployeeType,
  Maybe,
  User,
} from "@gc-digital-talent/graphql";

export interface PartialUser
  extends Pick<
    User,
    "isGovEmployee" | "hasPriorityEntitlement" | "priorityNumber"
  > {
  govEmployeeType?: Maybe<Pick<LocalizedGovEmployeeType, "value">>;
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
