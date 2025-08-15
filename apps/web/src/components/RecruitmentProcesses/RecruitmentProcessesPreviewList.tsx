import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import {
  Heading,
  PreviewList,
  PreviewMetaData,
  Well,
} from "@gc-digital-talent/ui";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { isQualifiedFinalDecision } from "~/utils/poolCandidate";

import OffPlatformRecruitmentProcessList from "./OffPlatformRecruitmentProcessList";
import RecruitmentProcessDialog from "./RecruitmentProcessDialog";

const RecruitmentProcessPreviewList_Fragment = graphql(/* GraphQL */ `
  fragment RecruitmentProcessPreviewList on User {
    poolCandidates {
      ...RecruitmentProcessDialog
      id
      expiryDate
      finalDecisionAt
      suspendedAt
      placedAt
      status {
        value
      }
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
        community {
          id
        }
      }
    }
    offPlatformRecruitmentProcesses {
      ...OffPlatformRecruitmentProcessList
    }
  }
`);

interface RecruitmentProcessPreviewListProps {
  recruitmentProcessesQuery: FragmentType<
    typeof RecruitmentProcessPreviewList_Fragment
  >;
  communityId?: string;
}

const RecruitmentProcessPreviewList = ({
  recruitmentProcessesQuery,
  communityId,
}: RecruitmentProcessPreviewListProps) => {
  const intl = useIntl();

  const recruitmentProcessesFragment = getFragment(
    RecruitmentProcessPreviewList_Fragment,
    recruitmentProcessesQuery,
  );

  const offPlatformRecruitmentProcesses =
    recruitmentProcessesFragment.offPlatformRecruitmentProcesses;

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

  // Add additional filtering for community if communityId exists
  if (communityId) {
    recruitmentProcessesFiltered.filter(
      (recruitment) => recruitment.pool.community?.id === communityId,
    );
  }

  return (
    <>
      {recruitmentProcessesFiltered.length ? (
        <PreviewList.Root>
          {recruitmentProcessesFiltered.map((recruitmentProcess) => {
            const { id, pool, expiryDate } = recruitmentProcess;

            const applicationMetadata: PreviewMetaData[] = [
              {
                key: "expiry-date",
                type: "text",
                children: (
                  <span>
                    {intl.formatMessage(commonMessages.expires)}
                    {intl.formatMessage(commonMessages.dividingColon)}
                    {expiryDate
                      ? formatDate({
                          date: parseDateTimeUtc(expiryDate),
                          formatString: "PPP",
                          intl,
                        })
                      : intl.formatMessage(commonMessages.notFound)}
                  </span>
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
                  <RecruitmentProcessDialog
                    recruitmentProcessQuery={recruitmentProcess}
                  />
                }
                headingAs="h4"
              />
            );
          })}
        </PreviewList.Root>
      ) : (
        <Well className="text-center">
          <p className="font-bold">
            {intl.formatMessage({
              defaultMessage:
                "This user doesn't have any active recruitment processes at the moment.",
              id: "PKntBk",
              description: "Notice when there are no recruitment processes",
            })}
          </p>
        </Well>
      )}
      <div className="mt-6 border-t border-t-gray-300 pt-6">
        <Heading level="h3" className="mt-0 text-base font-bold lg:text-base">
          {intl.formatMessage({
            defaultMessage: "Off-platform recruitment processes",
            id: "tpXtAJ",
            description: "Off-platform section header",
          })}
        </Heading>
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-200">
          {intl.formatMessage({
            defaultMessage:
              "Recruitment processes that the nominee has qualified in on other Government of Canada platforms. Note that this information is provided by the nominee without verification. Please ensure you verify the validity of process information before using it for hiring or placement purposes.",
            id: "2TPpyp",
            description: "Off-platform section information",
          })}
        </p>
        <p className="mb-6">
          {offPlatformRecruitmentProcesses?.length ? (
            <OffPlatformRecruitmentProcessList
              processesQuery={offPlatformRecruitmentProcesses}
            />
          ) : (
            intl.formatMessage({
              defaultMessage:
                "The nominee has not added any off-platform process information.",
              id: "ou6APO",
              description: "Null state for off-platform section",
            })
          )}
        </p>
      </div>
    </>
  );
};

export default RecruitmentProcessPreviewList;
