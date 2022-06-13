import React from "react";
import { useIntl } from "react-intl";

const SearchFilterAdvice: React.FC<{
  classificationFilterCount: number;
  cmoAssetFilterCount: number;
  operationalRequirementFilterCount: number;
}> = ({
  classificationFilterCount,
  cmoAssetFilterCount,
  operationalRequirementFilterCount,
}) => {
  const intl = useIntl();
  if (
    classificationFilterCount === 0 &&
    cmoAssetFilterCount === 0 &&
    operationalRequirementFilterCount === 0
  ) {
    return null;
  }

  const recommendations = [];
  if (classificationFilterCount > 0) {
    recommendations.push({
      key: "classifications",
      link: (
        <a
          href="#classificationsFilter"
          data-h2-color="b(dt-primary)"
          data-h2-font-weight="b(700)"
        >
          {intl.formatMessage(
            {
              defaultMessage:
                "Classification Filters ({classificationFilterCount})",
            },
            { classificationFilterCount },
          )}
        </a>
      ),
    });
  }
  if (operationalRequirementFilterCount > 0) {
    recommendations.push({
      key: "operationalRequirements",
      link: (
        <a
          href="#operationalRequirementFilter"
          data-h2-color="b(dt-primary)"
          data-h2-font-weight="b(700)"
        >
          {intl.formatMessage(
            {
              defaultMessage:
                "Conditions of Employment ({operationalRequirementFilterCount})",
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
          data-h2-color="b(dt-primary)"
          data-h2-font-weight="b(700)"
        >
          {intl.formatMessage(
            {
              defaultMessage: "Skills Filters ({cmoAssetFilterCount})",
            },
            { cmoAssetFilterCount },
          )}
        </a>
      ),
    });
  }
  return (
    <p data-h2-font-size="b(caption)" data-h2-margin="b(x1, 0)">
      {intl.formatMessage({
        defaultMessage:
          "To improve your results, try removing some of these filters:",
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
