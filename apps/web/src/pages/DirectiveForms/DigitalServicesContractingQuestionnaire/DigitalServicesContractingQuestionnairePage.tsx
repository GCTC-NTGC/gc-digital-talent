import React from "react";
import { defineMessage, useIntl } from "react-intl";
import FlagIcon from "@heroicons/react/24/outline/FlagIcon";
import LightBulbIcon from "@heroicons/react/24/outline/LightBulbIcon";
import ListBulletIcon from "@heroicons/react/24/outline/ListBulletIcon";

import { Heading, Link, TableOfContents } from "@gc-digital-talent/ui";

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

function buildLink(href: string, chunks: React.ReactNode): React.ReactElement {
  return <Link href={href}>{chunks}</Link>;
}

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
          id: "9zxAKG",
          description:
            "Subtitle for the digital services contracting questionnaire page",
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
                <TableOfContents.List>
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
                  id: "sBVNgZ",
                  description:
                    "Paragraph one of the instructions section of the digital services contracting questionnaire",
                })}
              </p>
              <p data-h2-margin-top="base(x.5)">
                {intl.formatMessage(
                  {
                    defaultMessage:
                      "All questions in this questionnaire are marked as required (<red>*</red>) unless otherwise specified. A copy of your submission will be emailed to you upon completion. Please note that you can also optionally download a blank copy of this form and submit it to the <link>GC Digital Talent mailbox</link> through email.",
                    id: "V1fEzm",
                    description:
                      "Paragraph two of the instructions section of the digital services contracting questionnaire",
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
                    id: "JTarzr",
                    description:
                      "Paragraph three of the instructions section of the digital services contracting questionnaire",
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
              data-h2-padding-top="base(x2)"
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
                  id: "wGjHIZ",
                  description:
                    "Introduction to the role of the cio section of the digital services contracting questionnaire",
                })}
              </p>
              <ul data-h2-margin-top="base(x.5)">
                <li>
                  {intl.formatMessage(
                    {
                      defaultMessage:
                        "Developing <link>generic suite of HR products</link> (accessible on GC network only), such as standardized job descriptions, for the digital community",
                      id: "eEoeVf",
                      description:
                        "An OCIO role in the role of the cio section of the digital services contracting questionnaire",
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
                    id: "AvNfPf",
                    description:
                      "An OCIO role in the role of the cio section of the digital services contracting questionnaire",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "Implementing and supporting initiatives to advance diversity, equity and inclusion in the digital community",
                    id: "Vmb9rg",
                    description:
                      "An OCIO role in the role of the cio section of the digital services contracting questionnaire",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "Maintaining pools of digital talent accessible by all departments",
                    id: "EFfUhx",
                    description:
                      "An OCIO role in the role of the cio section of the digital services contracting questionnaire",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "Developing career pathways for digital talent",
                    id: "z+oA5r",
                    description:
                      "An OCIO role in the role of the cio section of the digital services contracting questionnaire",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "Identifying and coordinating government-wide training and upskilling opportunities",
                    id: "13qDnO",
                    description:
                      "An OCIO role in the role of the cio section of the digital services contracting questionnaire",
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
                  id: "Q0bIwJ",
                  description:
                    "Paragraph one of the introduction to the _why collect this data_ section of the digital services contracting questionnaire",
                })}
              </p>
              <p data-h2-margin-top="base(x.5)">
                {intl.formatMessage({
                  defaultMessage:
                    "Informed by this data, OCIO can work with departments and agencies on government-wide strategies and initiatives to develop the GC digital community, including:",
                  id: "JIVMrq",
                  description:
                    "Paragraph two of the introduction to the _why collect this data_ section of the digital services contracting questionnaire",
                })}
              </p>
              <ul data-h2-margin-top="base(x.5)">
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "Creating GC-wide pool of prequalified digital talent, informed by departmental needs",
                    id: "ZwDw0q",
                    description:
                      "A reason to collect this data in the _why collect this data_ section of the digital services contracting questionnaire",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "Advancing the coordination of training and upskilling opportunities for the GC digital community",
                    id: "baR2Fp",
                    description:
                      "A reason to collect this data in the _why collect this data_ section of the digital services contracting questionnaire",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "Identifying potential systemic challenges and barriers in sourcing digital talent",
                    id: "W3mCZr",
                    description:
                      "A reason to collect this data in the _why collect this data_ section of the digital services contracting questionnaire",
                  })}
                </li>
                <li data-h2-margin-top="base(x.25)">
                  {intl.formatMessage({
                    defaultMessage:
                      "Working with mandate authorities across the GC to identify solutions and best practices",
                    id: "K2krf9",
                    description:
                      "A reason to collect this data in the _why collect this data_ section of the digital services contracting questionnaire",
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
                  id: "vCh4ZD",
                  description:
                    "Paragraph one of the _requirements_ section of the digital services contracting questionnaire",
                })}
              </p>
              <p data-h2-margin-top="base(x.5)">
                {intl.formatMessage({
                  defaultMessage:
                    "Prior to concluding that a shortage of available or qualified digital talent is the primary rationale for procurement, the business owner must confirm with OCIO that there is no available pre-qualified talent in an OCIO-coordinated talent pool that could meet the need in the timeframe provided.",
                  id: "T1BZ3s",
                  description:
                    "Paragraph two of the _requirements_ section of the digital services contracting questionnaire",
                })}
              </p>
              <p data-h2-margin-top="base(x.5)">
                {intl.formatMessage({
                  defaultMessage:
                    "The completed questionnaire needs to be submitted at the time when a contract for digital services (including call-up of an established contracting vehicle) is submitted to departmental procurement authorities for processing.",
                  id: "s5XJ6/",
                  description:
                    "Paragraph three of the _requirements_ section of the digital services contracting questionnaire",
                })}
              </p>
              <p data-h2-margin-top="base(x.5)">
                {intl.formatMessage({
                  defaultMessage:
                    "This is a reporting requirement only and does not impose any additional approval steps by OCIO. In other words, no OCIO approval is required to initiate a procurement process for digital services.",
                  id: "GIw21W",
                  description:
                    "Paragraph four of the _requirements_ section of the digital services contracting questionnaire",
                })}
              </p>
              <p data-h2-margin-top="base(x.5)">
                {intl.formatMessage(
                  {
                    defaultMessage:
                      '<link>Click here for examples of "contracts for digital services" where this requirement applies.</link>',
                    id: "2ItcXN",
                    description:
                      "Paragraph five of the _requirements_ section of the digital services contracting questionnaire",
                  },
                  {
                    link: (text: React.ReactNode) => buildLink("#", text),
                  },
                )}
              </p>
            </TableOfContents.Section>
            <TableOfContents.Section
              id={PAGE_SECTION_ID.QUESTIONNAIRE}
              data-h2-padding-top="base(x2)"
            >
              <Heading
                Icon={ListBulletIcon}
                size="h3"
                color="tertiary"
                data-h2-margin="base(0, 0, x1, 0)"
              >
                {intl.formatMessage(
                  getSectionTitle(PAGE_SECTION_ID.QUESTIONNAIRE),
                )}
              </Heading>
              Hello, QUESTIONNAIRE
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
