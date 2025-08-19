import ClipboardIcon from "@heroicons/react/24/outline/ClipboardIcon";
import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { TableOfContents } from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";

import PoolStatusTable from "~/components/PoolStatusTable/PoolStatusTable";

const AdminRecruitmentProcesses_Fragment = graphql(/** GraphQL */ `
  fragment AdminRecruitmentProcesses on User {
    ...PoolStatusTable
  }
`);

interface RecrtuimentProcessesProps {
  query: FragmentType<typeof AdminRecruitmentProcesses_Fragment>;
}

export const RECRUITMENT_PROCESSES_ID = "recrtuiment-processes";

const RecruitmentProcesses = ({ query }: RecrtuimentProcessesProps) => {
  const intl = useIntl();
  const user = getFragment(AdminRecruitmentProcesses_Fragment, query);

  return (
    <TableOfContents.Section id={RECRUITMENT_PROCESSES_ID} className="mb-18">
      <TableOfContents.Heading
        icon={ClipboardIcon}
        color="secondary"
        className="mt-0 mb-6"
      >
        {intl.formatMessage(navigationMessages.recruitmentProcesses)}
      </TableOfContents.Heading>
      <PoolStatusTable userQuery={user} />
    </TableOfContents.Section>
  );
};

export default RecruitmentProcesses;
