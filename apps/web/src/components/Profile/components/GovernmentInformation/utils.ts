import { IntlShape } from "react-intl";
import uniqBy from "lodash/uniqBy";

import { boolToYesNo } from "@gc-digital-talent/helpers";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  Classification,
  GovEmployeeType,
  UpdateUserAsUserInput,
  User,
} from "@gc-digital-talent/graphql";

import { splitAndJoin } from "~/utils/nameUtils";

import { FormValues, PartialUser } from "./types";

/**
 * Take classification group + level from data, return the matching classification from API
 * need to fit to the expected type when this function is called in formToData
 *
 * @param group
 * @param level
 * @param classifications
 * @returns
 */
const classificationFormToId = (
  group: string | undefined,
  level: string | undefined,
  classifications: Pick<Classification, "group" | "level" | "id">[],
): string | undefined => {
  return classifications.find(
    (classification) =>
      classification.group === group && classification.level === Number(level),
  )?.id;
};

export const formValuesToSubmitData = (
  values: FormValues,
  userId: User["id"],
  classifications: Pick<Classification, "group" | "level" | "id">[],
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
      id: userId,
      isGovEmployee: false,
      govEmployeeType: null,
      department: { disconnect: true },
      currentClassification: {
        disconnect: true,
      },
      workEmail: null,
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
      id: userId,
      isGovEmployee: values.govEmployeeYesNo === "yes",
      govEmployeeType: values.govEmployeeType,
      department: values.department ? { connect: values.department } : null,
      currentClassification: {
        disconnect: true,
      },
      workEmail: values.workEmail,
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
      id: userId,
      isGovEmployee: values.govEmployeeYesNo === "yes",
      govEmployeeType: values.govEmployeeType,
      department: values.department ? { connect: values.department } : null,
      currentClassification: classificationId
        ? {
            connect: classificationId,
          }
        : null,
      workEmail: values.workEmail,
      hasPriorityEntitlement: values.priorityEntitlementYesNo === "yes",
      priorityNumber:
        values.priorityEntitlementYesNo === "yes" &&
        values.priorityEntitlementNumber
          ? values.priorityEntitlementNumber
          : null,
    };
  }
  return {
    id: userId,
    isGovEmployee: values.govEmployeeYesNo === "yes",
    govEmployeeType: values.govEmployeeType,
    department: values.department ? { connect: values.department } : null,
    currentClassification: classificationId
      ? {
          connect: classificationId,
        }
      : null,
    workEmail: values.workEmail,
    hasPriorityEntitlement: values.priorityEntitlementYesNo === "yes",
    priorityNumber:
      values.priorityEntitlementYesNo === "yes" &&
      values.priorityEntitlementNumber
        ? values.priorityEntitlementNumber
        : null,
  };
};

export const dataToFormValues = (data: PartialUser): FormValues => {
  return {
    govEmployeeYesNo: boolToYesNo(data?.isGovEmployee),
    priorityEntitlementYesNo: boolToYesNo(data?.hasPriorityEntitlement),
    priorityEntitlementNumber: data?.priorityNumber ?? undefined,
    govEmployeeType: data?.govEmployeeType?.value,
    lateralDeployBool: undefined,
    department: data?.department?.id,
    currentClassificationGroup: data?.currentClassification?.group,
    currentClassificationLevel: data?.currentClassification?.level
      ? String(data.currentClassification.level)
      : undefined,
    workEmail: data.workEmail,
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
  workEmail: intl.formatMessage(commonMessages.workEmail),
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

/**
 * Get classification group options
 */
export const getGroupOptions = (
  classifications: Pick<Classification, "group" | "name">[],
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
  classifications: Pick<Classification, "group" | "level">[],
  groupSelection?: Classification["group"],
) =>
  classifications
    .filter((x) => x.group === groupSelection)
    .map((iterator) => {
      return {
        value: iterator.level,
        label: iterator.level.toString(),
      };
    });
