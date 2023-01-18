import React from "react";
import { useIntl } from "react-intl";

import Hero from "@common/components/Hero";
import Heading from "@common/components/Heading";
import { ExternalLink } from "@common/components/Link";
import imageUrl from "@common/helpers/imageUrl";
import { getLocale, Locales } from "@common/helpers/localize";

import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import useRoutes from "../../hooks/useRoutes";
import TALENTSEARCH_APP_DIR from "../../talentSearchConstants";

const digitalStandardsLink = (locale: Locales, chunks: React.ReactNode) => (
  <ExternalLink
    newTab
    href={
      locale === "en"
        ? "https://www.csps-efpc.gc.ca/tools/jobaids/digital-standards-eng.aspx"
        : "https://www.csps-efpc.gc.ca/tools/jobaids/digital-standards-fra.aspx"
    }
  >
    {chunks}
  </ExternalLink>
);

const wcagLink = (chunks: React.ReactNode) => (
  <ExternalLink newTab hrefLang="en" href="https://www.w3.org/TR/WCAG21/">
    {chunks}
  </ExternalLink>
);

const atagLink = (chunks: React.ReactNode) => (
  <ExternalLink newTab hrefLang="en" href="https://www.w3.org/TR/ATAG20/">
    {chunks}
  </ExternalLink>
);

const fableLink = (chunks: React.ReactNode) => (
  <ExternalLink newTab hrefLang="en" href="https://makeitfable.com/">
    {chunks}
  </ExternalLink>
);

const acaLink = (locale: Locales, chunks: React.ReactNode) => (
  <ExternalLink
    newTab
    href={
      locale === "en"
        ? "https://laws.justice.gc.ca/eng/acts/A-0.6/page-1.html"
        : "https://laws.justice.gc.ca/fra/lois/a-0.6/page-1.html"
    }
  >
    {chunks}
  </ExternalLink>
);

const acrLink = (locale: Locales, chunks: React.ReactNode): React.ReactNode => (
  <ExternalLink
    newTab
    href={
      locale === "en"
        ? "https://laws-lois.justice.gc.ca/eng/regulations/SOR-2021-241/page-1.html"
        : "https://laws-lois.justice.gc.ca/fra/reglements/DORS-2021-241/page-1.html"
    }
  >
    {chunks}
  </ExternalLink>
);

const complaintsLink = (locale: Locales, chunks: React.ReactNode) => (
  <ExternalLink
    newTab
    href={
      locale === "en"
        ? "https://www.accessibilitychrc.ca/en/complaints"
        : "https://www.accessibilitychrc.ca/fr/plaintes-0"
    }
  >
    {chunks}
  </ExternalLink>
);

const crtcLink = (locale: Locales, chunks: React.ReactNode) => (
  <ExternalLink
    newTab
    href={
      locale === "en"
        ? "https://applications.crtc.gc.ca/question/eng/public-inquiries-form?t=8&_ga=2.164713722.457525239.1621277191-2073149377.1618941793"
        : "https://applications.crtc.gc.ca/question/fra/formulaire-renseignements?t=8&_ga=2.164713722.457525239.1621277191-2073149377.1618941793"
    }
  >
    {chunks}
  </ExternalLink>
);

const crtcActLink = (locale: Locales, chunks: React.ReactNode) => (
  <ExternalLink
    newTab
    href={
      locale === "en"
        ? "https://laws-lois.justice.gc.ca/eng/acts/C-22/index.html"
        : "https://laws-lois.justice.gc.ca/fra/lois/c-22/index.html"
    }
  >
    {chunks}
  </ExternalLink>
);

const chrcLink = (locale: Locales, chunks: React.ReactNode) => (
  <ExternalLink
    newTab
    href={
      locale === "en"
        ? "https://www.chrc-ccdp.gc.ca/en/complaints/make-a-complaint"
        : "https://www.chrc-ccdp.gc.ca/fr/plaintes/deposer-une-plainte"
    }
  >
    {chunks}
  </ExternalLink>
);

const chraLink = (locale: Locales, chunks: React.ReactNode) => (
  <ExternalLink
    newTab
    href={
      locale === "en"
        ? "https://laws-lois.justice.gc.ca/eng/acts/h-6/FullText.html"
        : "https://laws-lois.justice.gc.ca/fra/lois/h-6/TexteComplet.html"
    }
  >
    {chunks}
  </ExternalLink>
);

const ctaLink = (locale: Locales, chunks: React.ReactNode) => (
  <ExternalLink
    newTab
    href={
      locale === "en"
        ? "https://otc-cta.gc.ca/eng/accessibility-complaints-about-transportation-services"
        : "https://otc-cta.gc.ca/fra/plaintes-relatives-a-laccessibilite-concernant-services-transport"
    }
  >
    {chunks}
  </ExternalLink>
);

const relationsLink = (locale: Locales, chunks: React.ReactNode) => (
  <ExternalLink
    newTab
    href={
      locale === "en"
        ? "https://www.fpslreb-crtespf.gc.ca/en/index.html"
        : "https://www.fpslreb-crtespf.gc.ca/fr/index.html"
    }
  >
    {chunks}
  </ExternalLink>
);

const relayServiceLink = (locale: Locales, chunks: React.ReactNode) => (
  <ExternalLink
    newTab
    href={
      locale === "en"
        ? "https://srvcanadavrs.ca/en/"
        : "https://srvcanadavrs.ca/fr/"
    }
  >
    {chunks}
  </ExternalLink>
);

const chrcMailLink = (chunks: React.ReactNode) => (
  <a href="mailto:Info.Com@chrc-ccdp.gc.ca">{chunks}</a>
);

const phoneLink = (chunks: React.ReactNode) => (
  <a href="tel:6139951151">{chunks}</a>
);

const tollFreeLink = (chunks: React.ReactNode) => (
  <a href="tel:18882141090">{chunks}</a>
);

const AccessibilityStatement = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Accessibility statement",
    id: "2iCpAL",
    description: "Title for the websites accessibility statement",
  });

  const crumbs = useBreadcrumbs([
    {
      label: pageTitle,
      url: paths.accessibility(),
    },
  ]);
  return (
    <>
      <Hero
        imgPath={imageUrl(
          TALENTSEARCH_APP_DIR,
          "accessibility-statement-header.jpg",
        )}
        title={pageTitle}
        subtitle={intl.formatMessage({
          defaultMessage:
            "Our commitment to accessible design, development, and service delivery.",
          id: "FkwGWO",
          description: "Subtitle for the accessibility statement page.",
        })}
        crumbs={crumbs}
      />
      <div
        data-h2-background-color="base(white) base:dark(black.light)"
        data-h2-color="base(black) base:dark(white)"
        data-h2-padding="base(x3, 0)"
      >
        <div
          data-h2-container="base(center, small, x1) p-tablet(center, small, x2)"
          data-h2-margin="base:children[p:not(:first-child), ul](x.5, 0, 0, 0)"
        >
          <p>
            {intl.formatMessage({
              id: "s2+FXu",
              defaultMessage:
                "GC Digital Talent  is committed to building an accessible and inclusive digital service. At the heart of our platform design and development is an endeavour to create equal employment opportunities for all. To us, building accessible services means meeting the needs of as many people as possible, including edge cases. We are working across all disciplines - research, development, design, and accessibility - to ensure our service is intentional, accessible, and inclusive.",
              description: "Opening paragraph for accessibility statement",
            })}
          </p>
          <Heading level="h2" size="h3" data-h2-margin="base(x2, 0, x1, 0)">
            {intl.formatMessage({
              defaultMessage: "Our standards",
              id: "vC9NsS",
              description: "Title for the accessibility standards",
            })}
          </Heading>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "The GC Digital Talent team follows inclusive <digitalStandardsLink>Government of Canada Digital Standards</digitalStandardsLink>.",
                id: "tu2Z17",
                description: "Paragraph describing accessibility standards",
              },
              {
                digitalStandardsLink: (chunks: React.ReactNode) =>
                  digitalStandardsLink(locale, chunks),
              },
            )}
          </p>
          <Heading level="h2" size="h3" data-h2-margin="base(x2, 0, x1, 0)">
            {intl.formatMessage({
              defaultMessage: "Accessible by choice and by design",
              id: "ztQSF+",
              description: "Title for the accessible by design section",
            })}
          </Heading>
          <p>
            {intl.formatMessage(
              {
                id: "5Cwvgi",
                defaultMessage:
                  "While <wcagLink>Web Content Accessibility Guidelines (WCAG) 2.1</wcagLink> AA standards set out a baseline for conformance, audits from real users allow us to deliver beyond the minimum requirements. Accessibility is considered at every stage of our product design and development cycle. We try to make sure everyone has a pleasant experience on our platform.",
                description:
                  "Paragraph describing accessibility at every level of development",
              },
              { wcagLink },
            )}
          </p>
          <p>
            {intl.formatMessage({
              id: "d8FGfc",
              defaultMessage:
                "<strong>Making our products accessible and usable by all.</strong> Our web application should adjust smoothly to various screen sizes and allow our users to access the platform on devices that meet their needs. Every feature we build needs to be accessible, but like making a great plate of nachos, you need the right ingredients to even get started. We start with these practical ingredients:",
              description:
                "Lead in text for list of items we consider for accessibility",
            })}
          </p>
          <ul>
            <li>
              {intl.formatMessage({
                defaultMessage: "Our designers pay attention to:",
                id: "Iodi0/",
                description:
                  "Intro to list of items designers consider for accessibility",
              })}
              <ul>
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "Designing accessible layouts and interactive elements",
                    id: "BFvwdM",
                    description:
                      "List item one, things designers consider for accessibility",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage: "Improving colour accessibility",
                    id: "tZmXOj",
                    description:
                      "List item two, things designers consider for accessibility",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "Building accessible features and tools like dark mode",
                    id: "NdvdT2",
                    description:
                      "List item three, things designers consider for accessibility",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage: "Optimizing UX research results",
                    id: "dAopan",
                    description:
                      "List item four, things designers consider for accessibility",
                  })}
                </li>
              </ul>
            </li>
            <li data-h2-margin="base(x.5, 0, 0, 0)">
              {intl.formatMessage({
                defaultMessage: "Our developers pay attention to:",
                id: "Wi4tia",
                description:
                  "Intro to list of items developers consider for accessibility",
              })}
              <ul>
                <li>
                  {intl.formatMessage(
                    {
                      defaultMessage:
                        "<wcagLink>WCAG 2.1</wcagLink> conformance",
                      id: "KXEuON",
                      description:
                        "List item one, things developers consider for accessibility",
                    },
                    { wcagLink },
                  )}
                </li>
                <li>
                  {intl.formatMessage(
                    {
                      defaultMessage:
                        "<atagLink>ATAG 2.0</atagLink> conformance",
                      id: "9LyLWf",
                      description:
                        "List item two, things developers consider for accessibility",
                    },
                    {
                      atagLink,
                    },
                  )}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage: "Automated accessibility test results",
                    id: "V9XmLH",
                    description:
                      "List item three, things developers consider for accessibility",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage: "User acceptance test results",
                    id: "bBz/OJ",
                    description:
                      "List item four, things developers consider for accessibility",
                  })}
                </li>
              </ul>
            </li>
          </ul>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "<strong>Testing with Real Users.</strong> Before we consider anything to be ready for release, we work with <fableLink>Fable Tech Labs</fableLink> to get our products and features evaluated by users who require adaptive technologies to access the web. This is an important step to make sure our products work for real people.",
                id: "HCWGjZ",
                description:
                  "Text describing our user testing for accessibility",
              },
              { fableLink },
            )}
          </p>
          <Heading level="h2" size="h3" data-h2-margin="base(x2, 0, x1, 0)">
            {intl.formatMessage({
              defaultMessage: "Feedback and contact information",
              id: "6bvAQ+",
              description: "Title for the accessibility feedback section",
            })}
          </Heading>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Despite all efforts to make our website fully accessible, if you encounter a problem we missed, or require a different format, we encourage you to contact us at:",
              id: "Txu5Yq",
              description: "Lead in text for accessibility contact information",
            })}
          </p>
          <p>
            <a href="mailto:gctalent-talentgc@support-soutien.gc.ca">
              gctalent-talentgc@support-soutien.gc.ca
            </a>
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "We try to reply to inquiries within five business days. We also welcome your feedback on our accessibility efforts.",
              id: "hTeiV1",
              description: "Disclaimer for support email response time",
            })}
          </p>
          <Heading level="h2" size="h3" data-h2-margin="base(x2, 0, x1, 0)">
            {intl.formatMessage({
              defaultMessage: "Proactive compliance and enforcement framework",
              id: "quxa4Q",
              description: "Title for the compliance enforcement section.",
            })}
          </Heading>
          <p>
            {intl.formatMessage(
              {
                id: "WSo3Y/",
                defaultMessage:
                  "The Accessibility Commissioner is responsible for enforcing the <acaLink>Accessible Canada Act</acaLink> and the <acrLink>Accessible Canada Regulations</acrLink>  in the federal public service. They will also deal with certain <complaintsLink>accessibility complaints</complaintsLink>. The Accessibility Commissioner is a member of the Canadian Human Rights Commission.",
                description: "Text describing accessibility commissioner",
              },
              {
                acaLink: (chunks: React.ReactNode) => acaLink(locale, chunks),
                acrLink: (chunks: React.ReactNode) => acrLink(locale, chunks),
                complaintsLink: (chunks: React.ReactNode) =>
                  complaintsLink(locale, chunks),
              },
            )}
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Not all complaints will go directly to the Accessibility Commissioner. There are some exceptions:",
              id: "SXyhoR",
              description:
                "Disclaimer about accessibility complaint exceptions.",
            })}
          </p>
          <ul>
            <li>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "The <crtcLink>Canadian Radio-television and Telecommunications Commission</crtcLink> (CRTC) deals with broadcasting and telecommunications provider complaints under the <crtcActLink>Canadian Radio-television and Telecommunications Commission Act</crtcActLink>",
                  id: "+G/4Zs",
                  description:
                    "Description of complaints to the Canadian Radio-television and Telecommunications Commission",
                },
                {
                  crtcLink: (chunks: React.ReactNode) =>
                    crtcLink(locale, chunks),
                  crtcActLink: (chunks: React.ReactNode) =>
                    crtcActLink(locale, chunks),
                },
              )}
            </li>
            <li>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "The <chrcLink>Canadian Human Rights Commission</chrcLink> (CHRC) deals with discrimination complaints under the <chraLink>Canadian Human Rights Act</chraLink>.",
                  id: "UoZLL/",
                  description:
                    "Description of complaints to the Canadian Human Rights Commission",
                },
                {
                  chrcLink: (chunks: React.ReactNode) =>
                    chrcLink(locale, chunks),
                  chraLink: (chunks: React.ReactNode) =>
                    chraLink(locale, chunks),
                },
              )}
            </li>
            <li>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "The <ctaLink>Canadian Transportation Agency</ctaLink> (CTA) deals with federal transportation complaints.",
                  id: "/fysAY",
                  description:
                    "Description of complaints to the Canadian Transportation Agency",
                },
                {
                  ctaLink: (chunks: React.ReactNode) => ctaLink(locale, chunks),
                },
              )}
            </li>
            <li>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "The <relationsLink>Federal Public Sector Labour Relations and Employment Board</relationsLink> deals with complaints from some federal public service employees, RCMP members and employees of Parliament.",
                  id: "ZgeBBn",
                  description:
                    "Description of complaints to the Federal Public Sector Labour Relations and Employment Board<",
                },
                {
                  relationsLink: (chunks: React.ReactNode) =>
                    relationsLink(locale, chunks),
                },
              )}
            </li>
          </ul>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "If you are not happy with how we respond to your complaint, reach out to the CHRC at the coordinates below:",
              id: "Zre7E9",
              description:
                "Description of what to do if users are not content with complaint response",
            })}
          </p>
          <ul data-h2-list-style="base(none)">
            <li>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "<strong>Phone:</strong> <phoneLink>613-995-1151</phoneLink>",
                  id: "OArzY6",
                  description: "Phone contact info",
                },
                { phoneLink },
              )}
            </li>
            <li>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "<strong>Toll free:</strong> <tollFreeLink>1-888-214-1090</tollFreeLink>",
                  id: "k29AEC",
                  description: "Toll free phone contact info",
                },
                { tollFreeLink },
              )}
            </li>
            <li>
              {intl.formatMessage({
                defaultMessage: "<strong>TTY:</strong> 1-888-643-3304",
                id: "G4fR8L",
                description: "TTY contact info",
              })}
            </li>
            <li>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "<strong>VRS:</strong> CHRC accepts video relay service calls made through <relayServiceLink>Canada VRS</relayServiceLink>.",
                  id: "8M2Tbu",
                  description: "VRS contact info",
                },
                {
                  relayServiceLink: (chunks: React.ReactNode) =>
                    relayServiceLink(locale, chunks),
                },
              )}
            </li>
            <li>
              {intl.formatMessage({
                defaultMessage: "<strong>Fax:</strong> 613-996-9661",
                id: "Yln61n",
                description: "Fax contact info",
              })}
            </li>
            <li>
              {intl.formatMessage({
                defaultMessage:
                  "<strong>Hours:</strong> Monday to Friday, 8:00 a.m. to 8:00 p.m. (Eastern Time)",
                id: "Q79qKT",
                description: "Hours of operation info",
              })}
            </li>
            <li>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "<strong>Email:</strong> <chrcMailLink>Info.Com@chrc-ccdp.gc.ca</chrcMailLink>",
                  id: "UJ/rX1",
                  description: "Email contact info",
                },
                { chrcMailLink },
              )}
            </li>
          </ul>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "This statement was prepared on November 8, 2022.",
              id: "om2bZu",
              description:
                "Disclaimer for the when the accessibility statement was last updated",
            })}
          </p>
        </div>
      </div>
      <div
        data-h2-background="base(tm-linear-divider)"
        data-h2-display="base(block)"
        data-h2-height="base(x1)"
      />
    </>
  );
};

export default AccessibilityStatement;
