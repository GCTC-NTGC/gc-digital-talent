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
