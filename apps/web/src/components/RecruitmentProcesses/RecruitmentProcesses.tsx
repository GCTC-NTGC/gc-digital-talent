import { useIntl } from "react-intl";

import {
  ApplicationStatus,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { Accordion } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import RecruitmentProcessPreviewList from "./RecruitmentProcessesPreviewList";
import { recruitmentProcessesTitle } from "./utils";

const RecruitmentProcesses_Fragment = graphql(/* GraphQL */ `
  fragment RecruitmentProcesses on User {
    poolCandidates {
      status {
        value
      }
      finalDecisionAt
      pool {
        id
        community {
          id
        }
      }
    }
    ...RecruitmentProcessPreviewList
  }
`);

interface RecruitmentProcessesProps {
  recruitmentProcessesQuery: FragmentType<typeof RecruitmentProcesses_Fragment>;
  sectionKey: string;
  communityId?: string;
}

const RecruitmentProcesses = ({
  recruitmentProcessesQuery,
  sectionKey,
  communityId,
}: RecruitmentProcessesProps) => {
  const intl = useIntl();
  const recruitmentProcessesFragment = getFragment(
    RecruitmentProcesses_Fragment,
    recruitmentProcessesQuery,
  );
  const recruitmentProcesses = unpackMaybes(
    recruitmentProcessesFragment.poolCandidates,
  );
  const recruitmentProcessesFiltered = recruitmentProcesses
    ? recruitmentProcesses.filter(
        ({ status }) => status?.value === ApplicationStatus.Qualified,
      )
    : []; // filter for qualified recruitment processes

  // Add additional filtering for community if communityId exists
  if (communityId) {
    recruitmentProcessesFiltered.filter(
      (recruitment) => recruitment.pool.community?.id === communityId,
    );
  }

  return (
    <>
      <Accordion.Item value={sectionKey}>
        <Accordion.Trigger
          as="h3"
          subtitle={intl.formatMessage({
            defaultMessage:
              "Processes run by your functional community in which the nominee has been qualified, as well as a list of off-platform processes the nominee has provided, if applicable.",
            id: "8YIyLK",
            description: "Subtitle for recruitment processes section",
          })}
        >
          <span className="font-normal">
            {intl.formatMessage(recruitmentProcessesTitle, {
              numOfProcesses: recruitmentProcessesFiltered.length,
            })}
          </span>
        </Accordion.Trigger>
        <Accordion.Content>
          <RecruitmentProcessPreviewList
            recruitmentProcessesQuery={recruitmentProcessesFragment}
            communityId={communityId}
          />
        </Accordion.Content>
      </Accordion.Item>
    </>
  );
};

export default RecruitmentProcesses;
