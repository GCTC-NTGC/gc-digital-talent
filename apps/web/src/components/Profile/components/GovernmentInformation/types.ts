import { User } from "@gc-digital-talent/graphql";
import { Classification, GovEmployeeType, Maybe } from "~/api/generated";

type PartialClassification = Pick<Classification, "group" | "level">;
export type PartialUser = Pick<
  User,
  | "isGovEmployee"
  | "hasPriorityEntitlement"
  | "priorityNumber"
  | "govEmployeeType"
  | "department"
> & {
  currentClassification?: Maybe<PartialClassification>;
};
export type FormValues = {
  govEmployeeYesNo?: "yes" | "no";
  govEmployeeType?: GovEmployeeType | null;
  lateralDeployBool?: boolean;
  department?: string;
  currentClassificationGroup?: string;
  currentClassificationLevel?: string;
  priorityEntitlementYesNo?: "yes" | "no";
  priorityEntitlementNumber?: string;
};
