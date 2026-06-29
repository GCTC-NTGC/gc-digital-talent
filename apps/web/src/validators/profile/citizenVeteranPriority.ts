import { empty } from "@gc-digital-talent/helpers";
import type {
  LocalizedArmedForcesStatus,
  LocalizedCitizenshipStatus,
  User,
} from "@gc-digital-talent/graphql";

export type PartialUser = Pick<
  User,
  "hasPriorityEntitlement" | "priorityNumber"
> & {
  citizenship?: Pick<LocalizedCitizenshipStatus, "value"> | null;
  armedForcesStatus?: Pick<LocalizedArmedForcesStatus, "value"> | null;
};

export function hasAllEmptyFields({
  hasPriorityEntitlement,
  citizenship,
  armedForcesStatus,
}: PartialUser): boolean {
  return (
    empty(hasPriorityEntitlement) &&
    empty(citizenship) &&
    empty(armedForcesStatus)
  );
}

export function hasEmptyRequiredFields({
  hasPriorityEntitlement,
  priorityNumber,
  citizenship,
  armedForcesStatus,
}: PartialUser): boolean {
  return (
    empty(hasPriorityEntitlement) ||
    (hasPriorityEntitlement && empty(priorityNumber)) ||
    empty(citizenship) ||
    empty(armedForcesStatus)
  );
}
