import { useIntl } from "react-intl";
import { ReactNode } from "react";

import { Flourish, Heading, Link } from "@gc-digital-talent/ui";
import { Locales, getLocale } from "@gc-digital-talent/i18n";

import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";

const justiceLaws7Link = (locale: Locales, chunks: ReactNode) => (
  <Link
    newTab
    external
    href={
      locale === "en"
        ? "https://laws-lois.justice.gc.ca/eng/acts/F-11/section-7.html"
        : "https://laws-lois.justice.gc.ca/fra/lois/f-11/section-7.html"
    }
  >
    {chunks}
  </Link>
);
const justiceLaws15Link = (locale: Locales, chunks: ReactNode) => (
  <Link
    newTab
    external
    href={
      locale === "en"
        ? "https://laws-lois.justice.gc.ca/eng/acts/P-33.01/section-15.html"
        : "https://laws-lois.justice.gc.ca/fra/lois/P-33.01/section-15.html"
    }
  >
    {chunks}
  </Link>
);
const justiceLaws29Link = (locale: Locales, chunks: ReactNode) => (
  <Link
    newTab
    external
    href={
      locale === "en"
        ? "https://laws-lois.justice.gc.ca/eng/acts/P-33.01/section-29.html"
        : "https://laws-lois.justice.gc.ca/fra/lois/P-33.01/section-29.html"
    }
  >
    {chunks}
  </Link>
);

const justiceLaws30Link = (locale: Locales, chunks: ReactNode) => (
  <Link
    newTab
    external
    href={
      locale === "en"
        ? "https://laws-lois.justice.gc.ca/eng/acts/P-33.01/section-30.html"
        : "https://laws-lois.justice.gc.ca/fra/lois/p-33.01/section-30.html"
    }
  >
    {chunks}
  </Link>
);

const publicServiceLink = (locale: Locales, chunks: ReactNode) => (
  <Link
    newTab
    external
    href={
      locale === "en"
        ? "https://www.canada.ca/en/public-service-commission/services/oversight-activities/investigations.html"
        : "https://www.canada.ca/fr/commission-fonction-publique/services/activites-surveillance/enquetes.html"
    }
  >
    {chunks}
  </Link>
);

const personalInfoLink = (locale: Locales, chunks: ReactNode) => (
  <Link
    newTab
    external
    href={
      locale === "en"
        ? "https://www.canada.ca/en/treasury-board-secretariat/corporate/transparency/treasury-board-secretariat-sources-federal-government-employee-information-info-source.html"
        : "https://www.canada.ca/fr/secretariat-conseil-tresor/organisation/transparence/secretariat-conseil-tresor-sources-renseignements-gouvernement-federal-fonctionnaires-federaux-info-source.html"
    }
  >
    {chunks}
  </Link>
);

export const Component = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Privacy policy",
    id: "cYNDhP",
    description: "Title for the websites privacy policy",
  });

  const subtitle = intl.formatMessage({
    defaultMessage:
      "Learn more about how GC Digital Talent handles user privacy.",
    id: "Vz719J",
    description: "Sub title for the websites privacy policy",
  });

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: pageTitle,
        url: paths.privacyPolicy(),
      },
    ],
  });

  return (
    <>
      <Hero title={pageTitle} subtitle={subtitle} crumbs={crumbs} />
      <div data-h2-margin="base(x3)" data-h2-wrapper="base(center, small, x1)">
        <Heading size="h3" data-h2-margin="base(0, 0, x1, 0)">
          {pageTitle}
        </Heading>
        <p data-h2-margin="base(x1 0)">
          {intl.formatMessage(
            {
              defaultMessage:
                "Personal information collected through GC Digital Talent is used for staffing, external recruitment, training opportunities, and internal talent mobility within federal institutions pursuant to <justiceLaws7Link>section 7(1)</justiceLaws7Link> of the Financial Administration Act, <justiceLaws15Link>section 15(1)</justiceLaws15Link>, <justiceLaws29Link>section 29</justiceLaws29Link> and <justiceLaws30Link>30 (1), (2), and (3)</justiceLaws30Link> of the Public Service Employment Act and section 5 of the Employment Equity Act.",
              id: "EoGTKC",
              description: "Paragraph for privacy policy page",
            },
            {
              justiceLaws7Link: (chunks: ReactNode) =>
                justiceLaws7Link(locale, chunks),
              justiceLaws15Link: (chunks: ReactNode) =>
                justiceLaws15Link(locale, chunks),
              justiceLaws29Link: (chunks: ReactNode) =>
                justiceLaws29Link(locale, chunks),
              justiceLaws30Link: (chunks: ReactNode) =>
                justiceLaws30Link(locale, chunks),
            },
          )}
        </p>
        <p data-h2-margin="base(x1 0)">
          {intl.formatMessage({
            defaultMessage:
              "Please do not provide additional personal information which is not required for this purpose.",
            id: "zMa59V",
            description: "Paragraph for privacy policy page",
          })}
        </p>
        <p data-h2-margin="base(x1 0)">
          {intl.formatMessage(
            {
              defaultMessage:
                "The information you provide may also be used for statistical and research purposes, and may be disclosed to the <publicServiceLink>Public Service Commission Investigation Directorate</publicServiceLink> when necessary.",
              id: "4f9Xsc",
              description: "Paragraph for privacy policy page",
            },
            {
              publicServiceLink: (chunks: ReactNode) =>
                publicServiceLink(locale, chunks),
            },
          )}
        </p>
        <p data-h2-margin="base(x1 0)">
          {intl.formatMessage({
            defaultMessage:
              "Failure to provide personal information will result in your ineligibility for employment opportunities associated with this tool.",
            id: "Ijz5oe",
            description: "Paragraph for privacy policy page",
          })}
        </p>
        <p data-h2-margin="base(x1 0)">
          {intl.formatMessage({
            defaultMessage:
              "You have the right to the correction of, the access to, and protection of your personal information under the Privacy Act and the right to complain to the Privacy Commissioner of Canada about the handling of your personal information.",
            id: "7ejG4K",
            description: "Paragraph for privacy policy page",
          })}
        </p>
        <p data-h2-margin="base(x1 0)">
          {intl.formatMessage(
            {
              defaultMessage:
                "Personal information collected through GC Digital Talent is described by the <personalInfoLink>Talent Cloud Personal Information Bank (TBS PPU 095).</personalInfoLink>",
              id: "XYF/1P",
              description: "Paragraph for privacy policy page",
            },
            {
              personalInfoLink: (chunks: ReactNode) =>
                personalInfoLink(locale, chunks),
            },
          )}
        </p>
      </div>
      <Flourish />
    </>
  );
};

Component.displayName = "PrivacyPolicyPage";

export default Component;
