import { useIntl } from "react-intl";
import { ReactNode } from "react";

import { Link } from "@gc-digital-talent/ui";
import { getLocale } from "@gc-digital-talent/i18n";

const actLink = (locale: string, chunks: ReactNode) => {
  const href =
    locale === "en"
      ? "https://laws-lois.justice.gc.ca/eng/acts/e-5.401/"
      : "https://laws-lois.justice.gc.ca/fra/lois/e-5.401/";
  return (
    <Link external href={href} newTab color="black">
      {chunks}
    </Link>
  );
};
const reviewLink = (locale: string, chunks: ReactNode) => {
  const href =
    locale === "en"
      ? "https://www.canada.ca/en/employment-social-development/corporate/portfolio/labour/programs/employment-equity/task-force.html"
      : "https://www.canada.ca/fr/emploi-developpement-social/ministere/portefeuille/travail/programmes/equite-emploi/groupe-travail.html";
  return (
    <Link external href={href} newTab color="black">
      {chunks}
    </Link>
  );
};

const UnderReview = () => {
  const intl = useIntl();
  const locale = getLocale(intl);

  return (
    <p className="mb-6 font-bold">
      {intl.formatMessage(
        {
          defaultMessage:
            "The <actLink>Employment Equity Act</actLink> is currently <reviewLink>under review</reviewLink>.",
          id: "dcV5qH",
          description:
            "Text that appears in Employment equity dialogs explaining the act is under review.",
        },
        {
          actLink: (chunks: ReactNode) => actLink(locale, chunks),
          reviewLink: (chunks: ReactNode) => reviewLink(locale, chunks),
        },
      )}
    </p>
  );
};

export default UnderReview;
