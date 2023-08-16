import React from "react";
import { useIntl } from "react-intl";
import LightBulbIcon from "@heroicons/react/24/outline/LightBulbIcon";

import { Heading, ScrollToLink, TableOfContents } from "@gc-digital-talent/ui";

import { Checkbox } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { getSectionTitle, PAGE_SECTION_ID } from "../navigation";
import { buildExternalLink } from "../util";

const PreambleSection = () => {
  const intl = useIntl();
  return (
    <>
      <TableOfContents.Section
        id={PAGE_SECTION_ID.PREAMBLE}
        data-h2-padding-top="base(x2)"
      >
        <Heading Icon={LightBulbIcon} level="h2" color="primary">
          {intl.formatMessage(getSectionTitle(PAGE_SECTION_ID.PREAMBLE))}
        </Heading>
      </TableOfContents.Section>
      <TableOfContents.Section
        id={PAGE_SECTION_ID.ROLE_OF_THE_CIO}
        data-h2-padding-top="base(x1)"
      >
        <Heading data-h2-margin="base(0, 0, x1, 0)" level="h3">
          {intl.formatMessage(getSectionTitle(PAGE_SECTION_ID.ROLE_OF_THE_CIO))}
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
              defaultMessage: "Developing career pathways for digital talent",
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
          {intl.formatMessage(getSectionTitle(PAGE_SECTION_ID.REQUIREMENTS))}
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
          <ScrollToLink to={PAGE_SECTION_ID.EXAMPLES_OF_CONTRACTS}>
            {intl.formatMessage({
              defaultMessage:
                'Click here for examples of "contracts for digital services" where this requirement applies.',
              id: "I8y5Fz",
              description:
                "Paragraph five of the _requirements_ section of the _digital services contracting questionnaire_",
            })}
          </ScrollToLink>
        </p>
        <div data-h2-margin-top="base(x1)">
          <Checkbox
            boundingBox
            boundingBoxLabel={intl.formatMessage({
              defaultMessage: "Preamble confirmation",
              id: "b8XLn5",
              description:
                "Preamble confirmation label of the _digital services contracting questionnaire_",
            })}
            id="readPreamble"
            label={intl.formatMessage({
              defaultMessage: "I have read the Preamble.",
              id: "AERHjn",
              description:
                "Preamble confirmation statement of the _digital services contracting questionnaire_",
            })}
            name="readPreamble"
            rules={{ required: intl.formatMessage(errorMessages.required) }}
          />
        </div>
      </TableOfContents.Section>
    </>
  );
};

export default PreambleSection;
