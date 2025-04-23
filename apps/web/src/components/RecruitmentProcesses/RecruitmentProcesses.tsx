import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Accordion } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { isQualifiedFinalDecision } from "~/utils/poolCandidate";

import RecruitmentProcessPreviewList from "./RecruitmentProcessesPreviewList";

const RecruitmentProcesses_Fragment = graphql(/* GraphQL */ `
  fragment RecruitmentProcesses on User {
    poolCandidates {
      finalDecision {
        value
      }
      finalDecisionAt
    }
    ...RecruitmentProcessPreviewList
  }
`);

interface RecruitmentProcessesProps {
  recruitmentProcessesQuery: FragmentType<typeof RecruitmentProcesses_Fragment>;
  sectionKey: string;
}

const RecruitmentProcesses = ({
  recruitmentProcessesQuery,
  sectionKey,
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
        (recruitmentProcess) =>
          recruitmentProcess.finalDecisionAt &&
          isQualifiedFinalDecision(recruitmentProcess.finalDecision?.value),
      )
    : []; // filter for qualified recruitment processes

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
          {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
          {`${intl.formatMessage({
            defaultMessage: "Recruitment processes",
            id: "wPDwMb",
            description: "Recruitment processes expandable",
          })} (${recruitmentProcessesFiltered?.length ?? 0})`}
        </Accordion.Trigger>
        <Accordion.Content>
          <RecruitmentProcessPreviewList
            recruitmentProcessesQuery={recruitmentProcessesFragment}
          />
        </Accordion.Content>
      </Accordion.Item>
    </>
  );
};

export default RecruitmentProcesses;
