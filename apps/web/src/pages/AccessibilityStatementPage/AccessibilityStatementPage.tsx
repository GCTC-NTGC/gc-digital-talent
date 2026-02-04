import { useIntl } from "react-intl";
import { ReactNode } from "react";

import {
  Container,
  Flourish,
  Heading,
  Link,
  TableOfContents,
  Ul,
} from "@gc-digital-talent/ui";
import { getLocale, Locales } from "@gc-digital-talent/i18n";

import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import { wrapAbbr } from "~/utils/nameUtils";
import heroImg from "~/assets/img/accessibility-statement-header.webp";
import { TALENTSEARCH_SUPPORT_EMAIL } from "~/constants/talentSearchConstants";

const digitalStandardsLink = (locale: Locales, chunks: ReactNode) => (
  <Link
    newTab
    external
    href={
      locale === "en"
        ? "https://www.csps-efpc.gc.ca/tools/jobaids/digital-standards-eng.aspx"
        : "https://www.csps-efpc.gc.ca/tools/jobaids/digital-standards-fra.aspx"
    }
  >
    {chunks}
  </Link>
);

const wcagLink = (chunks: ReactNode) => (
  <Link newTab external hrefLang="en" href="https://www.w3.org/TR/WCAG21/">
    {chunks}
  </Link>
);

const atagLink = (chunks: ReactNode) => (
  <Link newTab external hrefLang="en" href="https://www.w3.org/TR/ATAG20/">
    {chunks}
  </Link>
);

const fableLink = (chunks: ReactNode) => (
  <Link newTab external hrefLang="en" href="https://makeitfable.com/">
    {chunks}
  </Link>
);

const acaLink = (locale: Locales, chunks: ReactNode) => (
  <Link
    newTab
    external
    href={
      locale === "en"
        ? "https://laws.justice.gc.ca/eng/acts/A-0.6/page-1.html"
        : "https://laws.justice.gc.ca/fra/lois/a-0.6/page-1.html"
    }
  >
    {chunks}
  </Link>
);

const acrLink = (locale: Locales, chunks: ReactNode): ReactNode => (
  <Link
    newTab
    external
    href={
      locale === "en"
        ? "https://laws-lois.justice.gc.ca/eng/regulations/SOR-2021-241/page-1.html"
        : "https://laws-lois.justice.gc.ca/fra/reglements/DORS-2021-241/page-1.html"
    }
  >
    {chunks}
  </Link>
);

const complaintsLink = (locale: Locales, chunks: ReactNode) => (
  <Link
    newTab
    external
    href={
      locale === "en"
        ? "https://www.chrc-ccdp.gc.ca/find-help/file-complaint-accessibility-commissioner"
        : "https://www.ccdp-chrc.gc.ca/trouver-aide/deposer-une-plainte-aupres-du-commissaire-a-accessibilite"
    }
  >
    {chunks}
  </Link>
);

const chrcLink = (locale: Locales, chunks: ReactNode) => (
  <Link
    newTab
    external
    href={
      locale === "en"
        ? "https://www.chrc-ccdp.gc.ca/make-a-complaint"
        : "https://www.ccdp-chrc.gc.ca/deposer-une-plainte"
    }
  >
    {chunks}
  </Link>
);

const chraLink = (locale: Locales, chunks: ReactNode) => (
  <Link
    newTab
    external
    href={
      locale === "en"
        ? "https://laws-lois.justice.gc.ca/eng/acts/h-6/FullText.html"
        : "https://laws-lois.justice.gc.ca/fra/lois/h-6/TexteComplet.html"
    }
  >
    {chunks}
  </Link>
);

const relationsLink = (locale: Locales, chunks: ReactNode) => (
  <Link
    newTab
    external
    href={
      locale === "en"
        ? "https://www.fpslreb-crtespf.gc.ca/en/index.html"
        : "https://www.fpslreb-crtespf.gc.ca/fr/index.html"
    }
  >
    {chunks}
  </Link>
);

const relayServiceLink = (locale: Locales, chunks: ReactNode) => (
  <Link
    newTab
    external
    href={
      locale === "en"
        ? "https://srvcanadavrs.ca/en/"
        : "https://srvcanadavrs.ca/fr/"
    }
  >
    {chunks}
  </Link>
);

const chrcMailLink = (chunks: ReactNode) => (
  <Link external href="mailto:Info.Com@chrc-ccdp.gc.ca">
    {chunks}
  </Link>
);

const phoneLink = (chunks: ReactNode) => (
  <Link external href="tel:6139951151">
    {chunks}
  </Link>
);

const tollFreeLink = (chunks: ReactNode) => (
  <Link external href="tel:18882141090">
    {chunks}
  </Link>
);

const supportMailLink = (chunks: ReactNode) => (
  <Link external href={`mailto:${TALENTSEARCH_SUPPORT_EMAIL}`}>
    {chunks}
  </Link>
);
interface Section {
  id: string;
  title: ReactNode;
}

export const Component = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Accessibility statement",
    id: "2iCpAL",
    description: "Title for the websites accessibility statement",
  });

  const sections: Section[] = [
    {
      id: "standards",
      title: intl.formatMessage({
        defaultMessage: "Our standards",
        id: "vC9NsS",
        description: "Title for the accessibility standards",
      }),
    },
    {
      id: "by-choice",
      title: intl.formatMessage({
        defaultMessage: "Accessible by choice and by design",
        id: "ztQSF+",
        description: "Title for the accessible by design section",
      }),
    },
    {
      id: "feedback",
      title: intl.formatMessage({
        defaultMessage: "Feedback and contact information",
        id: "6bvAQ+",
        description: "Title for the accessibility feedback section",
      }),
    },
    {
      id: "compliance",
      title: intl.formatMessage({
        defaultMessage: "Proactive compliance and enforcement framework",
        id: "quxa4Q",
        description: "Title for the compliance enforcement section.",
      }),
    },
  ];

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: pageTitle,
        url: paths.accessibility(),
      },
    ],
  });

  return (
    <>
      <Hero
        imgPath={heroImg}
        title={pageTitle}
        subtitle={intl.formatMessage({
          defaultMessage:
            "Our commitment to accessible design, development, and service delivery.",
          id: "FkwGWO",
          description: "Subtitle for the accessibility statement page.",
        })}
        crumbs={crumbs}
      />
      <Container>
        <TableOfContents.Wrapper className="mt-18">
          <TableOfContents.Navigation>
            <TableOfContents.List>
              {sections.map((section) => (
                <TableOfContents.ListItem key={section.id}>
                  <TableOfContents.AnchorLink id={section.id}>
                    {section.title}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
              ))}
            </TableOfContents.List>
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <p className="mb-6">
              {intl.formatMessage(
                {
                  id: "fzqya3",
                  defaultMessage:
                    "<abbreviation>GC</abbreviation> Digital Talent is committed to building an accessible and inclusive digital service. At the heart of our platform design and development is an endeavour to create equal employment opportunities for all. To us, building accessible services means meeting the needs of as many people as possible, including edge cases. We are working across all disciplines - research, development, design, and accessibility - to ensure our service is intentional, accessible, and inclusive.",
                  description: "Opening paragraph for accessibility statement",
                },
                {
                  abbreviation: (text: ReactNode) => wrapAbbr(text, intl),
                },
              )}
            </p>
            <TableOfContents.Section id={sections[0].id}>
              <TableOfContents.Heading size="h3" className="mt-18 mb-6">
                {sections[0].title}
              </TableOfContents.Heading>
              <p className="my-6">
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "The GC Digital Talent team follows inclusive <digitalStandardsLink>Government of Canada Digital Standards</digitalStandardsLink>.",
                    id: "tu2Z17",
                    description: "Paragraph describing accessibility standards",
                  },
                  {
                    digitalStandardsLink: (chunks: ReactNode) =>
                      digitalStandardsLink(locale, chunks),
                  },
                )}
              </p>
            </TableOfContents.Section>
            <TableOfContents.Section id={sections[1].id}>
              <TableOfContents.Heading size="h3" className="mt-18 mb-6">
                {sections[1].title}
              </TableOfContents.Heading>
              <p className="my-6">
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
              <Heading level="h3" size="h4" className="mt-18 mb-6 font-bold">
                {intl.formatMessage({
                  defaultMessage:
                    "Making our products accessible and usable for everyone",
                  id: "9n7ET2",
                  description:
                    "Heading for the items we consider for accessibility.",
                })}
              </Heading>
              <p className="mt-6 mb-3">
                {intl.formatMessage({
                  id: "ASYJlr",
                  defaultMessage:
                    "Our web application should adjust smoothly to various screen sizes and allow our users to access the platform on devices that meet their needs. Every feature we build needs to be accessible, but like making a great plate of nachos, you need the right ingredients to even get started. We start with these practical ingredients:",
                  description:
                    "Lead in text for list of items we consider for accessibility",
                })}
              </p>
              <Ul space="md">
                <li>
                  {intl.formatMessage({
                    defaultMessage: "our designers pay attention to:",
                    id: "hsD02j",
                    description:
                      "Intro to list of items designers consider for accessibility",
                  })}
                  <Ul space="sm">
                    <li>
                      {intl.formatMessage({
                        defaultMessage:
                          "designing accessible layouts and interactive elements",
                        id: "VsRBt5",
                        description:
                          "List item one, things designers consider for accessibility",
                      })}
                    </li>
                    <li>
                      {intl.formatMessage({
                        defaultMessage: "improving colour accessibility",
                        id: "OIa3Ii",
                        description:
                          "List item two, things designers consider for accessibility",
                      })}
                    </li>
                    <li>
                      {intl.formatMessage({
                        defaultMessage:
                          "building accessible features and tools, such as dark mode",
                        id: "rNmFAg",
                        description:
                          "List item three, things designers consider for accessibility",
                      })}
                    </li>
                    <li>
                      {intl.formatMessage({
                        defaultMessage:
                          "applying findings from user experience research",
                        id: "Xf4v0H",
                        description:
                          "List item four, things designers consider for accessibility",
                      })}
                    </li>
                  </Ul>
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage: "our developers pay attention to:",
                    id: "Gh1CF5",
                    description:
                      "Intro to list of items developers consider for accessibility",
                  })}
                  <Ul space="sm">
                    <li>
                      {intl.formatMessage(
                        {
                          defaultMessage:
                            "meeting <wcagLink>WCAG 2.1</wcagLink> requirements",
                          id: "ylP4yv",
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
                            "meeting <atagLink>Authoring Tools Accessibility Guidelines (ATAG) 2.0</atagLink> requirements, including:",
                          id: "wYWwe4",
                          description:
                            "List item two, things developers consider for accessibility",
                        },
                        {
                          atagLink,
                        },
                      )}
                      <Ul space="sm">
                        <li>
                          {intl.formatMessage({
                            defaultMessage:
                              "ensuring tools for publishing content on the platform are accessible",
                            id: "cGYqB+",
                            description:
                              "List item two, sub item one things developers consider for accessibility",
                          })}
                        </li>
                        <li>
                          {intl.formatMessage({
                            defaultMessage:
                              "adding safeguards to ensure published content is accessible",
                            id: "AbpMpF",
                            description:
                              "List item two, sub item two things developers consider for accessibility",
                          })}
                        </li>
                      </Ul>
                    </li>
                    <li>
                      {intl.formatMessage({
                        defaultMessage:
                          "conducting and reviewing automated accessibility testing, including:",
                        id: "5LTlSA",
                        description:
                          "List item three, things developers consider for accessibility",
                      })}
                      <Ul space="sm">
                        <li>
                          {intl.formatMessage({
                            defaultMessage:
                              "testing all new code with axe-core, a tool that flags common issues such as missing headings and alternative text for images",
                            id: "f6TtsZ",
                            description:
                              "List item three, sub item one things developers consider for accessibility",
                          })}
                        </li>
                        <li>
                          {intl.formatMessage({
                            defaultMessage:
                              "fixing all issues flagged by automatic testing before deploying to the platform",
                            id: "UE5Xw9",
                            description:
                              "List item three, sub item two things developers consider for accessibility",
                          })}
                        </li>
                      </Ul>
                    </li>
                    <li>
                      {intl.formatMessage({
                        defaultMessage:
                          "reviewing user acceptance test results",
                        id: "3zbSfP",
                        description:
                          "List item four, things developers consider for accessibility",
                      })}
                    </li>
                  </Ul>
                </li>
              </Ul>
              <Heading level="h3" size="h4" className="mt-18 mb-6 font-bold">
                {intl.formatMessage({
                  defaultMessage: "Testing with real users",
                  id: "7+GPYf",
                  description: "Heading for how we test accessibility.",
                })}
              </Heading>
              <p>
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "We work with <fableLink>Fable Tech Labs</fableLink> to get our products and features evaluated by users who require adaptive technologies to access the web. This is an important step to make sure our products work for real people.",
                    id: "sozTPf",
                    description:
                      "Text describing our user testing for accessibility",
                  },
                  { fableLink },
                )}
              </p>
            </TableOfContents.Section>
            <TableOfContents.Section id={sections[2].id}>
              <TableOfContents.Heading size="h3" className="mt-18 mb-6">
                {sections[2].title}
              </TableOfContents.Heading>
              <p className="my-3">
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "Despite all efforts to make our website fully accessible, if you encounter a problem we missed, or require a different format, we encourage you to contact us at <supportMailLink>{emailAddress}</supportMailLink>.",
                    id: "4Hyg4Y",
                    description:
                      "Lead in text for accessibility contact information",
                  },
                  {
                    supportMailLink,
                    emailAddress: TALENTSEARCH_SUPPORT_EMAIL,
                  },
                )}
              </p>
              <p className="my-3">
                {intl.formatMessage({
                  defaultMessage:
                    "We reply to inquiries within two business days.",
                  id: "5CFRjU",
                  description: "Disclaimer for support email response time",
                })}
              </p>
            </TableOfContents.Section>
            <TableOfContents.Section id={sections[3].id}>
              <TableOfContents.Heading size="h3" className="mt-18 mb-6">
                {sections[3].title}
              </TableOfContents.Heading>
              <p className="my-3">
                {intl.formatMessage(
                  {
                    id: "QBUhi7",
                    defaultMessage:
                      "The Accessibility Commissioner is responsible for enforcing the <acaLink>Accessible Canada Act</acaLink> and the <acrLink>Accessible Canada Regulations</acrLink> in the federal public service. They will also deal with certain <complaintsLink>accessibility complaints</complaintsLink>. The Accessibility Commissioner is a member of the Canadian Human Rights Commission (CHRC).",
                    description: "Text describing accessibility commissioner",
                  },
                  {
                    acaLink: (chunks: ReactNode) => acaLink(locale, chunks),
                    acrLink: (chunks: ReactNode) => acrLink(locale, chunks),
                    complaintsLink: (chunks: ReactNode) =>
                      complaintsLink(locale, chunks),
                  },
                )}
              </p>
              <p className="my-3">
                {intl.formatMessage({
                  defaultMessage:
                    "Not all complaints will go directly to the Accessibility Commissioner. There are some exceptions:",
                  id: "SXyhoR",
                  description:
                    "Disclaimer about accessibility complaint exceptions.",
                })}
              </p>
              <Ul space="md">
                <li>
                  {intl.formatMessage(
                    {
                      defaultMessage:
                        "The <chrcLink>Canadian Human Rights Commission</chrcLink> deals with discrimination complaints under the <chraLink>Canadian Human Rights Act</chraLink>",
                      id: "Mmz8u3",
                      description:
                        "Description of complaints to the Canadian Human Rights Commission",
                    },
                    {
                      chrcLink: (chunks: ReactNode) => chrcLink(locale, chunks),
                      chraLink: (chunks: ReactNode) => chraLink(locale, chunks),
                    },
                  )}
                </li>
                <li>
                  {intl.formatMessage(
                    {
                      defaultMessage:
                        "The <relationsLink>Federal Public Sector Labour Relations and Employment Board</relationsLink> deals with complaints from some federal public service employees, RCMP members and employees of Parliament",
                      id: "zesjuQ",
                      description:
                        "Description of complaints to the Federal Public Sector Labour Relations and Employment Board",
                    },
                    {
                      relationsLink: (chunks: ReactNode) =>
                        relationsLink(locale, chunks),
                    },
                  )}
                </li>
              </Ul>
              <p className="my-3">
                {intl.formatMessage({
                  defaultMessage:
                    "If you're not happy with how we respond to your complaint, contact the CHRC:",
                  id: "V3phA5",
                  description:
                    "Description of what to do if users are not content with complaint response",
                })}
              </p>
              <Ul space="md">
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
                        "<strong>VRS:</strong> CHRC accepts video relay service calls made through <relayServiceLink>Canada VRS</relayServiceLink>",
                      id: "qYUgTT",
                      description: "VRS contact info",
                    },
                    {
                      relayServiceLink: (chunks: ReactNode) =>
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
              </Ul>
              <p className="my-3">
                {intl.formatMessage({
                  defaultMessage:
                    "<strong>Hours:</strong> Monday to Friday, 8:00 a.m. to 8:00 p.m. (Eastern Time)",
                  id: "Q79qKT",
                  description: "Hours of operation info",
                })}
              </p>
              <p className="my-3">
                {intl.formatMessage({
                  defaultMessage:
                    "This statement was prepared on November 8, 2022, and updated on December 17, 2025.",
                  id: "CtCzeT",
                  description:
                    "Disclaimer for the when the accessibility statement was last updated",
                })}
              </p>
            </TableOfContents.Section>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </Container>
      <Flourish />
    </>
  );
};

Component.displayName = "AccessibilityStatementPage";

export default Component;
