import {
  type ArmedForcesStatus,
  type CitizenshipStatus,
  type Maybe,
} from "@gc-digital-talent/graphql";

export interface FormValues {
  priorityEntitlementYesNo?: "yes" | "no";
  priorityEntitlementNumber?: string;
  armedForcesStatus?: Maybe<ArmedForcesStatus>;
  citizenship?: Maybe<CitizenshipStatus>;
}
