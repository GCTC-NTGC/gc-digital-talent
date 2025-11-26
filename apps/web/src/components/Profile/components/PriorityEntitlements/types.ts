import { User } from "@gc-digital-talent/graphql";

export type PartialUser = Pick<
  User,
  "hasPriorityEntitlement" | "priorityNumber"
>;
export interface FormValues {
  priorityEntitlementYesNo?: "yes" | "no";
  priorityEntitlementNumber?: string;
}
