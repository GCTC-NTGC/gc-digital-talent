import React from "react";
import { useIntl } from "react-intl";

import { Heading, ScrollToLink, TableOfContents } from "@gc-digital-talent/ui";

import { getSectionTitle, PAGE_SECTION_ID } from "../navigation";
import { buildExternalLink } from "../util";

const ExamplesOfContractsSection = () => {
  const intl = useIntl();
  return (
    <TableOfContents.Section
      id={PAGE_SECTION_ID.EXAMPLES_OF_CONTRACTS}
      data-h2-padding-top="base(x2)"
    >
      <Heading data-h2-margin="base(0, 0, x1, 0)" level="h2">
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
              buildExternalLink("mailto:GCTalentGC@tbs-sct.gc.ca", text),
          },
        )}
      </p>
      <p data-h2-margin-top="base(x.5)">
        <ScrollToLink to={PAGE_SECTION_ID.REQUIREMENTS}>
          {intl.formatMessage({
            defaultMessage: "Return to requirement.",
            id: "K21f0k",
            description:
              "A link to return to the _requirements_ section in the _digital services contracting questionnaire_",
          })}
        </ScrollToLink>
      </p>
    </TableOfContents.Section>
  );
};

export default ExamplesOfContractsSection;
