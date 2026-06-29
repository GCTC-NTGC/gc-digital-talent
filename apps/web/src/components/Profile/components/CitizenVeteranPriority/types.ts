import type {
  ArmedForcesStatus,
  CitizenshipStatus,
} from "@gc-digital-talent/graphql";

export interface FormValues {
  priorityEntitlementYesNo?: "yes" | "no";
  priorityEntitlementNumber?: string;
  armedForcesStatus?: ArmedForcesStatus | null;
  citizenship?: CitizenshipStatus | null;
}
