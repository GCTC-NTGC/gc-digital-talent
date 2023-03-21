import React from "react";
import { useIntl } from "react-intl";

import { LanguageAbility, Maybe, PositionDuration } from "~/api/generated";

const SearchFilterAdvice = ({
  operationalRequirementFilterCount,
  educationSelection,
  workingLanguage,
  employmentDuration,
  equityFiltersActive,
  skillCount,
}: {
  operationalRequirementFilterCount: number;
  educationSelection: Maybe<boolean>;
  workingLanguage: Maybe<LanguageAbility>;
  employmentDuration: Maybe<Maybe<PositionDuration>[]>;
  equityFiltersActive: number;
  skillCount: number;
}) => {
  const intl = useIntl();
  if (
    operationalRequirementFilterCount === 0 &&
    !educationSelection &&
    !workingLanguage &&
    !employmentDuration &&
    equityFiltersActive === 0 &&
    skillCount === 0
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
          data-h2-color="base(primary)"
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

  if (educationSelection) {
    recommendations.push({
      key: "educationRequirementFilter",
      link: (
        <a
          href="#educationRequirementFilter"
          data-h2-color="base(primary)"
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
          data-h2-color="base(primary)"
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

  if (employmentDuration) {
    recommendations.push({
      key: "employmentDurationFilter",
      link: (
        <a
          href="#employmentDurationFilter"
          data-h2-color="base(primary)"
          data-h2-font-weight="base(700)"
        >
          {intl.formatMessage({
            defaultMessage: "Employment duration",
            description: "Employment duration",
            id: "hRe0yl",
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
          data-h2-color="base(primary)"
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

  if (skillCount > 0) {
    recommendations.push({
      key: "skillFilter",
      link: (
        <a
          href="#skillFilter"
          data-h2-color="base(primary)"
          data-h2-font-weight="base(700)"
        >
          {intl.formatMessage(
            {
              defaultMessage: "Skills selected ({skillCount})",
              description: "Skills selected and then a number in parentheses",
              id: "RNI+IH",
            },
            { skillCount },
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
