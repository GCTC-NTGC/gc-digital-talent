import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { PreviewList, PreviewMetaData, Well } from "@gc-digital-talent/ui";

import { getClassificationName } from "~/utils/poolUtils";
import {
  getQualifiedRecruitmentStatusChip,
  isQualifiedFinalDecision,
} from "~/utils/poolCandidate";

import { RecruitmentDate } from "./MetadataDate";
import ReviewRecruitmentProcessDialog from "./ReviewRecruitmentProcessDialog";

const ReviewRecruitmentProcessPreviewList_Fragment = graphql(/* GraphQL */ `
  fragment ReviewRecruitmentProcessPreviewList on PoolCandidate {
    ...ReviewRecruitmentProcessDialog
    id
    finalDecisionAt
    suspendedAt
    removedAt
    placedAt
    finalDecision {
      value
    }
    pool {
      id
      name {
        localized
      }
      classification {
        group
        level
        minSalary
        maxSalary
      }
    }
  }
`);

interface ReviewRecruitmentProcessPreviewListProps {
  recruitmentProcessesQuery: FragmentType<
    typeof ReviewRecruitmentProcessPreviewList_Fragment
  >[];
}

const ReviewRecruitmentProcessPreviewList = ({
  recruitmentProcessesQuery,
}: ReviewRecruitmentProcessPreviewListProps) => {
  const intl = useIntl();

  const recruitmentProcesses = getFragment(
    ReviewRecruitmentProcessPreviewList_Fragment,
    recruitmentProcessesQuery,
  ).filter(
    (recruitmentProcess) =>
      recruitmentProcess.finalDecisionAt &&
      isQualifiedFinalDecision(recruitmentProcess.finalDecision?.value),
  ); // filter for qualified recruitment processes

  return (
    <>
      {recruitmentProcesses.length ? (
        <PreviewList.Root>
          {recruitmentProcesses.map((recruitmentProcess) => {
            const { id, pool, finalDecisionAt, removedAt } = recruitmentProcess;

            const status = getQualifiedRecruitmentStatusChip(
              recruitmentProcess.suspendedAt,
              recruitmentProcess.placedAt,
              intl,
            );

            const applicationMetadata: PreviewMetaData[] = [
              {
                key: "status",
                type: "chip",
                color: status.color,
                children: status.label,
              },
              {
                key: "classification",
                type: "text",
                children: pool?.classification
                  ? getClassificationName(pool?.classification, intl)
                  : intl.formatMessage(commonMessages.notFound),
              },
              {
                key: "date",
                type: "text",
                children: (
                  <RecruitmentDate
                    finalDecisionAt={finalDecisionAt}
                    removedAt={removedAt}
                    status={status.value}
                  />
                ),
              },
            ];

            return (
              <PreviewList.Item
                key={id}
                title={
                  pool.name?.localized ??
                  intl.formatMessage(commonMessages.notFound)
                }
                metaData={applicationMetadata}
                action={
                  <ReviewRecruitmentProcessDialog
                    recruitmentProcessQuery={recruitmentProcess}
                  />
                }
                headingAs="h4"
              />
            );
          })}
        </PreviewList.Root>
      ) : (
        <Well data-h2-text-align="base(center)">
          <p data-h2-font-weight="base(bold)">
            {intl.formatMessage({
              defaultMessage: "You don't have any applications at the moment.",
              id: "ok2eWp",
              description: "Title for notice when there are no applications",
            })}
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage: `You can start a new application by visiting the "Browse jobs" page and selecting an opportunity.`,
              id: "0K7Upw",
              description: "Body for notice when there are no applications",
            })}
          </p>
        </Well>
      )}
    </>
  );
};

export default ReviewRecruitmentProcessPreviewList;
