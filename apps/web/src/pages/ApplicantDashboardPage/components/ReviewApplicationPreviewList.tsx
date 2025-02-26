import { useIntl } from "react-intl";
import PencilSquareIcon from "@heroicons/react/24/outline/PencilSquareIcon";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { PreviewList, PreviewMetaData, Well } from "@gc-digital-talent/ui";

import { getClassificationName } from "~/utils/poolUtils";
import {
  applicationStatus,
  getApplicationStatusChip,
  qualifiedRecruitmentStatus,
} from "~/utils/poolCandidate";
import useRoutes from "~/hooks/useRoutes";
import { wrapAbbr } from "~/utils/nameUtils";

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
  const paths = useRoutes();

  const applications = getFragment(
    ReviewApplicationPreviewList_Fragment,
    applicationsQuery,
  );

  const statusOrder = [
    applicationStatus.DRAFT,
    applicationStatus.RECEIVED,
    applicationStatus.UNDER_REVIEW,
    applicationStatus.APPLICATION_REVIEWED,
    applicationStatus.UNDER_ASSESSMENT,
    applicationStatus.SUCCESSFUL,
    applicationStatus.UNSUCCESSFUL,
    applicationStatus.EXPIRED,
    qualifiedRecruitmentStatus.HIRED,
    qualifiedRecruitmentStatus.NOT_INTERESTED,
    qualifiedRecruitmentStatus.OPEN_TO_JOBS,
  ];

  return (
    <>
      {applications.length ? (
        <PreviewList.Root>
          {applications
            .map((application) => {
              const status = getApplicationStatusChip(
                application.submittedAt,
                application.pool.closingDate,
                application.removedAt,
                application.finalDecisionAt,
                application.finalDecision?.value,
                application.pool.areaOfSelection?.value,
                application.assessmentStatus,
                application.pool.screeningQuestions,
                intl,
              );
              return { application, status };
            })
            .sort(
              (a, b) =>
                statusOrder.indexOf(a.status.value) -
                statusOrder.indexOf(b.status.value),
            )
            .map(({ application, status }) => {
              const { id, pool, submittedAt, finalDecisionAt } = application;

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
                    ? wrapAbbr(
                        getClassificationName(pool?.classification, intl),
                        intl,
                      )
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
                    pool.name?.localized
                      ? intl.formatMessage(
                          {
                            defaultMessage:
                              "<hidden>Application for </hidden>{poolName}",
                            id: "LC1Rsg",
                            description:
                              "Text before application pool name in application preview list.",
                          },
                          {
                            poolName: pool.name.localized,
                          },
                        )
                      : intl.formatMessage(commonMessages.notFound)
                  }
                  metaData={applicationMetadata}
                  action={
                    <>
                      {status.value === applicationStatus.DRAFT ? (
                        <PreviewList.Link
                          href={paths.application(application.id)}
                          label={intl.formatMessage(
                            {
                              defaultMessage:
                                "Continue application<hidden> for {poolName}</hidden>",
                              id: "GjL/7z",
                              description:
                                "Label for continue application link",
                            },
                            {
                              poolName:
                                pool.name?.localized ??
                                intl.formatMessage(commonMessages.notFound),
                            },
                          )}
                          icon={PencilSquareIcon}
                        />
                      ) : (
                        <ReviewApplicationDialog
                          applicationQuery={application}
                        />
                      )}
                    </>
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
              defaultMessage:
                "You don't have any active applications at the moment.",
              id: "Y93ht7",
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
