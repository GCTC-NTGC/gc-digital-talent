import { defineMessage, useIntl } from "react-intl";
import WrenchScrewdriverIcon from "@heroicons/react/24/outline/WrenchScrewdriverIcon";
import { useState } from "react";

import { Accordion, TableOfContents } from "@gc-digital-talent/ui";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";

import CreateSpecialApplicationDialog from "./CreateSpecialApplicationDialog";

export const title = defineMessage({
  defaultMessage: "Recruitment tools",
  id: "hr8t+y",
  description: "Title for recruitment tools for a user",
});

export const RECRUITMENT_TOOLS_ID = "recruitment-tools";

type AccordionItems = "special_application" | "";

const RecruitmentTools_Fragment = graphql(/** GraphQL */ `
  fragment RecruitmentTools on User {
    ...CreateSpecialApplicationDialogUser
  }
`);

interface RecruitmentToolsProps {
  query: FragmentType<typeof RecruitmentTools_Fragment>;
}

const RecruitmentTools = ({ query }: RecruitmentToolsProps) => {
  const intl = useIntl();
  const user = getFragment(RecruitmentTools_Fragment, query);

  const [accordionOpen, setAccordionOpen] = useState<AccordionItems>("");

  return (
    <TableOfContents.Section id={RECRUITMENT_TOOLS_ID}>
      <TableOfContents.Heading
        icon={WrenchScrewdriverIcon}
        color="secondary"
        className="mb-6"
      >
        {intl.formatMessage(title)}
      </TableOfContents.Heading>
      <Accordion.Root
        mode="simple"
        type="single"
        collapsible
        value={accordionOpen}
        onValueChange={(value: AccordionItems) => setAccordionOpen(value)}
      >
        <Accordion.Item value={"special_application"}>
          <Accordion.Trigger as="h3">
            {intl.formatMessage({
              defaultMessage: "Create special application",
              id: "FJDA+9",
              description:
                "Title for creating a special application for a user",
            })}
          </Accordion.Trigger>
          <Accordion.Content>
            <p className="my-6">
              {intl.formatMessage({
                defaultMessage:
                  "This will create a draft application for a user in a recruitment process. This special application will ignore the normal deadline and employee verification requirements.",
                id: "axxGXe",
                description:
                  "Description of creating a special application for a user",
              })}
            </p>
            <CreateSpecialApplicationDialog query={user} />
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </TableOfContents.Section>
  );
};

export default RecruitmentTools;
