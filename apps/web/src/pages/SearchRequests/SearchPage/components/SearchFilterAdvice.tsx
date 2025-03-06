import { useIntl } from "react-intl";

import { LinkProps, ScrollToLink } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import { ApplicantFilterInput } from "@gc-digital-talent/graphql";

import talentRequestMessages from "~/messages/talentRequestMessages";

interface SearchFilterAdviceProps {
  filters: ApplicantFilterInput;
}

const SearchFilterAdvice = ({ filters }: SearchFilterAdviceProps) => {
  const intl = useIntl();

  const operationalRequirementFilterCount =
    filters?.operationalRequirements?.length ?? 0;
  const educationSelection = filters?.hasDiploma;
  const workingLanguage = filters?.languageAbility;
  const employmentDuration = filters?.positionDuration;
  const skillCount = filters?.skills?.length ?? 0;

  const activeEquityFilters = Object.values(filters?.equity ?? {})
    .filter(notEmpty)
    .filter((field) => !!field);
  const equityFiltersActive = activeEquityFilters.length;

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

  const linkProps: LinkProps = {
    color: "primary",
    mode: "inline",
  };

  const recommendations = [];
  if (operationalRequirementFilterCount > 0) {
    recommendations.push({
      key: "operationalRequirements",
      link: (
        <ScrollToLink to="operationalRequirementFilter" {...linkProps}>
          {intl.formatMessage(
            {
              defaultMessage:
                "Conditions of Employment ({operationalRequirementFilterCount})",
              id: "73m8PA",
              description: "Label for operational requirements filter link",
            },
            { operationalRequirementFilterCount },
          )}
        </ScrollToLink>
      ),
    });
  }

  if (educationSelection) {
    recommendations.push({
      key: "educationRequirementFilter",
      link: (
        <ScrollToLink to="educationRequirementFilter" {...linkProps}>
          {intl.formatMessage({
            defaultMessage: "Diploma required",
            description: "Diploma required",
            id: "w1/0Cd",
          })}
        </ScrollToLink>
      ),
    });
  }

  if (workingLanguage) {
    recommendations.push({
      key: "workingLanguageFilter",
      link: (
        <ScrollToLink to="workingLanguageFilter" {...linkProps}>
          {intl.formatMessage({
            defaultMessage: "Language ability",
            description: "Language ability",
            id: "mKzQwr",
          })}
        </ScrollToLink>
      ),
    });
  }

  if (employmentDuration) {
    recommendations.push({
      key: "employmentDurationFilter",
      link: (
        <ScrollToLink to="employmentDurationFilter" {...linkProps}>
          {intl.formatMessage(talentRequestMessages.employmentDuration)}
        </ScrollToLink>
      ),
    });
  }

  if (equityFiltersActive > 0) {
    recommendations.push({
      key: "employmentEquityFilter",
      link: (
        <ScrollToLink to="employmentEquityFilter" {...linkProps}>
          {intl.formatMessage(
            {
              defaultMessage: "Employment equity ({equityFiltersActive})",
              description: "Employment equity with a number in parentheses",
              id: "dE2WB1",
            },
            { equityFiltersActive },
          )}
        </ScrollToLink>
      ),
    });
  }

  if (skillCount > 0) {
    recommendations.push({
      key: "skillFilter",
      link: (
        <ScrollToLink to="skillFilter" {...linkProps}>
          {intl.formatMessage(
            {
              defaultMessage: "Skills selected ({skillCount})",
              description: "Skills selected and then a number in parentheses",
              id: "RNI+IH",
            },
            { skillCount },
          )}
        </ScrollToLink>
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
        // eslint-disable-next-line formatjs/no-literal-string-in-jsx
      })}{" "}
      {recommendations.map(({ key, link }, index) => (
        <span key={key}>
          {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
          {index > 0 && ", "}
          {link}
        </span>
      ))}
    </p>
  );
};

export default SearchFilterAdvice;
