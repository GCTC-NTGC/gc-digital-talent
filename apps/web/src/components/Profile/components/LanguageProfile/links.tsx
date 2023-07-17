import React from "react";
import { IntlShape } from "react-intl";

import { Link } from "@gc-digital-talent/ui";
import { Locales, getLocale } from "@gc-digital-talent/i18n";

export const languageEvaluationPageLink = (intl: IntlShape) => {
  const locale = getLocale(intl);
  return (
    <Link
      newTab
      external
      href={
        locale === "en"
          ? "https://www.canada.ca/en/public-service-commission/services/second-language-testing-public-service.html"
          : "https://www.canada.ca/fr/commission-fonction-publique/services/evaluation-langue-seconde.html"
      }
    >
      {intl.formatMessage({
        defaultMessage: "Government of Canada language evaluation",
        id: "3vjhOA",
        description: "Message on links to the language evaluation tests",
      })}
    </Link>
  );
};

export const selfAssessmentLink = (msg: React.ReactNode, locale: Locales) => {
  return (
    <Link
      newTab
      external
      href={
        locale === "en"
          ? "https://www.canada.ca/en/public-service-commission/services/second-language-testing-public-service/self-assessment-tests.html"
          : "https://www.canada.ca/fr/commission-fonction-publique/services/evaluation-langue-seconde/tests-autoevaluation.html"
      }
    >
      {msg}
    </Link>
  );
};
