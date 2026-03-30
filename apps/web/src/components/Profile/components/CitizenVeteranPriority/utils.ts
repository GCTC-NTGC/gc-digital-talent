import { IntlShape } from "react-intl";

import { boolToYesNo } from "@gc-digital-talent/helpers";
import {
  ProfilePriorityEntitlementsFragment,
  UpdateUserAsUserInput,
  User,
} from "@gc-digital-talent/graphql";

import { FormValues } from "./types";

export const formValuesToSubmitData = (
  values: FormValues,
  userId: User["id"],
): UpdateUserAsUserInput => {
  return {
    id: userId,
    hasPriorityEntitlement: values.priorityEntitlementYesNo === "yes",
    priorityNumber:
      values.priorityEntitlementYesNo === "yes" &&
      values.priorityEntitlementNumber
        ? values.priorityEntitlementNumber
        : null,
  };
};

export const dataToFormValues = (
  data: ProfilePriorityEntitlementsFragment,
): FormValues => {
  return {
    priorityEntitlementYesNo: boolToYesNo(data?.hasPriorityEntitlement),
    priorityEntitlementNumber: data?.priorityNumber ?? undefined,
  };
};

export const getLabels = (intl: IntlShape) => ({
  priorityEntitlementYesNo: intl.formatMessage({
    defaultMessage: "Do you have a priority entitlement?",
    id: "/h9mNu",
    description: "Priority Entitlement Status in Government Info Form",
  }),
  priorityEntitlementNumber: intl.formatMessage({
    defaultMessage:
      "Priority number provided by the Public Service Commission of Canada",
    id: "5G+j56",
    description: "Label for priority number input",
  }),
});
