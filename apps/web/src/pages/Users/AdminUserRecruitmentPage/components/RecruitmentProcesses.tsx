import ClipboardIcon from "@heroicons/react/24/outline/ClipboardIcon";
import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { TableOfContents } from "@gc-digital-talent/ui";

import PoolStatusTable from "~/components/PoolStatusTable/PoolStatusTable";

const AdminRecruitmentProcesses_Fragment = graphql(/** GraphQL */ `
  fragment AdminRecruitmentProcesses on User {
    ...PoolStatusTable
  }
`);

interface RecruitmentProcessesProps {
  query: FragmentType<typeof AdminRecruitmentProcesses_Fragment>;
}

export const JOB_APPLICATIONS_ID = "job-applications";

const RecruitmentProcesses = ({ query }: RecruitmentProcessesProps) => {
  const intl = useIntl();
  const user = getFragment(AdminRecruitmentProcesses_Fragment, query);

  return (
    <TableOfContents.Section id={JOB_APPLICATIONS_ID} className="mb-18">
      <TableOfContents.Heading
        icon={ClipboardIcon}
        color="secondary"
        className="mt-0 mb-6"
      >
        {intl.formatMessage({
          defaultMessage: "Job applications",
          id: "aBGEsG",
          description: "Job applications expandable",
        })}
      </TableOfContents.Heading>
      <PoolStatusTable userQuery={user} />
    </TableOfContents.Section>
  );
};

export default RecruitmentProcesses;
