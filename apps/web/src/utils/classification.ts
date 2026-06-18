import type { IntlShape } from "react-intl";
import uniqBy from "lodash/uniqBy";

import type { Classification } from "@gc-digital-talent/graphql";
import { getLocalizedName, localizeSalaryRange } from "@gc-digital-talent/i18n";

import { splitAndJoin } from "./nameUtils";

/**
 * Get the salary range of a classification
 * @param locale
 * @param classification
 * @returns
 */
export const getSalaryRange = (
  locale: string,
  classification?: Pick<Classification, "minSalary" | "maxSalary"> | null,
) => {
  if (!classification) return null;

  return localizeSalaryRange(
    classification.minSalary,
    classification.maxSalary,
    locale,
  );
};

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
        classification.group ??
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
