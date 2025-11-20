import { empty } from "@gc-digital-talent/helpers";
import { User } from "@gc-digital-talent/graphql";

export type PartialUser = Pick<
  User,
  "hasPriorityEntitlement" | "priorityNumber"
>;

export function hasAllEmptyFields({
  hasPriorityEntitlement,
}: PartialUser): boolean {
  return empty(hasPriorityEntitlement);
}

export function hasEmptyRequiredFields({
  hasPriorityEntitlement,
  priorityNumber,
}: PartialUser): boolean {
  return (
    empty(hasPriorityEntitlement) ||
    (hasPriorityEntitlement && empty(priorityNumber))
  );
}
