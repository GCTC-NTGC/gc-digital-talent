import type {
  ArmedForcesStatus,
  CitizenshipStatus,
  Maybe,
} from "@gc-digital-talent/graphql";

export interface FormValues {
  priorityEntitlementYesNo?: "yes" | "no";
  priorityEntitlementNumber?: string;
  armedForcesStatus?: Maybe<ArmedForcesStatus>;
  citizenship?: Maybe<CitizenshipStatus>;
}
