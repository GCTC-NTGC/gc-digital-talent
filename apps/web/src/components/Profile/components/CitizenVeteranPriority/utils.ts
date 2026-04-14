import type { IntlShape } from "react-intl";

import { boolToYesNo } from "@gc-digital-talent/helpers";
import type {
  ProfileCitizenVeteranPriorityFragment,
  UpdateUserAsUserInput,
  User,
} from "@gc-digital-talent/graphql";
import {
  ArmedForcesStatus,
  CitizenshipStatus,
} from "@gc-digital-talent/graphql";

import profileMessages from "~/messages/profileMessages";

import type { FormValues } from "./types";

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
    citizenship: values.citizenship,
    armedForcesStatus: values.armedForcesStatus,
  };
};

export const dataToFormValues = (
  data: ProfileCitizenVeteranPriorityFragment,
): FormValues => {
  return {
    priorityEntitlementYesNo: boolToYesNo(data?.hasPriorityEntitlement),
    priorityEntitlementNumber: data?.priorityNumber ?? undefined,
    citizenship: data?.citizenship?.value,
    armedForcesStatus: data?.armedForcesStatus?.value,
  };
};

export const getLabels = (intl: IntlShape) => ({
  priorityEntitlementYesNo: intl.formatMessage({
    defaultMessage: "Priority entitlements",
    id: "KwzVtv",
    description: "Label for the Priority Entitlement Status",
  }),
  priorityEntitlementNumber: intl.formatMessage({
    defaultMessage:
      "Priority number provided by the Public Service Commission of Canada",
    id: "5G+j56",
    description: "Label for priority number input",
  }),
  citizenship: intl.formatMessage({
    defaultMessage: "Citizenship status",
    id: "7DUfu+",
    description: "Legend text for citizenship status",
  }),
  armedForcesStatus: intl.formatMessage(profileMessages.veteranStatus),
});

export const citizenshipStatusesOrdered = [
  CitizenshipStatus.Citizen,
  CitizenshipStatus.PermanentResident,
  CitizenshipStatus.Other,
];

export const armedForcesStatusOrdered = [
  ArmedForcesStatus.NonCaf,
  ArmedForcesStatus.Member,
  ArmedForcesStatus.Veteran,
];
