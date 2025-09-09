import GlobeAltIcon from "@heroicons/react/24/outline/GlobeAltIcon";
import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { Card, TableOfContents } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import OffPlatformRecruitmentProcessList from "~/components/RecruitmentProcesses/OffPlatformRecruitmentProcessList";

const AdminOffPlatformRecruitmentProcesses_Fragment = graphql(/** GraphQL */ `
  fragment AdminOffPlatformRecruitmentProcesses on User {
    offPlatformRecruitmentProcesses {
      ...OffPlatformRecruitmentProcessList
    }
  }
`);

interface AdminOffPlatformRecruitmentProcessesProps {
  query: FragmentType<typeof AdminOffPlatformRecruitmentProcesses_Fragment>;
}

export const OFF_PLATFORM_RECRUITMENT_PROCESSES_ID =
  "off-platform-recruitment-processes";

const AdminOffPlatformRecruitmentProcesses = ({
  query,
}: AdminOffPlatformRecruitmentProcessesProps) => {
  const intl = useIntl();
  const user = getFragment(
    AdminOffPlatformRecruitmentProcesses_Fragment,
    query,
  );
  const processes = unpackMaybes(user.offPlatformRecruitmentProcesses);

  return (
    <TableOfContents.Section
      id={OFF_PLATFORM_RECRUITMENT_PROCESSES_ID}
      className="mb-18"
    >
      <TableOfContents.Heading
        icon={GlobeAltIcon}
        color="secondary"
        className="mt-0 mb-6"
      >
        {intl.formatMessage(navigationMessages.offPlatformRecruitmentProcesses)}
      </TableOfContents.Heading>
      <p className="my-6">
        {intl.formatMessage({
          defaultMessage:
            "Recruitment processes that the user has qualified in on other Government of Canada platforms. Note that this information is provided by the nominee without verification. Please ensure you verify the validity of process information before using it for hiring or placement purposes.",
          id: "i28Yrb",
          description:
            "Description of a users off-platform recruitment processes",
        })}
      </p>
      {processes.length > 0 ? (
        <Card className="overflow-hidden p-0 [&>ul]:mb-0">
          <OffPlatformRecruitmentProcessList processesQuery={processes} />
        </Card>
      ) : null}
    </TableOfContents.Section>
  );
};

export default AdminOffPlatformRecruitmentProcesses;
