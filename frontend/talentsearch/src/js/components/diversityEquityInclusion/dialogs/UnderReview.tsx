import React from "react";
import { useIntl } from "react-intl";
import { ExternalLink } from "@common/components/Link";

const actLink = (chunks: string[]) => (
  <ExternalLink href="https://laws-lois.justice.gc.ca/eng/acts/e-5.401/" newTab>
    {...chunks}
  </ExternalLink>
);
const reviewLink = (chunks: string[]) => (
  <ExternalLink
    href="https://www.canada.ca/en/employment-social-development/corporate/portfolio/labour/programs/employment-equity/task-force.html"
    newTab
  >
    {...chunks}
  </ExternalLink>
);

const UnderReview: React.FC = () => {
  const intl = useIntl();

  return (
    <p>
      {intl.formatMessage(
        {
          defaultMessage:
            "The <actLink>Employment Equity Act</actLink> is currently <reviewLink>under review</reviewLink>.",
          description:
            "Text that appears in Employment equity dialogs explaining the act is under review.",
        },
        {
          actLink,
          reviewLink,
        },
      )}
    </p>
  );
};

export default UnderReview;
