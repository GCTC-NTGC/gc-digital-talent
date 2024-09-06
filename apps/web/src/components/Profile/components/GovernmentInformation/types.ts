import {
  User,
  Classification,
  GovEmployeeType,
  Maybe,
} from "@gc-digital-talent/graphql";

type PartialClassification = Pick<Classification, "group" | "level">;
export type PartialUser = Pick<
  User,
  | "isGovEmployee"
  | "hasPriorityEntitlement"
  | "priorityNumber"
  | "govEmployeeType"
  | "department"
  | "workEmail"
  | "isWorkEmailVerified"
> & {
  currentClassification?: Maybe<PartialClassification>;
};
export interface FormValues {
  govEmployeeYesNo?: "yes" | "no";
  govEmployeeType?: GovEmployeeType | null;
  lateralDeployBool?: boolean;
  department?: string;
  currentClassificationGroup?: string;
  currentClassificationLevel?: string;
  priorityEntitlementYesNo?: "yes" | "no";
  priorityEntitlementNumber?: string;
  workEmail?: Maybe<string>;
}
