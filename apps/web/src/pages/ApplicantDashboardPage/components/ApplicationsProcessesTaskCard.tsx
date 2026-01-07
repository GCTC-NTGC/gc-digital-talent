import { useIntl } from "react-intl";
import WrenchScrewdriverIcon from "@heroicons/react/24/outline/WrenchScrewdriverIcon";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  Accordion,
  AccordionMetaData,
  TaskCard,
  wrapParens,
} from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import { isQualifiedFinalDecision } from "~/utils/poolCandidate";
import { recruitmentProcessesTitle } from "~/components/RecruitmentProcesses/utils";

import ReviewRecruitmentProcessPreviewList from "./ReviewRecruitmentProcessPreviewList";
import ReviewApplicationPreviewList from "./ReviewApplicationPreviewList";

const ApplicationsProcessesTaskCard_Fragment = graphql(/* GraphQL */ `
  fragment ApplicationsProcessesTaskCard on User {
    id
    offPlatformRecruitmentProcesses {
      ...OffPlatformRecruitmentProcessList
    }
    poolCandidates {
      ...ReviewApplicationPreviewList
      finalDecision {
        value
      }
      finalDecisionAt
    }
    ...ReviewRecruitmentProcessPreviewList
  }
`);

interface ApplicationsProcessesTaskCardProps {
  applicationsProcessesTaskCardQuery: FragmentType<
    typeof ApplicationsProcessesTaskCard_Fragment
  >;
}

const ApplicationsProcessesTaskCard = ({
  applicationsProcessesTaskCardQuery,
}: ApplicationsProcessesTaskCardProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const applicationsProcessesTaskCardFragment = getFragment(
    ApplicationsProcessesTaskCard_Fragment,
    applicationsProcessesTaskCardQuery,
  );

  const jobApplicationsMetaData: AccordionMetaData = [
    {
      key: "browse-jobs-key",
      type: "link",
      href: paths.jobs(),
      color: "primary",
      children: <>{intl.formatMessage(navigationMessages.browseJobs)}</>,
    },
  ];

  const recruitmentProcesses = unpackMaybes(
    applicationsProcessesTaskCardFragment?.poolCandidates,
  );
  const recruitmentProcessesFiltered = recruitmentProcesses.filter(
    (recruitmentProcess) =>
      recruitmentProcess.finalDecisionAt &&
      isQualifiedFinalDecision(recruitmentProcess.finalDecision?.value),
  ); // filter for qualified recruitment processes

  const offPlatformProcesses = unpackMaybes(
    applicationsProcessesTaskCardFragment?.offPlatformRecruitmentProcesses,
  );

  return (
    <>
      <div className="flex flex-col gap-6">
        <TaskCard.Root
          icon={WrenchScrewdriverIcon}
          title={intl.formatMessage({
            defaultMessage: "Applications and processes",
            id: "hhNBq8",
            description: "Card title for Applications and processes",
          })}
          headingColor="secondary"
          headingAs="h2"
        >
          <TaskCard.Item>
            <Accordion.Root type="multiple">
              <Accordion.Item value="your_job_applications">
                <Accordion.Trigger
                  as="h3"
                  subtitle={intl.formatMessage({
                    defaultMessage:
                      "Apply for a job, continue your drafts, or track your submitted applications as they move through the assessment process.",
                    id: "pDqhbX",
                    description:
                      "Subtitle explaining job applications expandable within applications and processes card",
                  })}
                >
                  {intl.formatMessage({
                    defaultMessage: "Job applications",
                    id: "aBGEsG",
                    description: "Job applications expandable",
                  })}
                  <span className="ml-1">
                    {wrapParens(recruitmentProcesses?.length ?? 0)}
                  </span>
                </Accordion.Trigger>
                <Accordion.MetaData metadata={jobApplicationsMetaData} />
                <Accordion.Content>
                  <ReviewApplicationPreviewList
                    applicationsQuery={unpackMaybes(recruitmentProcesses)}
                  />
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </TaskCard.Item>
          <TaskCard.Item>
            <Accordion.Root type="multiple">
              <Accordion.Item value="your_recruitment_processes">
                <Accordion.Trigger
                  as="h3"
                  subtitle={intl.formatMessage({
                    defaultMessage:
                      "Successful applications admit you into recruitment processes which will automatically appear here. Select a process in this list to view its details or update your availability for opportunities.",
                    id: "ogWg7U",
                    description:
                      "Subtitle explaining Recruitment processes expandable within applications and processes card",
                  })}
                >
                  {intl.formatMessage(recruitmentProcessesTitle, {
                    numOfProcesses:
                      recruitmentProcessesFiltered.length +
                      offPlatformProcesses.length,
                  })}
                </Accordion.Trigger>
                <Accordion.Content>
                  <ReviewRecruitmentProcessPreviewList
                    recruitmentProcessesQuery={
                      applicationsProcessesTaskCardFragment
                    }
                  />
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </TaskCard.Item>
        </TaskCard.Root>
      </div>
    </>
  );
};

export default ApplicationsProcessesTaskCard;
