import { IntlShape } from "react-intl";
import uniqBy from "lodash/uniqBy";

import { getLocalizedName } from "@gc-digital-talent/i18n";
import { Classification } from "@gc-digital-talent/graphql";

import { splitAndJoin } from "~/utils/nameUtils";

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
