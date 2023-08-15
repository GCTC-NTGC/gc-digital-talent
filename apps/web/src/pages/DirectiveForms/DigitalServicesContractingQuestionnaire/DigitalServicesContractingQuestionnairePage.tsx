import React from "react";
import { defineMessage, useIntl } from "react-intl";
import FlagIcon from "@heroicons/react/24/outline/FlagIcon";
import LightBulbIcon from "@heroicons/react/24/outline/LightBulbIcon";
import ListBulletIcon from "@heroicons/react/24/outline/ListBulletIcon";

import { Heading, Link, TableOfContents } from "@gc-digital-talent/ui";
import AnchorLink from "@gc-digital-talent/ui/src/components/TableOfContents/AnchorLink";

import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import Hero from "~/components/Hero";
import contractingEn from "~/assets/documents/Digital_Contracting_Questionnaire_EN.docx";
import contractingFr from "~/assets/documents/Questionnaire_d'octroi_de_contrats_numeriques_FR.docx";

import { useLocale } from "@gc-digital-talent/i18n";
import { pageTitle as directiveHomePageTitle } from "../../DirectivePage/DirectivePage";
import { getSectionTitle, PAGE_SECTION_ID } from "./navigation";

export const pageTitle = defineMessage({
  defaultMessage: "Digital Services Contracting Questionnaire",
  id: "kUgTNq",
  description:
    "Title for the Digital services contracting questionnaire form page",
});

function buildExternalLink(
  href: string,
  chunks: React.ReactNode,
): React.ReactElement {
  return (
    <Link href={href} external>
      {chunks}
    </Link>
  );
}

const DigitalServicesContractingQuestionnaire = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const localeState = useLocale();

  const crumbs = useBreadcrumbs([
    {
      label: intl.formatMessage(directiveHomePageTitle),
      url: paths.directive(),
    },
    {
      label: intl.formatMessage(pageTitle),
      url: paths.digitalServicesContractingQuestionnaire(),
    },
  ]);

  return (
    <>
      <Hero
        title={intl.formatMessage(pageTitle)}
        subtitle={intl.formatMessage({
          defaultMessage:
            "Complete this form as a part of your role in the Directive on Digital Talent.",
          id: "RNGz7i",
          description:
            "Subtitle for the _digital services contracting questionnaire_ page",
        })}
        crumbs={crumbs}
      />
      <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
        <TableOfContents.Wrapper>
          <TableOfContents.Navigation data-h2-padding-top="base(x3)">
            <TableOfContents.List>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={PAGE_SECTION_ID.INSTRUCTIONS}>
                  {intl.formatMessage(
                    getSectionTitle(PAGE_SECTION_ID.INSTRUCTIONS),
                  )}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={PAGE_SECTION_ID.PREAMBLE}>
                  {intl.formatMessage(
                    getSectionTitle(PAGE_SECTION_ID.PREAMBLE),
                  )}
                </TableOfContents.AnchorLink>
                <TableOfContents.List space="sm">
                  <TableOfContents.ListItem>
                    <TableOfContents.AnchorLink
                      id={PAGE_SECTION_ID.ROLE_OF_THE_CIO}
                    >
                      {intl.formatMessage(
                        getSectionTitle(PAGE_SECTION_ID.ROLE_OF_THE_CIO),
                      )}
                    </TableOfContents.AnchorLink>
                  </TableOfContents.ListItem>
                  <TableOfContents.ListItem>
                    <TableOfContents.AnchorLink
                      id={PAGE_SECTION_ID.WHY_COLLECT}
                    >
                      {intl.formatMessage(
                        getSectionTitle(PAGE_SECTION_ID.WHY_COLLECT),
                      )}
                    </TableOfContents.AnchorLink>
                  </TableOfContents.ListItem>
                  <TableOfContents.ListItem>
                    <TableOfContents.AnchorLink
                      id={PAGE_SECTION_ID.REQUIREMENTS}
                    >
                      {intl.formatMessage(
                        getSectionTitle(PAGE_SECTION_ID.REQUIREMENTS),
                      )}
                    </TableOfContents.AnchorLink>
                  </TableOfContents.ListItem>
                </TableOfContents.List>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={PAGE_SECTION_ID.QUESTIONNAIRE}>
                  {intl.formatMessage(
                    getSectionTitle(PAGE_SECTION_ID.QUESTIONNAIRE),
                  )}
                </TableOfContents.AnchorLink>
                <TableOfContents.List space="sm">
                  <TableOfContents.ListItem>
                    <TableOfContents.AnchorLink
                      id={PAGE_SECTION_ID.GENERAL_INFORMATION}
                    >
                      {intl.formatMessage(
                        getSectionTitle(PAGE_SECTION_ID.GENERAL_INFORMATION),
                      )}
                    </TableOfContents.AnchorLink>
                  </TableOfContents.ListItem>
                  <TableOfContents.ListItem>
                    <TableOfContents.AnchorLink
                      id={PAGE_SECTION_ID.SCOPE_OF_CONTRACT}
                    >
                      {intl.formatMessage(
                        getSectionTitle(PAGE_SECTION_ID.SCOPE_OF_CONTRACT),
                      )}
                    </TableOfContents.AnchorLink>
                  </TableOfContents.ListItem>
                  <TableOfContents.ListItem>
                    <TableOfContents.AnchorLink
                      id={PAGE_SECTION_ID.CONTRACT_REQUIREMENTS}
                    >
                      {intl.formatMessage(
                        getSectionTitle(PAGE_SECTION_ID.CONTRACT_REQUIREMENTS),
                      )}
                    </TableOfContents.AnchorLink>
                  </TableOfContents.ListItem>
                  <TableOfContents.ListItem>
                    <TableOfContents.AnchorLink
                      id={PAGE_SECTION_ID.TECHNOLOGICAL_CHANGE}
                    >
                      {intl.formatMessage(
                        getSectionTitle(PAGE_SECTION_ID.TECHNOLOGICAL_CHANGE),
                      )}
                    </TableOfContents.AnchorLink>
                  </TableOfContents.ListItem>
                  <TableOfContents.ListItem>
                    <TableOfContents.AnchorLink
                      id={PAGE_SECTION_ID.OPERATIONS_CONSIDERATIONS}
                    >
                      {intl.formatMessage(
                        getSectionTitle(
                          PAGE_SECTION_ID.OPERATIONS_CONSIDERATIONS,
                        ),
                      )}
                    </TableOfContents.AnchorLink>
                  </TableOfContents.ListItem>
                  <TableOfContents.ListItem>
                    <TableOfContents.AnchorLink
                      id={PAGE_SECTION_ID.TALENT_SOURCING_DECISION}
                    >
                      {intl.formatMessage(
                        getSectionTitle(
                          PAGE_SECTION_ID.TALENT_SOURCING_DECISION,
                        ),
                      )}
                    </TableOfContents.AnchorLink>
                  </TableOfContents.ListItem>
                </TableOfContents.List>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink
                  id={PAGE_SECTION_ID.EXAMPLES_OF_CONTRACTS}
                >
                  {intl.formatMessage(
                    getSectionTitle(PAGE_SECTION_ID.EXAMPLES_OF_CONTRACTS),
                  )}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
            </TableOfContents.List>
            <Link
              mode="solid"
              color="secondary"
              block
              external
              href={localeState.locale === "fr" ? contractingFr : contractingEn}
            >
              {intl.formatMessage({
                defaultMessage: "Download a copy of this form",
                id: "R9YL7P",
                description: "Button text to download this form",
              })}
            </Link>
          </TableOfContents.Navigation>
          <TableOfContents.Content data-h2-padding-top="base(x3)">
            <TableOfContents.Section id={PAGE_SECTION_ID.INSTRUCTIONS}>
              <Heading
                Icon={FlagIcon}
                size="h3"
                color="secondary"
                data-h2-margin="base(0, 0, x1, 0)"
              >
                {intl.formatMessage(
                  getSectionTitle(PAGE_SECTION_ID.INSTRUCTIONS),
                )}
              </Heading>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Complete and submit this questionnaire at the time when a contract for digital services is submitted to departmental procurement authorities for processing.",
                  id: "SgkkWp",
                  description:
                    "Paragraph one of the _instructions_ section of the _digital services contracting questionnaire_",
                })}
              </p>
              <p data-h2-margin-top="base(x.5)">
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "All questions in this questionnaire are marked as required (<red>*</red>) unless otherwise specified. A copy of your submission will be emailed to you upon completion. Please note that you can also optionally download a blank copy of this form and submit it to the <link>GC Digital Talent mailbox</link> through email.",
                    id: "kj2Qkb",
                    description:
                      "Paragraph two of the _instructions_ section of the _digital services contracting questionnaire_",
                  },
                  {
                    link: (text: React.ReactNode) =>
                      buildExternalLink(
                        "mailto:GCTalentGC@tbs-sct.gc.ca",
                        text,
                      ),
                  },
                )}
              </p>
              <p data-h2-margin-top="base(x.5)">
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "For any questions or concerns regarding the questionnaire, contact <link>GC Digital Talent</link> for more information.",
                    id: "Vjf463",
                    description:
                      "Paragraph three of the _instructions_ section of the _digital services contracting questionnaire_",
                  },
                  {
                    link: (text: React.ReactNode) =>
                      buildExternalLink(
                        "mailto:GCTalentGC@tbs-sct.gc.ca",
                        text,
                      ),
                  },
                )}
              </p>
            </TableOfContents.Section>
            <TableOfContents.Section
              id={PAGE_SECTION_ID.PREAMBLE}
              data-h2-padding-top="base(x2)"
            >
              <Heading Icon={LightBulbIcon} size="h3" color="primary">
                {intl.formatMessage(getSectionTitle(PAGE_SECTION_ID.PREAMBLE))}
              </Heading>
            </TableOfContents.Section>
            <TableOfContents.Section
              id={PAGE_SECTION_ID.ROLE_OF_THE_CIO}
              data-h2-padding-top="base(x1)"
            >
              <Heading data-h2-margin="base(0, 0, x1, 0)" level="h3">
                {intl.formatMessage(
                  getSectionTitle(PAGE_SECTION_ID.ROLE_OF_THE_CIO),
                )}
              </Heading>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "OCIO of the Treasury Board of Canada Secretariat (TBS) is responsible for the sustainability and development in the GC Digital Community, including:",
                  id: "ihJUtJ",
                  description:
                    "Introduction to the _role of the cio_ section of the _digital services contracting questionnaire_",
                })}
              </p>
              <ul data-h2-margin-top="base(x.5)">
                <li>
                  {intl.formatMessage(
                    {
                      defaultMessage:
                        "Developing <link>generic suite of HR products</link> (accessible on GC network only), such as standardized job descriptions, for the digital community",
                      id: "F2F3dY",
                      description:
                        "An OCIO role in the _role of the cio_ section of the _digital services contracting questionnaire_",
                    },
                    {
                      link: (text: React.ReactNode) =>
                        buildExternalLink(
                          "https://www.gcpedia.gc.ca/wiki/CIO_Suite/Organizational_Models",
                          text,
                        ),
                    },
                  )}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "Running government-wide recruitment processes for digital talent",
                    id: "CrqCDE",
                    description:
                      "An OCIO role in the _role of the cio_ section of the _digital services contracting questionnaire_",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "Implementing and supporting initiatives to advance diversity, equity and inclusion in the digital community",
                    id: "+5twwC",
                    description:
                      "An OCIO role in the _role of the cio_ section of the _digital services contracting questionnaire_",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "Maintaining pools of digital talent accessible by all departments",
                    id: "yp6OCO",
                    description:
                      "An OCIO role in the _role of the cio_ section of the _digital services contracting questionnaire_",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "Developing career pathways for digital talent",
                    id: "VlQ7r/",
                    description:
                      "An OCIO role in the _role of the cio_ section of the _digital services contracting questionnaire_",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "Identifying and coordinating government-wide training and upskilling opportunities",
                    id: "RiF2sQ",
                    description:
                      "An OCIO role in the _role of the cio_ section of the _digital services contracting questionnaire_",
                  })}
                </li>
              </ul>
            </TableOfContents.Section>
            <TableOfContents.Section
              id={PAGE_SECTION_ID.WHY_COLLECT}
              data-h2-padding-top="base(x2)"
            >
              <Heading data-h2-margin="base(0, 0, x1, 0)" level="h3">
                {intl.formatMessage(
                  getSectionTitle(PAGE_SECTION_ID.WHY_COLLECT),
                )}
              </Heading>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "This data collection enables business intelligence on the GC digital talent ecosystem. The information helps to identify emerging digital skills requirements and potential gaps in the GC digital community.",
                  id: "iasn5H",
                  description:
                    "Paragraph one of the introduction to the _why collect this data_ section of the _digital services contracting questionnaire_",
                })}
              </p>
              <p data-h2-margin-top="base(x.5)">
                {intl.formatMessage({
                  defaultMessage:
                    "Informed by this data, OCIO can work with departments and agencies on government-wide strategies and initiatives to develop the GC digital community, including:",
                  id: "KCzZr9",
                  description:
                    "Paragraph two of the introduction to the _why collect this data_ section of the _digital services contracting questionnaire_",
                })}
              </p>
              <ul data-h2-margin-top="base(x.5)">
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "Creating GC-wide pool of prequalified digital talent, informed by departmental needs",
                    id: "TUz/Cm",
                    description:
                      "A reason to collect this data in the _why collect this data_ section of the _digital services contracting questionnaire_",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "Advancing the coordination of training and upskilling opportunities for the GC digital community",
                    id: "7MMfLQ",
                    description:
                      "A reason to collect this data in the _why collect this data_ section of the _digital services contracting questionnaire_",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "Identifying potential systemic challenges and barriers in sourcing digital talent",
                    id: "/8qCuC",
                    description:
                      "A reason to collect this data in the _why collect this data_ section of the _digital services contracting questionnaire_",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "Working with mandate authorities across the GC to identify solutions and best practices",
                    id: "mpt068",
                    description:
                      "A reason to collect this data in the _why collect this data_ section of the _digital services contracting questionnaire_",
                  })}
                </li>
              </ul>
            </TableOfContents.Section>
            <TableOfContents.Section
              id={PAGE_SECTION_ID.REQUIREMENTS}
              data-h2-padding-top="base(x2)"
            >
              <Heading data-h2-margin="base(0, 0, x1, 0)" level="h3">
                {intl.formatMessage(
                  getSectionTitle(PAGE_SECTION_ID.REQUIREMENTS),
                )}
              </Heading>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "As set out in the Mandatory Procedures for Digital Talent, the business owner is responsible for completing and submitting the Digital Services Contracting Questionnaire if they are procuring digital services.",
                  id: "kc730N",
                  description:
                    "Paragraph one of the _requirements_ section of the _digital services contracting questionnaire_",
                })}
              </p>
              <p data-h2-margin-top="base(x.5)">
                {intl.formatMessage({
                  defaultMessage:
                    "Prior to concluding that a shortage of available or qualified digital talent is the primary rationale for procurement, the business owner must confirm with OCIO that there is no available pre-qualified talent in an OCIO-coordinated talent pool that could meet the need in the timeframe provided.",
                  id: "58vxwx",
                  description:
                    "Paragraph two of the _requirements_ section of the _digital services contracting questionnaire_",
                })}
              </p>
              <p data-h2-margin-top="base(x.5)">
                {intl.formatMessage({
                  defaultMessage:
                    "The completed questionnaire needs to be submitted at the time when a contract for digital services (including call-up of an established contracting vehicle) is submitted to departmental procurement authorities for processing.",
                  id: "tgGPyx",
                  description:
                    "Paragraph three of the _requirements_ section of the _digital services contracting questionnaire_",
                })}
              </p>
              <p data-h2-margin-top="base(x.5)">
                {intl.formatMessage({
                  defaultMessage:
                    "This is a reporting requirement only and does not impose any additional approval steps by OCIO. In other words, no OCIO approval is required to initiate a procurement process for digital services.",
                  id: "a8S36W",
                  description:
                    "Paragraph four of the _requirements_ section of the _digital services contracting questionnaire_",
                })}
              </p>
              <p data-h2-margin-top="base(x.5)">
                <AnchorLink id={PAGE_SECTION_ID.EXAMPLES_OF_CONTRACTS}>
                  {intl.formatMessage({
                    defaultMessage:
                      'Click here for examples of "contracts for digital services" where this requirement applies.',
                    id: "I8y5Fz",
                    description:
                      "Paragraph five of the _requirements_ section of the _digital services contracting questionnaire_",
                  })}
                </AnchorLink>
              </p>
            </TableOfContents.Section>
            <TableOfContents.Section
              id={PAGE_SECTION_ID.QUESTIONNAIRE}
              data-h2-padding-top="base(x2)"
            >
              <Heading Icon={ListBulletIcon} size="h3" color="tertiary">
                {intl.formatMessage(
                  getSectionTitle(PAGE_SECTION_ID.QUESTIONNAIRE),
                )}
              </Heading>
              <TableOfContents.Section
                id={PAGE_SECTION_ID.GENERAL_INFORMATION}
                data-h2-padding-top="base(x1)"
              >
                <Heading data-h2-margin="base(0, 0, x1, 0)" level="h3">
                  {intl.formatMessage(
                    getSectionTitle(PAGE_SECTION_ID.GENERAL_INFORMATION),
                  )}
                </Heading>
                TODO: GENERAL_INFORMATION
              </TableOfContents.Section>
              <TableOfContents.Section
                id={PAGE_SECTION_ID.SCOPE_OF_CONTRACT}
                data-h2-padding-top="base(x2)"
              >
                <Heading data-h2-margin="base(0, 0, x1, 0)" level="h3">
                  {intl.formatMessage(
                    getSectionTitle(PAGE_SECTION_ID.SCOPE_OF_CONTRACT),
                  )}
                </Heading>
                TODO: SCOPE_OF_CONTRACT
              </TableOfContents.Section>
              <TableOfContents.Section
                id={PAGE_SECTION_ID.CONTRACT_REQUIREMENTS}
                data-h2-padding-top="base(x2)"
              >
                <Heading data-h2-margin="base(0, 0, x1, 0)" level="h3">
                  {intl.formatMessage(
                    getSectionTitle(PAGE_SECTION_ID.CONTRACT_REQUIREMENTS),
                  )}
                </Heading>
                TODO: CONTRACT_REQUIREMENTS
              </TableOfContents.Section>
              <TableOfContents.Section
                id={PAGE_SECTION_ID.TECHNOLOGICAL_CHANGE}
                data-h2-padding-top="base(x2)"
              >
                <Heading data-h2-margin="base(0, 0, x1, 0)" level="h3">
                  {intl.formatMessage(
                    getSectionTitle(PAGE_SECTION_ID.TECHNOLOGICAL_CHANGE),
                  )}
                </Heading>
                TODO: TECHNOLOGICAL_CHANGE
              </TableOfContents.Section>
              <TableOfContents.Section
                id={PAGE_SECTION_ID.OPERATIONS_CONSIDERATIONS}
                data-h2-padding-top="base(x2)"
              >
                <Heading data-h2-margin="base(0, 0, x1, 0)" level="h3">
                  {intl.formatMessage(
                    getSectionTitle(PAGE_SECTION_ID.OPERATIONS_CONSIDERATIONS),
                  )}
                </Heading>
                TODO: OPERATIONS_CONSIDERATIONS
              </TableOfContents.Section>
              <TableOfContents.Section
                id={PAGE_SECTION_ID.TALENT_SOURCING_DECISION}
                data-h2-padding-top="base(x2)"
              >
                <Heading data-h2-margin="base(0, 0, x1, 0)" level="h3">
                  {intl.formatMessage(
                    getSectionTitle(PAGE_SECTION_ID.TALENT_SOURCING_DECISION),
                  )}
                </Heading>
                TODO: TALENT_SOURCING_DECISION
              </TableOfContents.Section>
            </TableOfContents.Section>
            <TableOfContents.Section
              id={PAGE_SECTION_ID.EXAMPLES_OF_CONTRACTS}
              data-h2-padding-top="base(x2)"
            >
              <Heading data-h2-margin="base(0, 0, x1, 0)" level="h3">
                {intl.formatMessage(
                  getSectionTitle(PAGE_SECTION_ID.EXAMPLES_OF_CONTRACTS),
                )}
              </Heading>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "For the purpose of this requirement, contracts for digital services include any contract, regardless of procurement type or solicitation procedure, that supports the development or delivery of GC digital initiatives, products or services, such as contracts that are for:",
                  id: "tXw1VV",
                  description:
                    "Paragraph one of the _examples of contracts_ section of the _digital services contracting questionnaire_",
                })}
              </p>
              <ul data-h2-margin-top="base(x.5)">
                <li>
                  {intl.formatMessage({
                    defaultMessage: "information technology",
                    id: "wUujPy",
                    description:
                      "An example in the _examples of contracts_ section of the _digital services contracting questionnaire_",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage: "information management",
                    id: "G0OY3I",
                    description:
                      "An example in the _examples of contracts_ section of the _digital services contracting questionnaire_",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage: "cybersecurity",
                    id: "6cEYtp",
                    description:
                      "An example in the _examples of contracts_ section of the _digital services contracting questionnaire_",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "data management for the development or delivery of a GC digital initiative, service or product",
                    id: "T5QT/C",
                    description:
                      "An example in the _examples of contracts_ section of the _digital services contracting questionnaire_",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "data science and analytics for the development or delivery of a GC digital initiative, service or product",
                    id: "wUdfC1",
                    description:
                      "An example in the _examples of contracts_ section of the _digital services contracting questionnaire_",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "user-experience research or service design for the development or delivery of a GC digital initiative, service or product",
                    id: "4bEY3Y",
                    description:
                      "An example in the _examples of contracts_ section of the _digital services contracting questionnaire_",
                  })}
                </li>
              </ul>
              <p data-h2-margin-top="base(x.5)">
                {intl.formatMessage({
                  defaultMessage:
                    "Examples of these contracts may include, but are not limited to:",
                  id: "4UYBKD",
                  description:
                    "Paragraph two of the _examples of contracts_ section of the _digital services contracting questionnaire_",
                })}
              </p>
              <ul data-h2-margin-top="base(x.5)">
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "professional services contract for cyber security assessment",
                    id: "Vbl9/L",
                    description:
                      "An example in the _examples of contracts_ section of the _digital services contracting questionnaire_",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "a sole source contract for a consulting firm to conduct user research on a digital product",
                    id: "hl4QA9",
                    description:
                      "An example in the _examples of contracts_ section of the _digital services contracting questionnaire_",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "a supply arrangement for a supplier to build a digital application",
                    id: "qQjLqa",
                    description:
                      "An example in the _examples of contracts_ section of the _digital services contracting questionnaire_",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "a contract bringing in consultants to conduct service design for a digital service",
                    id: "ONrdDg",
                    description:
                      "An example in the _examples of contracts_ section of the _digital services contracting questionnaire_",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "a competitive contract to bring in multiple software developers for surge capacity",
                    id: "KsRa41",
                    description:
                      "An example in the _examples of contracts_ section of the _digital services contracting questionnaire_",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "an amendment or extension to a contract for software testing",
                    id: "Ds7ONS",
                    description:
                      "An example in the _examples of contracts_ section of the _digital services contracting questionnaire_",
                  })}
                </li>
              </ul>
              <p data-h2-margin-top="base(x.5)">
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "If there is uncertainty on whether this questionnaire is required for a specific type of contract, contact <link>GCTalentGC@tbs-sct.gc.ca</link> for more information.",
                    id: "zXzQhc",
                    description:
                      "Paragraph three of the _examples of contracts_ section of the _digital services contracting questionnaire_",
                  },
                  {
                    link: (text: React.ReactNode) =>
                      buildExternalLink(
                        "mailto:GCTalentGC@tbs-sct.gc.ca",
                        text,
                      ),
                  },
                )}
              </p>
              <p data-h2-margin-top="base(x.5)">
                <AnchorLink id={PAGE_SECTION_ID.REQUIREMENTS}>
                  {intl.formatMessage({
                    defaultMessage: "Return to requirement.",
                    id: "K21f0k",
                    description:
                      "A link to return to the _requirements_ section in the _digital services contracting questionnaire_",
                  })}
                </AnchorLink>
              </p>
            </TableOfContents.Section>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </div>
    </>
  );
};

const DigitalServicesContractingQuestionnairePage = () => {
  return <DigitalServicesContractingQuestionnaire />;
};

export default DigitalServicesContractingQuestionnairePage;
