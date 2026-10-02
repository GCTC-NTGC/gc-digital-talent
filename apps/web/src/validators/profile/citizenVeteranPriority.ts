import { empty } from "@gc-digital-talent/helpers";
import type {
  ArmedForcesStatus,
  CitizenshipStatus,
} from "@gc-digital-talent/graphql";
import type { LocalizedEnumValue } from "@gc-digital-talent/i18n";

export interface PartialUser {
  hasPriorityEntitlement?: boolean | null;
  priorityNumber?: string | null;
  citizenship?: LocalizedEnumValue<CitizenshipStatus> | null;
  armedForcesStatus?: LocalizedEnumValue<ArmedForcesStatus> | null;
}

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
