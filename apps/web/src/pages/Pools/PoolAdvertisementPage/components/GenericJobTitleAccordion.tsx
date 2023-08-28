import React from "react";
import { useIntl } from "react-intl";

import { Accordion, StandardAccordionHeader } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import { GenericJobTitle } from "~/api/generated";

import ClassificationDefinition from "./ClassificationDefinition";

interface GenericJobTitleAccordionProps {
  genericJobTitle: GenericJobTitle;
  classification: string;
}

const GenericJobTitleAccordion = ({
  genericJobTitle,
  classification,
}: GenericJobTitleAccordionProps) => {
  const intl = useIntl();

  return (
    <Accordion.Item value={genericJobTitle?.id}>
      <StandardAccordionHeader>
        {intl.formatMessage(
          {
            defaultMessage: "What does {classification} {genericTitle} mean?",
            id: "aSJ4ET",
            description:
              "Title for description of a pool advertisements classification group/level",
          },
          {
            classification,
            genericTitle: getLocalizedName(genericJobTitle.name, intl),
          },
        )}
      </StandardAccordionHeader>
      <Accordion.Content>
        <div data-h2-margin-top="base(x1)">
          <ClassificationDefinition name={genericJobTitle.key} />
        </div>
      </Accordion.Content>
    </Accordion.Item>
  );
};

export default GenericJobTitleAccordion;
