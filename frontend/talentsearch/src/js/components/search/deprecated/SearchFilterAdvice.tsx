import React from "react";
import { useIntl } from "react-intl";
import { LanguageAbility, Maybe } from "talentsearch/src/js/api/generated";

const SearchFilterAdvice: React.FC<{
  cmoAssetFilterCount: number;
  operationalRequirementFilterCount: number;
  workingLanguage: Maybe<LanguageAbility>;
  educationFilter: Maybe<boolean>;
  equityFiltersActive: number;
}> = ({
  cmoAssetFilterCount,
  operationalRequirementFilterCount,
  workingLanguage,
  educationFilter,
  equityFiltersActive,
}) => {
  const intl = useIntl();
  if (
    cmoAssetFilterCount === 0 &&
    operationalRequirementFilterCount === 0 &&
    !educationFilter &&
    !workingLanguage &&
    equityFiltersActive === 0
  ) {
    return null;
  }

  const recommendations = [];
  if (operationalRequirementFilterCount > 0) {
    recommendations.push({
      key: "operationalRequirements",
      link: (
        <a
          href="#operationalRequirementFilter"
          data-h2-color="base(dt-primary)"
          data-h2-font-weight="base(700)"
        >
          {intl.formatMessage(
            {
              defaultMessage:
                "Conditions of Employment ({operationalRequirementFilterCount})",
              id: "ky585k",
            },
            { operationalRequirementFilterCount },
          )}
        </a>
      ),
    });
  }
  if (cmoAssetFilterCount > 0) {
    recommendations.push({
      key: "cmoAssets",
      link: (
        <a
          href="#cmoAssetFilter"
          data-h2-color="base(dt-primary)"
          data-h2-font-weight="base(700)"
        >
          {intl.formatMessage(
            {
              defaultMessage: "Skills Filters ({cmoAssetFilterCount})",
              id: "/DbKFl",
            },
            { cmoAssetFilterCount },
          )}
        </a>
      ),
    });
  }
  if (educationFilter) {
    recommendations.push({
      key: "educationRequirementFilter",
      link: (
        <a
          href="#educationRequirementFilter"
          data-h2-color="base(dt-primary)"
          data-h2-font-weight="base(700)"
        >
          {intl.formatMessage({
            defaultMessage: "Diploma required",
            description: "Diploma required",
            id: "w1/0Cd",
          })}
        </a>
      ),
    });
  }
  if (workingLanguage) {
    recommendations.push({
      key: "workingLanguageFilter",
      link: (
        <a
          href="#workingLanguageFilter"
          data-h2-color="base(dt-primary)"
          data-h2-font-weight="base(700)"
        >
          {intl.formatMessage({
            defaultMessage: "Language ability",
            description: "Language ability",
            id: "mKzQwr",
          })}
        </a>
      ),
    });
  }
  if (equityFiltersActive > 0) {
    recommendations.push({
      key: "employmentEquityFilter",
      link: (
        <a
          href="#employmentEquityFilter"
          data-h2-color="base(dt-primary)"
          data-h2-font-weight="base(700)"
        >
          {intl.formatMessage(
            {
              defaultMessage: "Employment equity ({equityFiltersActive})",
              description: "Employment equity with a number in parentheses",
              id: "dE2WB1",
            },
            { equityFiltersActive },
          )}
        </a>
      ),
    });
  }

  return (
    <p data-h2-margin="base(x1, 0)">
      {intl.formatMessage({
        defaultMessage:
          "To improve your results, try removing some of these filters:",
        id: "zDzzb/",
        description:
          "Heading for total matching candidates in results section of search page.",
      })}{" "}
      {recommendations.map(({ key, link }, index) => (
        <span key={key}>
          {index > 0 && ", "}
          {link}
        </span>
      ))}
    </p>
  );
};

export default SearchFilterAdvice;
