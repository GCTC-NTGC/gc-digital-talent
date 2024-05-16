import { useIntl } from "react-intl";

import { Accordion } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { GenericJobTitle } from "@gc-digital-talent/graphql";

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
      <Accordion.Trigger as="h3">
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
      </Accordion.Trigger>
      <Accordion.Content>
        <ClassificationDefinition name={genericJobTitle.key} />
      </Accordion.Content>
    </Accordion.Item>
  );
};

export default GenericJobTitleAccordion;
