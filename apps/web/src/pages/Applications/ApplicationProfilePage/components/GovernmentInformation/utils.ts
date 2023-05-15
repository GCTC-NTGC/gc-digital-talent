import { IntlShape } from "react-intl";
import uniqBy from "lodash/uniqBy";

import { empty } from "@gc-digital-talent/helpers";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import {
  Classification,
  GovEmployeeType,
  UpdateUserAsUserInput,
  User,
} from "~/api/generated";
import { splitAndJoin } from "~/utils/nameUtils";

import { FormValues } from "./types";

/**
 * Take classification group + level from data, return the matching classification from API
 * need to fit to the expected type when this function is called in formToData
 *
 * @param group
 * @param level
 * @param classifications
 * @returns
 */
export const classificationFormToId = (
  group: string | undefined,
  level: string | undefined,
  classifications: Classification[],
): string | undefined => {
  return classifications.find(
    (classification) =>
      classification.group === group && classification.level === Number(level),
  )?.id;
};

export const formValuesToSubmitData = (
  values: FormValues,
  classifications: Classification[],
): UpdateUserAsUserInput => {
  const classificationId = classificationFormToId(
    values.currentClassificationGroup,
    values.currentClassificationLevel,
    classifications,
  );

  // various IF statements are to clean up cases where user toggles the conditionally rendered stuff before submitting
  // IE, picks term position and IT-01, then picks not a government employee before submitting, the conditionally rendered stuff still exists and can get submitted
  if (values.govEmployeeYesNo === "no") {
    return {
      isGovEmployee: false,
      govEmployeeType: null,
      department: { disconnect: true },
      currentClassification: {
        disconnect: true,
      },
      hasPriorityEntitlement: values.priorityEntitlementYesNo === "yes",
      priorityNumber:
        values.priorityEntitlementYesNo === "yes" &&
        values.priorityEntitlementNumber
          ? values.priorityEntitlementNumber
          : null,
    };
  }
  if (values.govEmployeeType === GovEmployeeType.Student) {
    return {
      isGovEmployee: values.govEmployeeYesNo === "yes",
      govEmployeeType: values.govEmployeeType,
      department: values.department ? { connect: values.department } : null,
      currentClassification: {
        disconnect: true,
      },
      hasPriorityEntitlement: values.priorityEntitlementYesNo === "yes",
      priorityNumber:
        values.priorityEntitlementYesNo === "yes" &&
        values.priorityEntitlementNumber
          ? values.priorityEntitlementNumber
          : null,
    };
  }
  if (values.govEmployeeType === GovEmployeeType.Casual) {
    return {
      isGovEmployee: values.govEmployeeYesNo === "yes",
      govEmployeeType: values.govEmployeeType,
      department: values.department ? { connect: values.department } : null,
      currentClassification: classificationId
        ? {
            connect: classificationId,
          }
        : null,
      hasPriorityEntitlement: values.priorityEntitlementYesNo === "yes",
      priorityNumber:
        values.priorityEntitlementYesNo === "yes" &&
        values.priorityEntitlementNumber
          ? values.priorityEntitlementNumber
          : null,
    };
  }
  return {
    isGovEmployee: values.govEmployeeYesNo === "yes",
    govEmployeeType: values.govEmployeeType,
    department: values.department ? { connect: values.department } : null,
    currentClassification: classificationId
      ? {
          connect: classificationId,
        }
      : null,
    hasPriorityEntitlement: values.priorityEntitlementYesNo === "yes",
    priorityNumber:
      values.priorityEntitlementYesNo === "yes" &&
      values.priorityEntitlementNumber
        ? values.priorityEntitlementNumber
        : null,
  };
};

export const dataToFormValues = (data: User): FormValues => {
  const boolToYesNo = (
    bool: boolean | null | undefined,
  ): "yes" | "no" | undefined => {
    if (empty(bool)) {
      return undefined;
    }
    return bool ? "yes" : "no";
  };
  return {
    govEmployeeYesNo: boolToYesNo(data?.isGovEmployee),
    priorityEntitlementYesNo: boolToYesNo(data?.hasPriorityEntitlement),
    priorityEntitlementNumber: data?.priorityNumber
      ? data.priorityNumber
      : undefined,
    govEmployeeType: data?.govEmployeeType,
    lateralDeployBool: undefined,
    department: data?.department?.id,
    currentClassificationGroup: data?.currentClassification?.group,
    currentClassificationLevel: data?.currentClassification?.level
      ? String(data.currentClassification.level)
      : undefined,
  };
};

export const getLabels = (intl: IntlShape) => ({
  govEmployeeYesNo: intl.formatMessage({
    defaultMessage: "Do you currently work for the government of Canada?",
    id: "MtONBT",
    description: "Employee Status in Government Info Form",
  }),
  department: intl.formatMessage({
    defaultMessage: "Which department do you work for?",
    id: "NP/fsS",
    description: "Label for department select input in the request form",
  }),
  govEmployeeType: intl.formatMessage({
    defaultMessage: "As an employee, what is your employment status?",
    id: "3f9P13",
    description: "Employee Status in Government Info Form",
  }),
  currentClassificationGroup: intl.formatMessage({
    defaultMessage: "Current Classification Group",
    id: "/K1/1n",
    description: "Label displayed on classification group input",
  }),
  currentClassificationLevel: intl.formatMessage({
    defaultMessage: "Current Classification Level",
    id: "gnGAe8",
    description: "Label displayed on classification level input",
  }),
  priorityEntitlementYesNo: intl.formatMessage({
    defaultMessage: "Priority Entitlement",
    id: "FqXo5j",
    description: "Priority Entitlement Status in Government Info Form",
  }),
  priorityEntitlementNumber: intl.formatMessage({
    defaultMessage:
      "Priority number provided by the Public Service Commission of Canada",
    id: "5G+j56",
    description: "Label for priority number input",
  }),
});

/**
 * Get classification group options
 */
export const getGroupOptions = (
  classifications: Classification[],
  intl: IntlShape,
) => {
  const classGroupsWithDupes: {
    label: string;
    ariaLabel: string;
  }[] = classifications.map((classification) => {
    return {
      label:
        classification.group ||
        intl.formatMessage({
          defaultMessage: "Error: classification group not found.",
          id: "YA/7nb",
          description: "Error message if classification group is not defined.",
        }),
      ariaLabel: `${getLocalizedName(classification.name, intl)} ${splitAndJoin(
        classification.group,
      )}`,
    };
  });
  const noDupes = uniqBy(classGroupsWithDupes, "label");
  return noDupes.map(({ label, ariaLabel }) => {
    return {
      value: label,
      label,
      ariaLabel,
    };
  });
};

/**
 * Generate a level options based on the
 * currently selected group
 *
 * @param classifications
 * @param groupSelection
 * @returns
 */
export const getLevelOptions = (
  classifications: Classification[],
  groupSelection: Classification["group"],
) =>
  classifications
    .filter((x) => x.group === groupSelection)
    .map((iterator) => {
      return {
        value: iterator.level.toString(),
        label: iterator.level.toString(),
      };
    });
