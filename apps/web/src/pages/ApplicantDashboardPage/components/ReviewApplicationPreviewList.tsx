import { useIntl } from "react-intl";
import PencilSquareIcon from "@heroicons/react/24/outline/PencilSquareIcon";

import {
  CandidateStatus,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { commonMessages, ENUM_SORT_ORDER } from "@gc-digital-talent/i18n";
import { PreviewList, PreviewMetaData, Notice } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { getClassificationName } from "~/utils/poolUtils";
import { candidateStatusChip } from "~/utils/poolCandidate";
import useRoutes from "~/hooks/useRoutes";
import { wrapAbbr } from "~/utils/nameUtils";

import { ApplicationDate } from "./MetadataDate";
import ReviewApplicationDialog from "./ReviewApplicationDialog";

const ReviewApplicationPreviewList_Fragment = graphql(/* GraphQL */ `
  fragment ReviewApplicationPreviewList on PoolCandidate {
    ...ReviewApplicationDialog
    id
    statusUpdatedAt
    submittedAt
    candidateStatus {
      value
      label {
        localized
      }
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

  const sortedApplications = unpackMaybes(applications).sort(
    (a, b) =>
      ENUM_SORT_ORDER.CANDIDATE_STATUS.indexOf(
        a?.candidateStatus?.value ?? null,
      ) -
      ENUM_SORT_ORDER.CANDIDATE_STATUS.indexOf(
        b?.candidateStatus?.value ?? null,
      ),
  );

  return (
    <>
      {applications.length ? (
        <PreviewList.Root>
          {sortedApplications.map((application) => {
            const { id, pool, submittedAt, statusUpdatedAt, candidateStatus } =
              application;
            const statusChip = candidateStatusChip(candidateStatus);

            let applicationMetadata: PreviewMetaData[] = [];
            if (statusChip) {
              applicationMetadata = [
                {
                  key: "status",
                  type: "chip",
                  color: statusChip.color,
                  children: statusChip.label,
                },
              ];
            }

            applicationMetadata = [
              ...applicationMetadata,
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
                    assessedDate={statusUpdatedAt}
                    status={candidateStatus?.value}
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
                    {candidateStatus?.value === CandidateStatus.Draft ? (
                      <PreviewList.Link
                        href={paths.application(application.id)}
                        label={intl.formatMessage(
                          {
                            defaultMessage:
                              "Continue application<hidden> for {poolName}</hidden>",
                            id: "GjL/7z",
                            description: "Label for continue application link",
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
                      <ReviewApplicationDialog applicationQuery={application} />
                    )}
                  </>
                }
                headingAs="h4"
              />
            );
          })}
        </PreviewList.Root>
      ) : (
        <Notice.Root className="text-center">
          <Notice.Title>
            {intl.formatMessage({
              defaultMessage:
                "You don't have any active applications at the moment.",
              id: "Y93ht7",
              description: "Title for notice when there are no applications",
            })}
          </Notice.Title>
          <Notice.Content>
            <p>
              {intl.formatMessage({
                defaultMessage: `You can start a new application by visiting the "Browse jobs" page and selecting an opportunity.`,
                id: "0K7Upw",
                description: "Body for notice when there are no applications",
              })}
            </p>
          </Notice.Content>
        </Notice.Root>
      )}
    </>
  );
};

export default ReviewApplicationPreviewList;
