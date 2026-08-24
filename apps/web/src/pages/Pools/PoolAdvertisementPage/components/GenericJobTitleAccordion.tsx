import { useIntl } from "react-intl";

import { Accordion } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";

import ClassificationDefinition from "./ClassificationDefinition";

export const GenericJobTitleAccordion_Fragment = graphql(/* GraphQL */ `
  fragment GenericJobTitleAccordion on GenericJobTitle {
    id
    key
    name {
      localized
    }
  }
`);

interface GenericJobTitleAccordionProps {
  genericJobTitleQuery: FragmentType<typeof GenericJobTitleAccordion_Fragment>;
  classification: string;
}

const GenericJobTitleAccordion = ({
  genericJobTitleQuery,
  classification,
}: GenericJobTitleAccordionProps) => {
  const intl = useIntl();
  const genericJobTitle = getFragment(
    GenericJobTitleAccordion_Fragment,
    genericJobTitleQuery,
  );

  return (
    <Accordion.Item value={genericJobTitle.id}>
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
            genericTitle:
              genericJobTitle.name?.localized ??
              intl.formatMessage(commonMessages.notAvailable),
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
