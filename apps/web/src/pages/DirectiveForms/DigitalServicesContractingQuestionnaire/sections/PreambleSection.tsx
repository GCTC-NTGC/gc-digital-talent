import React from "react";
import { useIntl } from "react-intl";
import LightBulbIcon from "@heroicons/react/24/outline/LightBulbIcon";
import ChevronRightIcon from "@heroicons/react/20/solid/ChevronRightIcon";

import {
  Button,
  Collapsible,
  Heading,
  Separator,
  TableOfContents,
} from "@gc-digital-talent/ui";
import { Checkbox } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";

import { getSectionTitle, PAGE_SECTION_ID } from "../navigation";
import { buildExternalLink, getDirectiveUrl } from "../../util";
import useLabels from "../useLabels";

const PreambleSection = () => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const labels = useLabels();
  const paths = useRoutes();
  return (
    <>
      <TableOfContents.Section
        id={PAGE_SECTION_ID.PREAMBLE}
        data-h2-padding-top="base(x2)"
      >
        <Heading
          Icon={LightBulbIcon}
          level="h2"
          size="h3"
          color="primary"
          data-h2-font-weight="base(400)"
        >
          {intl.formatMessage(getSectionTitle(PAGE_SECTION_ID.PREAMBLE))}
        </Heading>
      </TableOfContents.Section>
      <TableOfContents.Section id={PAGE_SECTION_ID.SUPPORTING_THE_COMMUNITY}>
        <Heading
          data-h2-margin="base(x3, 0, x1, 0)"
          level="h3"
          size="h4"
          className="font-bold"
        >
          {intl.formatMessage(
            getSectionTitle(PAGE_SECTION_ID.SUPPORTING_THE_COMMUNITY),
          )}
        </Heading>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "The Office of the Chief Information Officer of Canada (OCIO) of the Treasury Board of Canada Secretariat (TBS) is responsible for the sustainability and development of the Government of Canada (GC) digital community, including:",
            id: "maMA3/",
            description:
              "Introduction to the _supporting the community_ section of the _digital services contracting questionnaire_",
          })}
        </p>
        <ul data-h2-margin-top="base(x.5)">
          <li>
            {intl.formatMessage(
              {
                defaultMessage:
                  "Developing a <link>generic suite of HR products</link> (accessible on the GC network only), such as standardized job descriptions, for the digital community",
                id: "cLwQgK",
                description:
                  "An OCIO role in the _supporting the community_ section of the _digital services contracting questionnaire_",
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
              id: "hvG6bH",
              description:
                "An OCIO role in the _supporting the community_ section of the _digital services contracting questionnaire_",
            })}
          </li>
          <li data-h2-margin-top="base(x.25)">
            {intl.formatMessage({
              defaultMessage:
                "Implementing and supporting initiatives to advance diversity, equity, and inclusion in the digital community",
              id: "lDSa8Q",
              description:
                "An OCIO role in the _supporting the community_ section of the _digital services contracting questionnaire_",
            })}
          </li>
          <li data-h2-margin-top="base(x.25)">
            {intl.formatMessage({
              defaultMessage:
                "Maintaining pools of digital talent accessible by all departments",
              id: "uvYhZD",
              description:
                "An OCIO role in the _supporting the community_ section of the _digital services contracting questionnaire_",
            })}
          </li>
          <li data-h2-margin-top="base(x.25)">
            {intl.formatMessage({
              defaultMessage: "Developing career pathways for digital talent",
              id: "pBAHrf",
              description:
                "An OCIO role in the _supporting the community_ section of the _digital services contracting questionnaire_",
            })}
          </li>
          <li data-h2-margin-top="base(x.25)">
            {intl.formatMessage({
              defaultMessage:
                "Identifying and coordinating government-wide training and upskilling opportunities",
              id: "qsuIJa",
              description:
                "An OCIO role in the _supporting the community_ section of the _digital services contracting questionnaire_",
            })}
          </li>
        </ul>
      </TableOfContents.Section>
      <TableOfContents.Section id={PAGE_SECTION_ID.WHY_COLLECT}>
        <Heading
          data-h2-margin="base(x3, 0, x1, 0)"
          level="h3"
          size="h4"
          className="font-bold"
        >
          {intl.formatMessage(getSectionTitle(PAGE_SECTION_ID.WHY_COLLECT))}
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
                "Creating a government-wide pool of pre-qualified digital talent, informed by departmental needs",
              id: "bDnBF9",
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
      <TableOfContents.Section id={PAGE_SECTION_ID.REQUIREMENTS}>
        <Heading
          data-h2-margin="base(x3, 0, x1, 0)"
          level="h3"
          size="h4"
          className="font-bold"
        >
          {intl.formatMessage(getSectionTitle(PAGE_SECTION_ID.REQUIREMENTS))}
        </Heading>
        <p>
          {intl.formatMessage(
            {
              defaultMessage:
                "As set out in the <link>Mandatory Procedures on Digital Talent</link>, the business owner is responsible for completing and submitting the Digital Services Contracting Questionnaire if they are procuring digital services.",
              id: "xPaVvi",
              description:
                "Paragraph one of the _requirements_ section of the _digital services contracting questionnaire_",
            },
            {
              link: (chunks: React.ReactNode) =>
                buildExternalLink(getDirectiveUrl(intl), chunks),
            },
          )}
        </p>
        <p data-h2-margin-top="base(x.5)">
          {intl.formatMessage(
            {
              defaultMessage:
                "Prior to concluding that a shortage of available or qualified digital talent is the primary rationale for procurement, the business owner must confirm with OCIO that there is no available pre-qualified talent in an <link>OCIO-coordinated talent pool</link> that could meet the need in the timeframe provided.",
              id: "YZMi8D",
              description:
                "Paragraph two of the _requirements_ section of the _digital services contracting questionnaire_",
            },
            {
              link: (chunks: React.ReactNode) =>
                buildExternalLink(paths.search(), chunks),
            },
          )}
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
        <div data-h2-margin-top="base(x1.25)">
          <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
            <Collapsible.Trigger asChild>
              <Button
                type="button"
                mode="inline"
                color="black"
                data-h2-transform="base:children[.CollapsibleChevron__Icon](rotate(0deg)) base:selectors[[data-state='open']]:children[.CollapsibleChevron__Icon](rotate(90deg))"
                aria-label={
                  isOpen
                    ? intl
                        .formatMessage({
                          defaultMessage:
                            'Hide examples of "contracts for digital services" where this requirement applies',
                          id: "CRnoE8",
                          description:
                            "Button text to hide a specific qualified recruitment cards's skill assessments",
                        })
                        .toString()
                    : intl
                        .formatMessage({
                          defaultMessage:
                            'Show examples of "contracts for digital services" where this requirement applies',
                          id: "t7T/Zv",
                          description:
                            "Button text to show a specific qualified recruitment cards's skill assessments",
                        })
                        .toString()
                }
              >
                <span
                  className="flex"
                  data-h2-align-items="base(center)"
                  data-h2-gap="base(0 x.25)"
                >
                  <ChevronRightIcon
                    data-h2-height="base(x1)"
                    data-h2-width="base(x1)"
                    className="CollapsibleChevron__Icon"
                  />
                  <span>
                    {isOpen
                      ? intl.formatMessage({
                          defaultMessage:
                            'Hide examples of "contracts for digital services" where this requirement applies',
                          id: "CRnoE8",
                          description:
                            "Button text to hide a specific qualified recruitment cards's skill assessments",
                        })
                      : intl.formatMessage({
                          defaultMessage:
                            'Show examples of "contracts for digital services" where this requirement applies',
                          id: "t7T/Zv",
                          description:
                            "Button text to show a specific qualified recruitment cards's skill assessments",
                        })}
                  </span>
                </span>
              </Button>
            </Collapsible.Trigger>
            <Collapsible.Content data-h2-padding-left="base(x1.5)">
              <Separator space="sm" />
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
            </Collapsible.Content>
          </Collapsible.Root>
        </div>
        <div className="mt-6">
          <Checkbox
            boundingBox
            boundingBoxLabel={intl.formatMessage({
              defaultMessage: "Preamble confirmation",
              id: "b8XLn5",
              description:
                "Preamble confirmation label of the _digital services contracting questionnaire_",
            })}
            id="readPreamble"
            name="readPreamble"
            label={labels.readPreamble}
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
        </div>
      </TableOfContents.Section>
    </>
  );
};

export default PreambleSection;
