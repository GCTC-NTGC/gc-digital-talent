import React from "react";
import { useIntl } from "react-intl";
import MapIcon from "@heroicons/react/24/outline/MapIcon";
import ChartPieIcon from "@heroicons/react/24/outline/ChartPieIcon";
import NewspaperIcon from "@heroicons/react/24/outline/NewspaperIcon";
import MagnifyingGlassCircleIcon from "@heroicons/react/24/outline/MagnifyingGlassCircleIcon";
import BookmarkSquareIcon from "@heroicons/react/24/outline/BookmarkSquareIcon";

import {
  Heading,
  ExternalLink,
  Accordion,
  CardFlat,
} from "@gc-digital-talent/ui";
import { StandardHeader as StandardAccordionHeader } from "@gc-digital-talent/ui/src/components/Accordion/StandardHeader";
import { Locales, useLocale } from "@gc-digital-talent/i18n";

import Hero from "~/components/Hero";
import CallToActionLink from "~/components/CallToAction/CallToActionLink";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";

import talentPlanEn from "~/assets/documents/Forward_Talent_Plan_EN.docx";
import talentPlanFr from "~/assets/documents/Plan_prospectif_sur_les_talents_FR.docx";
import recruitmentEn from "~/assets/documents/Digital_Recruitment_Template_EN.docx";
import recruitmentFr from "~/assets/documents/Modele_de_recrutement_numerique_FR.docx";
import guidanceEn from "~/assets/documents/Enabling_Conditions_Guidance_EN.docx";
import guidanceFr from "~/assets/documents/Orientation_sur_les_conditions_habilitantes_FR.docx";
import contractingEn from "~/assets/documents/Digital_Contracting_Questionnaire_EN.docx";
import contractingFr from "~/assets/documents/Questionnaire_d'octroi_de_contrats_numeriques_FR.docx";

import { getFormLinks, getGenericLinks } from "./utils";

const policyLink = (locale: Locales, chunks: React.ReactNode) => (
  <ExternalLink
    newTab
    href={
      locale === "en"
        ? "https://www.tbs-sct.canada.ca/pol/doc-eng.aspx?id=32603"
        : "https://www.tbs-sct.canada.ca/pol/doc-fra.aspx?id=32603"
    }
  >
    {chunks}
  </ExternalLink>
);

const contactLink = (chunks: React.ReactNode) => (
  <a href="mailto:GCTalentGC@tbs-sct.gc.ca">{chunks}</a>
);

const DirectivePage = () => {
  const intl = useIntl();
  const { locale } = useLocale();
  const paths = useRoutes();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Directive on Digital Talent",
    id: "xXwUGs",
    description: "Title for the digital talent directive page",
  });

  const crumbs = useBreadcrumbs([
    {
      label: pageTitle,
      url: paths.directive(),
    },
  ]);

  const directiveUrl =
    locale === "en"
      ? "https://www.tbs-sct.gc.ca/pol/doc-eng.aspx?id=32749"
      : "https://www.tbs-sct.gc.ca/pol/doc-fra.aspx?id=32749";

  const readDirectiveMessage = intl.formatMessage({
    defaultMessage: "Read the Directive",
    id: "RDAVsP",
    description: "Link text to read the entire directive.",
  });

  const departmentFormLinks = getFormLinks({
    intl,
    files: {
      en: recruitmentEn,
      fr: recruitmentFr,
    },
    formName: intl.formatMessage({
      defaultMessage: "Department-Specific Recruitment",
      id: "uJyWDM",
      description: "Short name for Department-Specific Recruitment Form",
    }),
  });

  const contractingFormLinks = getFormLinks({
    intl,
    files: {
      en: contractingEn,
      fr: contractingFr,
    },
    formName: intl.formatMessage({
      defaultMessage: "Digital Services Contracting",
      id: "X3bPom",
      description: "Short name for Digital Services Contracting Form",
    }),
  });

  const talentPlanFormLinks = getFormLinks({
    intl,
    files: {
      en: talentPlanEn,
      fr: talentPlanFr,
    },
    formName: intl.formatMessage({
      defaultMessage: "Forward Talent Plan",
      id: "G0RoYe",
      description: "Short name for Forward Talent Plan Form",
    }),
  });

  const guidanceLinks = getGenericLinks({
    intl,
    files: {
      en: guidanceEn,
      fr: guidanceFr,
    },
    labels: {
      en: intl.formatMessage({
        defaultMessage: "Download the guidance (EN)",
        id: "wMp4x6",
        description: "Link text for English guidance resource download",
      }),
      fr: intl.formatMessage({
        defaultMessage: "Download the guidance (FR)",
        id: "ft6q8G",
        description: "Link text for French guidance resource download",
      }),
    },
  });

  return (
    <>
      <Hero
        title={pageTitle}
        subtitle={intl.formatMessage({
          defaultMessage:
            "Learn more about how the Government of Canada is strengthening the talent base of the GC digital community.",
          id: "c/u1K+",
          description: "Subtitle for the digital talent directive page",
        })}
        crumbs={crumbs}
        linkSlot={
          <>
            <CallToActionLink
              href={directiveUrl}
              color="quaternary"
              Icon={NewspaperIcon}
            >
              {readDirectiveMessage}
            </CallToActionLink>
            <CallToActionLink
              href={paths.search()}
              color="secondary"
              Icon={MagnifyingGlassCircleIcon}
            >
              {intl.formatMessage({
                defaultMessage: "Find talent",
                id: "NKr2Rg",
                description: "Link text for find talent (search) page",
              })}
            </CallToActionLink>
          </>
        }
      />
      <div data-h2-padding="base(x3, 0)">
        <div
          data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
          data-h2-margin="base:children[p:not(:first-child), ul](x1, 0, 0, 0)"
        >
          <Heading
            Icon={MapIcon}
            size="h3"
            color="red"
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
                policyLink: (chunks: React.ReactNode) =>
                  policyLink(locale, chunks),
              },
            )}
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Under the new directive, departments are required to submit additional information to the Office of the Chief Information Officer of Canada. This data is then used to create business intelligence and accelerated recruitment processes that serve departments and agencies across the GC. The goal is to ensure that the GC digital community has access to the talent it needs to deliver modern, effective digital services to Canadians.",
              id: "WieVH/",
              description:
                "Second paragraph describing the directive on digital talent",
            })}
          </p>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "Want to coordinate a presentation for your department? <contactLink>Contact us</contactLink>.",
                id: "TmDejD",
                description:
                  "Third paragraph describing the directive on digital talent",
              },
              {
                contactLink,
              },
            )}
          </p>
          <p>
            <ExternalLink
              type="button"
              color="primary"
              mode="solid"
              href={directiveUrl}
            >
              {readDirectiveMessage}
            </ExternalLink>
          </p>
          <Heading
            Icon={ChartPieIcon}
            size="h3"
            color="blue"
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
            <Accordion.Root type="multiple">
              <Accordion.Item value="planning-reporting">
                <StandardAccordionHeader headingAs="h3">
                  {intl.formatMessage({
                    defaultMessage: "Planning and reporting",
                    id: "cktAfD",
                    description:
                      "Heading for the directives planning and reporting component",
                  })}
                </StandardAccordionHeader>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "The Directive on Digital Talent introduces new requirements for departments to inform the Office of the Chief Information Officer about current and planned digital talent needs. This data collection is aggregated and cross-referenced with other data sources. It is then used to provide government-wide and department-specific business intelligence, and to improve targeted recruitment and training.",
                      id: "1pbvy+",
                      description:
                        "The directives planning and reporting component",
                    })}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="digital-talent-sourcing">
                <StandardAccordionHeader headingAs="h3">
                  {intl.formatMessage({
                    defaultMessage: "Digital talent sourcing",
                    id: "C03OK7",
                    description:
                      "Heading for the directives digital talent and sourcing component",
                  })}
                </StandardAccordionHeader>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "The Directive on Digital Talent provides additional clarity on the requirements and decision-making around talent sourcing decisions in support of the development and delivery of digital initiatives, products, and services. It aims to provide practical steps to those involved in talent sourcing decisions, and to gather data that will then be used to continuously improve the quality, speed, and availability of digital talent sourcing.",
                      id: "L1tQMY",
                      description:
                        "The directives digital talent and sourcing component",
                    })}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="digital-talent-development">
                <StandardAccordionHeader headingAs="h3">
                  {intl.formatMessage({
                    defaultMessage: "Digital talent development",
                    id: "mpa5Fd",
                    description:
                      "Heading for the directives digital talent and development component",
                  })}
                </StandardAccordionHeader>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "The Directive on Digital Talent introduces steps for enhanced interdepartmental coordination on talent development and upskilling, as well as steps to improve equity advancement. The intention of the Directive is to approach the GC digital talent as a cohesive and evolving community.",
                      id: "hBVKqk",
                      description:
                        "The directives digital talent and development component",
                    })}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="digital-executive-roles-structures">
                <StandardAccordionHeader headingAs="h3">
                  {intl.formatMessage({
                    defaultMessage: "Digital executive roles and structures",
                    id: "e/nr9L",
                    description:
                      "Heading for the directives digital executive roles and structures component",
                  })}
                </StandardAccordionHeader>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "The Directive on Digital Talent provides clarification on existing Policy on Service and Digital requirements related to CIO appointments and talent management. The intention is to continue to advance support for executive career pathways, with a focus on modern digital government service delivery.",
                      id: "Z9xByk",
                      description:
                        "The directives digital executive roles and structures component",
                    })}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="enabling-conditions">
                <StandardAccordionHeader headingAs="h3">
                  {intl.formatMessage({
                    defaultMessage: "Enabling conditions",
                    id: "8yB2Bm",
                    description:
                      "Heading for the directives digital enabling conditions component",
                  })}
                </StandardAccordionHeader>
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
                    {guidanceLinks.map((guidanceLink) => (
                      <ExternalLink
                        key={guidanceLink.naturalKey ?? guidanceLink.href}
                        type="button"
                        color="primary"
                        {...guidanceLink}
                      />
                    ))}
                  </div>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </div>
          <Heading
            Icon={BookmarkSquareIcon}
            size="h3"
            color="purple"
            data-h2-margin="base(x3, 0, x1, 0)"
          >
            {intl.formatMessage({
              defaultMessage: "Complete your mandatory forms",
              id: "XVWN/C",
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
              color="quaternary"
              title={intl.formatMessage({
                defaultMessage: "Department-Specific Recruitment Form",
                id: "x0SRaQ",
                description:
                  "Heading for the department-specific recruitment form",
              })}
              links={departmentFormLinks}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "<strong>Mandatory reporting</strong>. This is now required when you want to run a recruitment for digital talent that will create a pool of candidates. No extra approvals - just let us know what you're planning!",
                  id: "0DILS7",
                  description:
                    "Description for the department-specific recruitment form",
                })}
              </p>
            </CardFlat>
            <CardFlat
              color="secondary"
              title={intl.formatMessage({
                defaultMessage: "Digital Services Contracting Form",
                id: "QVWGaL",
                description:
                  "Heading for the digital Services contracting form",
              })}
              links={contractingFormLinks}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "<strong>Mandatory reporting</strong>. This is now required when you want to run a procurement process for digital talent, especially if you’re planning to contract because you’re having trouble finding the right talent to hire. No extra approvals - just let us know what you're planning!",
                  id: "fpdcE/",
                  description:
                    "Description for the digital Services contracting form",
                })}
              </p>
            </CardFlat>
            <CardFlat
              color="tertiary"
              title={intl.formatMessage({
                defaultMessage: "Forward Talent Plan Form",
                id: "sKAo0/",
                description: "Heading for the forward talent plan form",
              })}
              links={talentPlanFormLinks}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "<strong>Mandatory reporting</strong>. This is now required when you plan a new or expanded digital initiative that will add 10 or more full-time equivalent positions to your department. We want to help make sure that fully qualified, ready-to-hire talent is there when you need it.",
                  id: "ydjXm7",
                  description: "Description for the forward talent plan form",
                })}
              </p>
            </CardFlat>
          </div>
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

export default DirectivePage;
