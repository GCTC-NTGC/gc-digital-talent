import { defineMessage, useIntl } from "react-intl";
import WrenchScrewdriverIcon from "@heroicons/react/24/outline/WrenchScrewdriverIcon";

import { Heading, TableOfContents } from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import AddToProcessDialog from "./AddToProcessDialog";

export const title = defineMessage({
  defaultMessage: "Recruitment tools",
  id: "hr8t+y",
  description: "Title for recruitment tools for a user",
});

export const RECRUITMENT_TOOLS_ID = "recruitment-tools";

const RecruitmentTools_Fragment = graphql(/** GraphQL */ `
  fragment RecruitmentTools on User {
    ...AddToProcessDialog
  }
`);

interface RecruitmentToolsProps {
  query: FragmentType<typeof RecruitmentTools_Fragment>;
}

const RecruitmentTools = ({ query }: RecruitmentToolsProps) => {
  const intl = useIntl();
  const user = getFragment(RecruitmentTools_Fragment, query);

  return (
    <TableOfContents.Section id={RECRUITMENT_TOOLS_ID}>
      <TableOfContents.Heading
        icon={WrenchScrewdriverIcon}
        color="secondary"
        className="mb-6"
      >
        {intl.formatMessage(title)}
      </TableOfContents.Heading>
      <p className="my-6">
        {intl.formatMessage({
          defaultMessage:
            "Users will normally apply to a recruitment process on their own. The following tools can be used to help create or manage applications in rare cases.",
          id: "5LkwLx",
          description: "Description of adding a user to a specific process",
        })}
      </p>
      <Heading level="h3" size="h6">
        {intl.formatMessage({
          defaultMessage: "Add user to recruitment process",
          id: "N7ACFf",
          description: "Title of section to add users to processes",
        })}
      </Heading>
      <p className="my-6">
        {intl.formatMessage({
          defaultMessage:
            "This will include a user in a recruitment process, but it will not fill out any application information. This means that the application snapshot, as well as all other questions and skill justifications will be empty.",
          id: "92M/Ie",
          description: "Caveats of adding a user to a process manually",
        })}
      </p>
      <AddToProcessDialog query={user} />
    </TableOfContents.Section>
  );
};

export default RecruitmentTools;
