import { useIntl } from "react-intl";
import WrenchScrewdriverIcon from "@heroicons/react/24/outline/WrenchScrewdriverIcon";
import { useState } from "react";

import type { FragmentType } from "@gc-digital-talent/graphql";
import {
  CandidateStatus,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import type { AccordionMetaData } from "@gc-digital-talent/ui";
import { Accordion, TaskCard, wrapParens } from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import { recruitmentProcessesTitle } from "~/components/RecruitmentProcesses/utils";

import ReviewRecruitmentProcessPreviewList from "./ReviewRecruitmentProcessPreviewList";
import ReviewApplicationPreviewList from "./ReviewApplicationPreviewList";

const ACCORDION_ID = {
  RECRUITMENT_PROCESSES: "your_recruitment_processes",
  JOB_APPLICATIONS: "your_job_applications",
} as const;

const ApplicationsProcessesTaskCard_Fragment = graphql(/* GraphQL */ `
  fragment ApplicationsProcessesTaskCard on User {
    id
    offPlatformRecruitmentProcesses {
      ...OffPlatformRecruitmentProcessList
    }
    poolCandidates {
      ...ReviewApplicationPreviewList
      applicationStatusData {
        candidateStatus {
          value
        }
      }
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
  const [
    recruitmentProcessesAccordionValue,
    setRecruitmentProcessesAccordionValue,
  ] = useState<string>("");
  const [jobApplicationsAccordionValue, setJobApplicationsAccordionValue] =
    useState<string>("");

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
    ({ applicationStatusData }) =>
      applicationStatusData?.candidateStatus?.value ===
      CandidateStatus.Qualified,
  ); // filter for qualified recruitment processes

  const offPlatformProcesses = unpackMaybes(
    applicationsProcessesTaskCardFragment?.offPlatformRecruitmentProcesses,
  );

  const isAcccordionOpen =
    recruitmentProcessesAccordionValue === "" &&
    jobApplicationsAccordionValue === "";
  const handleToggleAccordions = () => {
    if (isAcccordionOpen) {
      setRecruitmentProcessesAccordionValue(ACCORDION_ID.RECRUITMENT_PROCESSES);
      setJobApplicationsAccordionValue(ACCORDION_ID.JOB_APPLICATIONS);
    } else {
      setRecruitmentProcessesAccordionValue("");
      setJobApplicationsAccordionValue("");
    }
  };

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
          action={{
            label: isAcccordionOpen
              ? intl.formatMessage({
                  defaultMessage:
                    "Expand all<hidden> applications and processes sections</hidden>",
                  id: "Bq4a4U",
                  description:
                    "Button text to show all applications and processes sections",
                })
              : intl.formatMessage({
                  defaultMessage:
                    "Collapse all<hidden> applications and processes sections</hidden>",
                  id: "K1bWGG",
                  description:
                    "Button text to hide all applications and processes sections",
                }),
            onClick: handleToggleAccordions,
          }}
        >
          <TaskCard.Item>
            <Accordion.Root
              type="single"
              collapsible
              value={jobApplicationsAccordionValue}
              onValueChange={setJobApplicationsAccordionValue}
            >
              <Accordion.Item value={ACCORDION_ID.JOB_APPLICATIONS}>
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
            <Accordion.Root
              type="single"
              collapsible
              value={recruitmentProcessesAccordionValue}
              onValueChange={setRecruitmentProcessesAccordionValue}
            >
              <Accordion.Item value={ACCORDION_ID.RECRUITMENT_PROCESSES}>
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
