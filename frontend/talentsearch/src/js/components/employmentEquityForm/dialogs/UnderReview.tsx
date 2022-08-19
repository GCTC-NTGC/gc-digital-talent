import React from "react";
import { useIntl } from "react-intl";
import { ExternalLink } from "@common/components/Link";
import { getLocale } from "@common/helpers/localize";

const actLink = (locale: string, chunks: string[]) => {
  const href =
    locale === "en"
      ? "https://laws-lois.justice.gc.ca/eng/acts/e-5.401/"
      : "https://laws-lois.justice.gc.ca/fra/lois/e-5.401/";
  return (
    <ExternalLink href={href} newTab>
      {...chunks}
    </ExternalLink>
  );
};
const reviewLink = (locale: string, chunks: string[]) => {
  const href =
    locale === "en"
      ? "https://www.canada.ca/en/employment-social-development/corporate/portfolio/labour/programs/employment-equity/task-force.html"
      : "https://www.canada.ca/fr/emploi-developpement-social/ministere/portefeuille/travail/programmes/equite-emploi/groupe-travail.html";
  return (
    <ExternalLink href={href} newTab>
      {...chunks}
    </ExternalLink>
  );
};

const UnderReview: React.FC = () => {
  const intl = useIntl();
  const locale = getLocale(intl);

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
          actLink: (chunks) => actLink(locale, chunks),
          reviewLink: (chunks) => reviewLink(locale, chunks),
        },
      )}
    </p>
  );
};

export default UnderReview;
