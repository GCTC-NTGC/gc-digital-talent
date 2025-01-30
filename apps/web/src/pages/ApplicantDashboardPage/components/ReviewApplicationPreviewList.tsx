import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { PreviewList, PreviewMetaData, Well } from "@gc-digital-talent/ui";

import { getClassificationName } from "~/utils/poolUtils";
import { getApplicationStatusChip } from "~/utils/poolCandidate";

import { ApplicationDate } from "./MetadataDate";
import ReviewApplicationDialog from "./ReviewApplicationDialog";

const ReviewApplicationPreviewList_Fragment = graphql(/* GraphQL */ `
  fragment ReviewApplicationPreviewList on PoolCandidate {
    ...ReviewApplicationDialog
    id
    finalDecisionAt
    submittedAt
    removedAt
    finalDecision {
      value
    }
    assessmentStatus {
      assessmentStepStatuses {
        step
      }
      overallAssessmentStatus
      currentStep
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
      closingDate
      areaOfSelection {
        value
      }
      screeningQuestions {
        id
      }
    }
  }
`);

interface ReviewApplicationPreviewListProps {
  applicationsQuery: FragmentType<
    typeof ReviewApplicationPreviewList_Fragment
  >[];
}

const ReviewApplicationPreviewList = ({
  applicationsQuery,
}: ReviewApplicationPreviewListProps) => {
  const intl = useIntl();

  const applications = getFragment(
    ReviewApplicationPreviewList_Fragment,
    applicationsQuery,
  );

  return (
    <>
      {applications.length ? (
        <PreviewList.Root>
          {applications.map((application) => {
            const { id, pool, submittedAt, finalDecisionAt } = application;

            const status = getApplicationStatusChip(
              application.submittedAt,
              pool.closingDate,
              application.removedAt,
              application.finalDecisionAt,
              application.finalDecision?.value,
              pool.areaOfSelection?.value,
              application.assessmentStatus,
              pool.screeningQuestions,
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
                  <ApplicationDate
                    closingDate={pool?.closingDate}
                    submittedAt={submittedAt}
                    finalDecisionAt={finalDecisionAt}
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
                  <ReviewApplicationDialog applicationQuery={application} />
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

export default ReviewApplicationPreviewList;
