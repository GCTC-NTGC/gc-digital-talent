import { defineMessage, useIntl } from "react-intl";
import MapIcon from "@heroicons/react/24/outline/MapIcon";
import ChartPieIcon from "@heroicons/react/24/outline/ChartPieIcon";
import NewspaperIcon from "@heroicons/react/24/outline/NewspaperIcon";
import MagnifyingGlassCircleIcon from "@heroicons/react/24/outline/MagnifyingGlassCircleIcon";
import BookmarkSquareIcon from "@heroicons/react/24/outline/BookmarkSquareIcon";
import { ReactNode } from "react";
import Cog8ToothIcon from "@heroicons/react/24/outline/Cog8ToothIcon";

import {
  Heading,
  Link,
  Accordion,
  CardFlat,
  Alert,
  Card,
  ScrollToLink,
} from "@gc-digital-talent/ui";
import {
  Locales,
  navigationMessages,
  getLocale,
} from "@gc-digital-talent/i18n";

import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";

import Resources from "./Resources";

const sectionIds = {
  changes: "changes",
} as const;

const policyLink = (locale: Locales, chunks: ReactNode) => (
  <Link
    newTab
    external
    href={
      locale === "en"
        ? "https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=32603"
        : "https://www.tbs-sct.canada.ca/pol/doc-fra.aspx?id=32603"
    }
  >
    {chunks}
  </Link>
);

const procurementLink = (locale: Locales, chunks: ReactNode) => (
  <Link
    newTab
    external
    href={
      locale === "en"
        ? "https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=32692&section=procedure&p=F"
        : "https://www.tbs-sct.canada.ca/pol/doc-fra.aspx?id=32692"
    }
  >
    {chunks}
  </Link>
);

const talentSearchLink = (localizedLink: string, chunks: ReactNode) => (
  <Link newTab external href={localizedLink}>
    {chunks}
  </Link>
);

const recentChangesLink = (chunks: ReactNode) => (
  <ScrollToLink to={sectionIds.changes}>{chunks}</ScrollToLink>
);

export const pageTitle = defineMessage({
  defaultMessage: "Directive on Digital Talent",
  id: "xXwUGs",
  description: "Title for the digital talent directive page",
});

export const pageSubtitle = defineMessage({
  defaultMessage:
    "Learn more about how the Government of Canada is strengthening the talent base of the GC digital community.",
  id: "c/u1K+",
  description: "Subtitle for the digital talent directive page",
});

export const Component = () => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitle),
        url: paths.directive(),
      },
    ],
  });

  const directiveUrl =
    locale === "en"
      ? "https://www.tbs-sct.gc.ca/pol/doc-eng.aspx?id=32749"
      : "https://www.tbs-sct.gc.ca/pol/doc-fra.aspx?id=32749";

  const readDirectiveMessage = intl.formatMessage({
    defaultMessage: "Read the Directive",
    id: "RDAVsP",
    description: "Link text to read the entire directive.",
  });

  return (
    <>
      <SEO
        title={intl.formatMessage(pageTitle)}
        description={intl.formatMessage(pageSubtitle)}
      />
      <Hero
        title={intl.formatMessage(pageTitle)}
        subtitle={intl.formatMessage(pageSubtitle)}
        crumbs={crumbs}
        buttonLinks={[
          {
            icon: NewspaperIcon,
            text: readDirectiveMessage,
            url: directiveUrl,
            color: "warning",
          },
          {
            icon: MagnifyingGlassCircleIcon,
            text: intl.formatMessage(navigationMessages.findTalent),
            url: paths.search(),
            color: "primary",
          },
        ]}
      />
      <div data-h2-padding="base(x3, 0)">
        <div
          data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)"
          data-h2-margin="base:children[p:not(:first-child), ul](x1, 0, 0, 0)"
        >
          <Alert.Root type="info" data-h2-margin="base(0, 0, x3, 0)">
            <Alert.Title>
              {intl.formatMessage({
                defaultMessage: "The mandatory procedures have changed",
                id: "uEporM",
                description: "Title for an alert about the directive changing",
              })}
            </Alert.Title>
            {intl.formatMessage(
              {
                defaultMessage:
                  "<link>Check out the recent changes to the Mandatory Procedures on Digital Talent</link>, including fewer reporting requirements. Changes are in effect as of September 30th, 2024.",
                id: "bpULlB",
                description: "Body of an alert about the directive changing",
              },
              {
                link: (chunks: ReactNode) => recentChangesLink(chunks),
              },
            )}
          </Alert.Root>
          <Heading
            icon={MapIcon}
            size="h3"
            color="secondary"
            data-h2-margin="base(0, 0, x1, 0)"
          >
            {intl.formatMessage({
              defaultMessage: "What is the Directive on Digital Talent?",
              id: "GdOQeo",
              description: "Heading for section describing the directive",
            })}
          </Heading>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "The Directive on Digital Talent was introduced on April 1, 2023, under the authorities in the <policyLink>Policy on Service and Digital</policyLink>. It focuses on data collection, planning, and interdepartmental coordination in an effort to improve talent sourcing and talent management outcomes across the GC digital community.",
                id: "k4Rl18",
                description:
                  "First paragraph describing the directive on digital talent",
              },
              {
                policyLink: (chunks: ReactNode) => policyLink(locale, chunks),
              },
            )}
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Under the directive, departments are required to submit information to the Office of the Chief Information Officer of Canada. This data is then used to create business intelligence and accelerated recruitment processes that serve departments and agencies across the GC. The goal is to ensure that the GC digital community has access to the talent it needs to deliver modern, effective digital services to Canadians.",
              id: "0QM++s",
              description:
                "Second paragraph describing the directive on digital talent",
            })}
          </p>
          <p>
            <Link color="secondary" mode="solid" href={directiveUrl} external>
              {readDirectiveMessage}
            </Link>
          </p>
          <Heading
            icon={ChartPieIcon}
            size="h3"
            color="primary"
            data-h2-margin="base(x3, 0, x1, 0)"
          >
            {intl.formatMessage({
              defaultMessage: "Key components",
              id: "joXPYW",
              description:
                "Heading for section describing the different components",
            })}
          </Heading>
          <div>
            <Accordion.Root type="multiple" mode="card">
              <Accordion.Item value="planning-reporting">
                <Accordion.Trigger as="h3">
                  {intl.formatMessage({
                    defaultMessage: "Planning and reporting",
                    id: "cktAfD",
                    description:
                      "Heading for the directives planning and reporting component",
                  })}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "The Directive on Digital Talent outlines requirements for departments to inform the Office of the Chief Information Officer about current and planned digital talent needs. This data collection is aggregated and cross-referenced with other data sources. It is then used to provide government-wide and department-specific business intelligence, and to improve targeted recruitment and training.",
                      id: "SlBNsw",
                      description:
                        "The directives planning and reporting component",
                    })}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="digital-talent-sourcing">
                <Accordion.Trigger as="h3">
                  {intl.formatMessage({
                    defaultMessage: "Digital talent sourcing",
                    id: "C03OK7",
                    description:
                      "Heading for the directives digital talent and sourcing component",
                  })}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "The Directive on Digital Talent provides additional clarity on the requirements and decision-making around talent sourcing decisions in support of the development and delivery of digital initiatives, products, and services. It provides practical steps to those involved in talent sourcing decisions, and to gather data that will then be used to continuously improve the quality, speed, and availability of digital talent sourcing.",
                      id: "L6Cx1M",
                      description:
                        "The directives digital talent and sourcing component",
                    })}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="digital-talent-development">
                <Accordion.Trigger as="h3">
                  {intl.formatMessage({
                    defaultMessage: "Digital talent development",
                    id: "mpa5Fd",
                    description:
                      "Heading for the directives digital talent and development component",
                  })}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "The Directive on Digital Talent introduces steps for enhanced interdepartmental coordination on talent development and upskilling, as well as steps to improve equity advancement. The intention of the Directive is to approach the GC digital workforce as a cohesive and evolving community.",
                      id: "PN3PMn",
                      description:
                        "The directives digital talent and development component",
                    })}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="digital-executive-roles-structures">
                <Accordion.Trigger as="h3">
                  {intl.formatMessage({
                    defaultMessage: "Digital executive roles and structures",
                    id: "e/nr9L",
                    description:
                      "Heading for the directives digital executive roles and structures component",
                  })}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "The Directive on Digital Talent provides clarification on existing Policy on Service and Digital requirements related to Chief Information Officer appointments and talent management. The intention is to continue to advance support for executive career pathways, with a focus on modern digital government service delivery.",
                      id: "9ffYBC",
                      description:
                        "The directives digital executive roles and structures component",
                    })}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="enabling-conditions">
                <Accordion.Trigger as="h3">
                  {intl.formatMessage({
                    defaultMessage: "Enabling conditions",
                    id: "8yB2Bm",
                    description:
                      "Heading for the directives digital enabling conditions component",
                  })}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "The Directive on Digital Talent provides clarification that departments are expected to use flexibilities and best practices that exist in various policy instruments to ensure that there is a strong, sustainable talent base, including a focus on hiring.",
                      id: "/BWol9",
                      description:
                        "The directives digital enabling conditions component",
                    })}
                  </p>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "In addition to the support in the Directive itself, check out the guidance on enabling human resources support for digital talent.",
                      id: "POvUB0",
                      description:
                        "Lead-in text for the directive guidance document",
                    })}
                  </p>
                  <div
                    data-h2-margin-top="base(x1)"
                    data-h2-display="base(flex)"
                    data-h2-flex-wrap="base(wrap)"
                    data-h2-gap="base(x.25)"
                  >
                    <Link
                      external
                      color="primary"
                      mode="solid"
                      data-h2-padding="base(x.5, x1)"
                      href={
                        locale === "en"
                          ? "/static/documents/Enabling_Conditions_Guidance_EN.docx"
                          : "/static/documents/Orientation_sur_les_conditions_habilitantes_FR.docx"
                      }
                      download
                    >
                      {intl.formatMessage({
                        defaultMessage: "Download the guidance",
                        id: "yVOpEI",
                        description: "Link text for guidance resource download",
                      })}
                    </Link>
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </div>
          <Heading
            icon={BookmarkSquareIcon}
            size="h3"
            color="error"
            data-h2-margin="base(x3, 0, x1, 0)"
          >
            {intl.formatMessage({
              defaultMessage: "Mandatory reporting",
              id: "g7W+56",
              description:
                "Heading for section for the downloadable forms section",
            })}
          </Heading>
          <div
            data-h2-display="base(grid)"
            data-h2-grid-template-columns="base(1fr) p-tablet(repeat(2, minmax(0, 1fr))) l-tablet(repeat(3, minmax(0, 1fr)))"
            data-h2-gap="base(x2) p-tablet(x3)"
            data-h2-margin="base(x1, 0, 0, 0) p-tablet(x2, 0, 0, 0)"
          >
            <CardFlat
              color="warning"
              title={intl.formatMessage({
                defaultMessage: "Digital services contracting questionnaire",
                id: "oiTphL",
                description:
                  "Heading for the digital Services contracting form",
              })}
              links={[
                {
                  label: intl.formatMessage(
                    {
                      defaultMessage:
                        "Download the questionnaire<hidden>: {formName}</hidden>",
                      id: "cTSaxx",
                      description: "Link text for form download",
                    },
                    {
                      formName: intl.formatMessage({
                        defaultMessage: "Digital Services Contracting",
                        id: "X3bPom",
                        description:
                          "Short name for Digital Services Contracting Form",
                      }),
                    },
                  ),
                  href:
                    intl.locale === "en"
                      ? "/static/documents/Digital_Contracting_Questionnaire_EN.docx"
                      : "/static/documents/Questionnaire_d'octroi_de_contrats_numeriques_FR.docx",
                  mode: "solid",
                  "data-h2-padding": "base(x.5, x1)",
                  download: true,
                  external: true,
                } as const,
              ]}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "This is required when you initiate a procurement process for digital services that exceeds $40,000.",
                  id: "Ny56Y7",
                  description:
                    "Description for the digital Services contracting form, paragraph 1",
                })}
              </p>
              <p>
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "If you’re procuring <strong>due to a talent shortage</strong>, you’ll also need to verify that no talent is available through a <link>GC digital talent request</link>.",
                    id: "ccwY2r",
                    description:
                      "Description for the digital Services contracting form, paragraph 2",
                  },
                  {
                    link: (chunks: ReactNode) =>
                      talentSearchLink(paths.search(), chunks),
                  },
                )}
              </p>
            </CardFlat>
            <CardFlat
              color="secondary"
              title={intl.formatMessage({
                defaultMessage: "Updates to the mandatory procedures",
                id: "6ceoYt",
                description: "Heading for the mandatory procedures card",
              })}
              links={[
                {
                  label: intl.formatMessage(
                    {
                      defaultMessage: "Learn more<hidden>: {topic}</hidden>",
                      id: "ox2by6",
                      description:
                        "Link text to a page to learn more about something",
                    },
                    {
                      topic: intl.formatMessage({
                        defaultMessage: "Updates to the mandatory procedures",
                        id: "6ceoYt",
                        description:
                          "Heading for the mandatory procedures card",
                      }),
                    },
                  ),
                  to: sectionIds.changes,
                  mode: "solid",
                  "data-h2-padding": "base(x.5, x1)",
                } as const,
              ]}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "The Mandatory Procedures on Digital Talent have been updated for improved clarity, fewer reporting requirements, and better alignment with other policy instruments. The Directive remains unchanged.",
                  id: "/ZPTlP",
                  description: "Description for the mandatory procedures card",
                })}
              </p>
            </CardFlat>
            <CardFlat
              color="error"
              title={intl.formatMessage({
                defaultMessage: "Related policies",
                id: "vbiWgW",
                description: "Heading for the related policies card",
              })}
              links={[
                {
                  label: intl.formatMessage(
                    {
                      defaultMessage: "Learn more<hidden>: {topic}</hidden>",
                      id: "ox2by6",
                      description:
                        "Link text to a page to learn more about something",
                    },
                    {
                      topic: intl.formatMessage({
                        defaultMessage: "Related policies",
                        id: "vbiWgW",
                        description: "Heading for the related policies card",
                      }),
                    },
                  ),
                  href:
                    locale === "en"
                      ? "https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=32692&section=procedure&p=F"
                      : "https://www.tbs-sct.canada.ca/pol/doc-fra.aspx?id=32692",
                  mode: "solid",
                  "data-h2-padding": "base(x.5, x1)",
                  download: false,
                  external: true,
                } as const,
              ]}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "There are other requirements if you are procuring professional services. Check out the Mandatory Procedures for Business Owners When Procuring Professional Services led by the Office of the Comptroller General of Canada.",
                  id: "4t/ETT",
                  description: "Description for the related policies card",
                })}
              </p>
            </CardFlat>
          </div>
          <Resources />
          <section id={sectionIds.changes}>
            <Heading
              icon={Cog8ToothIcon}
              size="h3"
              color="success"
              data-h2-margin="base(x3, 0, x1, 0)"
            >
              {intl.formatMessage({
                defaultMessage: "2024 changes to the Mandatory Procedures",
                id: "rZ0GyE",
                description:
                  "Heading for section describing the 2024 changes to the directive",
              })}
            </Heading>
            <div data-h2-margin="base(0, 0, x1, 0)">
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "The Office of the Chief Information Officer of Canada (OCIO) has been closely monitoring the effectiveness of the Directive on Digital Talent since it came into effect in April 2023.",
                  id: "BVgb+I",
                  description:
                    "first paragraph describing the 2024 changes to the directive on digital talent",
                })}
              </p>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "As the Directive is performing strongly, it will remain as is.",
                  id: "qQmKgl",
                  description:
                    "second paragraph describing the 2024 changes to the directive on digital talent",
                })}
              </p>
              <p>
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "While the Mandatory Procedures on Digital Talent are also effective, there are opportunities for improved clarity, reduced reporting burden for departments, and better alignment with the new <link>Mandatory Procedures for Business Owners When Procuring Professional Services</link> led by the Office of the Comptroller General of Canada (OCG).",
                    id: "HRmtdK",
                    description:
                      "third paragraph describing the 2024 changes to the directive on digital talent",
                  },
                  {
                    link: (chunks: ReactNode) =>
                      procurementLink(locale, chunks),
                  },
                )}
              </p>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "As a result, OCIO is introducing some updates to the Mandatory Procedures on Digital Talent, effective September 30th, 2024.",
                  id: "deiUXj",
                  description:
                    "fourth paragraph describing the 2024 changes to the directive on digital talent",
                })}
              </p>
            </div>
            <Card>
              <ul
                data-h2-margin="base(0)"
                data-h2-padding="base(0, 0, 0, x1)"
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-gap="base(x0.25)"
              >
                <li>
                  <span data-h2-font-weight="base(bold)">
                    {intl.formatMessage({
                      defaultMessage: "Removal of the Forward Talent Plan",
                      id: "O8YvBD",
                      description: "first 2024 key change to the directive",
                    })}
                  </span>
                  <div>
                    {intl.formatMessage({
                      defaultMessage:
                        "Data can be secured through other means (e.g., the GC Digital Talent platform, improved data monitoring)",
                      id: "DVBh+y",
                      description:
                        "first 2024 key change rationale to the directive",
                    })}
                  </div>
                </li>
                <li>
                  <span data-h2-font-weight="base(bold)">
                    {intl.formatMessage({
                      defaultMessage:
                        "Removal of the Department-specific Recruitment Process Form",
                      id: "o6Vyr+",
                      description: "second 2024 key change to the directive",
                    })}
                  </span>
                  <div>
                    {intl.formatMessage({
                      // yes, this is the same rationale as for the first key change
                      defaultMessage:
                        "Data can be secured through other means (e.g., the GC Digital Talent platform, improved data monitoring)",
                      id: "DVBh+y",
                      description:
                        "first 2024 key change rationale to the directive",
                    })}
                  </div>
                </li>
                <li>
                  <span data-h2-font-weight="base(bold)">
                    {intl.formatMessage({
                      defaultMessage:
                        "Removal of the requirement to share copies of non-standard IT job descriptions",
                      id: "DjRrK4",
                      description: "third 2024 key change to the directive",
                    })}
                  </span>
                  <div>
                    {intl.formatMessage({
                      defaultMessage:
                        "Information from departments is not proving to be necessary; reduction in collection burden for departments",
                      id: "FDGVHB",
                      description:
                        "third 2024 key change rationale to the directive",
                    })}
                  </div>
                </li>
                <li>
                  <span data-h2-font-weight="base(bold)">
                    {intl.formatMessage({
                      defaultMessage:
                        "Updates to the Digital Services Contracting Questionnaire",
                      id: "L819mr",
                      description: "fourth 2024 key change to the directive",
                    })}
                  </span>
                  <div>
                    {intl.formatMessage({
                      defaultMessage:
                        "Alignment with the new OCG-led Mandatory Procedures",
                      id: "AgtPO+",
                      description:
                        "fourth 2024 key change rationale to the directive",
                    })}
                  </div>
                </li>
                <li>
                  <span data-h2-font-weight="base(bold)">
                    {intl.formatMessage({
                      defaultMessage:
                        "Confirmation on the use of the GC Digital Talent platform for verifying availability of qualified talent",
                      id: "hI5cty",
                      description: "fifth 2024 key change to the directive",
                    })}
                  </span>
                  <div>
                    {intl.formatMessage({
                      defaultMessage:
                        "This has always been the case and is now being formalized after the platform was announced by the Minister",
                      id: "G+dXAH",
                      description:
                        "fifth 2024 key change rationale to the directive",
                    })}
                  </div>
                </li>
              </ul>
            </Card>
          </section>
        </div>
      </div>
      <div
        data-h2-background-image="base(main-linear)"
        data-h2-display="base(block)"
        data-h2-height="base(x1)"
      />
    </>
  );
};

Component.displayName = "DirectivePage";

export default Component;
