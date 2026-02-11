import { useIntl } from "react-intl";
import { useQuery } from "urql";

import {
  ApplicationStatus,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";
import {
  Heading,
  Pending,
  PreviewList,
  PreviewMetaData,
  Separator,
  Notice,
} from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { getClassificationName } from "~/utils/poolUtils";
import { candidateInterestChip } from "~/utils/poolCandidate";
import { wrapAbbr } from "~/utils/nameUtils";
import OffPlatformRecruitmentProcessList from "~/components/RecruitmentProcesses/OffPlatformRecruitmentProcessList";
import OffPlatformProcessDialog from "~/components/RecruitmentProcesses/OffPlatformProcessDialog";

import { RecruitmentDate } from "./MetadataDate";
import ReviewRecruitmentProcessDialog from "./ReviewRecruitmentProcessDialog";
import DeleteOldOffPlatformProcessesDialog from "./DeleteOldOffPlatformProcessesDialog";

const ReviewRecruitmentProcessPreviewList_Fragment = graphql(/* GraphQL */ `
  fragment ReviewRecruitmentProcessPreviewList on User {
    id
    oldOffPlatformRecruitmentProcesses
    offPlatformRecruitmentProcesses {
      ...OffPlatformRecruitmentProcessList
    }
    poolCandidates {
      ...ReviewRecruitmentProcessDialog
      id
      statusUpdatedAt
      candidateInterest {
        value
        label {
          localized
        }
      }
      status {
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
  }
`);

const ReviewOffPlatformRecruitmentProcesses_Query = graphql(/* GraphQL */ `
  query ReviewOffPlatformRecruitmentProcesses {
    ...OffPlatformProcessDialog
  }
`);

interface ReviewRecruitmentProcessPreviewListProps {
  recruitmentProcessesQuery: FragmentType<
    typeof ReviewRecruitmentProcessPreviewList_Fragment
  >;
}

const ReviewRecruitmentProcessPreviewList = ({
  recruitmentProcessesQuery,
}: ReviewRecruitmentProcessPreviewListProps) => {
  const intl = useIntl();

  const user = getFragment(
    ReviewRecruitmentProcessPreviewList_Fragment,
    recruitmentProcessesQuery,
  );

  const recruitmentProcesses = unpackMaybes(user?.poolCandidates);
  const recruitmentProcessesFiltered = recruitmentProcesses.filter(
    ({ status }) => status?.value === ApplicationStatus.Qualified,
  ); // filter for qualified recruitment processes

  const [{ data: offPlatformProcessData, fetching, error }] = useQuery({
    query: ReviewOffPlatformRecruitmentProcesses_Query,
  });

  return (
    <>
      {recruitmentProcessesFiltered.length ? (
        <PreviewList.Root>
          {recruitmentProcessesFiltered.map((recruitmentProcess) => {
            const { id, pool, statusUpdatedAt, candidateInterest } =
              recruitmentProcess;
            const interestChip = candidateInterestChip(candidateInterest);

            let applicationMetadata: PreviewMetaData[] = [];
            if (interestChip) {
              applicationMetadata = [
                {
                  key: "status",
                  type: "chip",
                  color: interestChip.color,
                  children: interestChip.label,
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
                  <RecruitmentDate
                    statusUpdatedAt={statusUpdatedAt}
                    interest={candidateInterest?.value}
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
                            "{poolName}<hidden> recruitment process</hidden>",
                          id: "wrg4fw",
                          description:
                            "Text before recruitment process pool name in recruitment process preview list.",
                        },
                        {
                          poolName: pool.name.localized,
                        },
                      )
                    : intl.formatMessage(commonMessages.notFound)
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
        <Notice.Root className="text-center">
          <Notice.Title>
            {intl.formatMessage({
              defaultMessage:
                "You don't have any active recruitment processes at the moment.",
              id: "vVAqzB",
              description:
                "Title for notice when there are no recruitment processes",
            })}
          </Notice.Title>
          <Notice.Content>
            <p>
              {intl.formatMessage({
                defaultMessage: `Recruitment processes will appear in this section automatically if your application is successful.`,
                id: "MGYlS0",
                description:
                  "Body for notice when there are no Recruitment processes",
              })}
            </p>
          </Notice.Content>
        </Notice.Root>
      )}
      <Separator space="sm" />
      <Pending fetching={fetching} error={error} inline>
        <Heading level="h3" size="h6" className="mb-0.75 font-bold">
          {intl.formatMessage(
            navigationMessages.offPlatformRecruitmentProcesses,
          )}
        </Heading>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-200">
          {intl.formatMessage({
            defaultMessage:
              "If you're qualified in processes or pools on other Government of Canada platforms, you can tell us here. This information will be verified.",
            id: "AC/qwa",
            description: "Off-platform section information",
          })}
        </p>
        {user?.oldOffPlatformRecruitmentProcesses ? (
          <div className="mb-6 rounded-md border p-6">
            <p className="mb-3">{user.oldOffPlatformRecruitmentProcesses}</p>
            <p className="text-sm text-gray-600 dark:text-gray-100">
              {intl.formatMessage({
                defaultMessage:
                  "We've changed the way we collect information about off-platform recruitment processes. The information shown here will be deleted as of December 31, 2025. Please use our new format and add each process you've been qualified in using the \"Add an off-platform process\" button.",
                id: "/0kzjJ",
                description:
                  "Message informing the user about the update to off-platform processes",
                // eslint-disable-next-line formatjs/no-literal-string-in-jsx
              })}{" "}
              <DeleteOldOffPlatformProcessesDialog userId={user.id} />
            </p>
          </div>
        ) : null}
        <OffPlatformRecruitmentProcessList
          processesQuery={user?.offPlatformRecruitmentProcesses ?? []}
          editDialogQuery={offPlatformProcessData}
        />
        <OffPlatformProcessDialog query={offPlatformProcessData} />
      </Pending>
    </>
  );
};

export default ReviewRecruitmentProcessPreviewList;
