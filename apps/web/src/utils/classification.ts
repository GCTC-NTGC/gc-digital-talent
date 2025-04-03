import { Classification, Maybe } from "@gc-digital-talent/graphql";
import { localizeSalaryRange } from "@gc-digital-talent/i18n";

/**
 * Get the salary range of a classification
 * @param locale
 * @param classification
 * @returns
 */
export const getSalaryRange = (
  locale: string,
  classification?: Maybe<Pick<Classification, "minSalary" | "maxSalary">>,
) => {
  if (!classification) return null;

  return localizeSalaryRange(
    classification.minSalary,
    classification.maxSalary,
    locale,
  );
};

/**
 * Convert group and level to string
 * @returns string
 * */
export const stringifyGroupLevel = (
  group?: string,
  level?: number,
): string | null => {
  if (!group || !level) return null;

  return `${group}-${String(level).padStart(2, "0")}`;
};
