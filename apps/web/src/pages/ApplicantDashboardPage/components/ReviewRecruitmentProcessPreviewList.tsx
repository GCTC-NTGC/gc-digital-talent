import { useIntl } from "react-intl";

import {
  FragmentType,
  getFragment,
  graphql,
  HiringPlatform,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import {
  Heading,
  HTMLEntity,
  PreviewList,
  PreviewMetaData,
  Separator,
  Well,
} from "@gc-digital-talent/ui";

import { getClassificationName } from "~/utils/poolUtils";
import {
  getQualifiedRecruitmentStatusChip,
  isQualifiedFinalDecision,
} from "~/utils/poolCandidate";
import { wrapAbbr } from "~/utils/nameUtils";

import { RecruitmentDate } from "./MetadataDate";
import ReviewRecruitmentProcessDialog from "./ReviewRecruitmentProcessDialog";
import CreateOffPlatformProcessDialog from "./CreateOffPlatformProcessDialog";
import UpdateOffPlatformProcessDialog from "./UpdateOffPlatformProcessDialog";
import DeleteOldOffPlatformProcessesDialog from "./DeleteOldOffPlatformProcessesDialog";

const ReviewRecruitmentProcessPreviewList_Fragment = graphql(/* GraphQL */ `
  fragment ReviewRecruitmentProcessPreviewList on PoolCandidate {
    ...ReviewRecruitmentProcessDialog
    id
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
    }
  }
`);

export const ReviewOffPlatformRecruitmentProcesses_Fragment = graphql(
  /* GraphQL */ `
    fragment ReviewOffPlatformRecruitmentProcesses on Query {
      me {
        id
        oldOffPlatformRecruitmentProcesses
        offPlatformRecruitmentProcesses {
          id
          processNumber
          department {
            id
            departmentNumber
            name {
              localized
            }
          }
          classification {
            id
            group
            level
          }
          platform {
            value
            label {
              localized
            }
          }
          platformOther
        }
      }
      ...OffPlatformProcessDialog
    }
  `,
);

interface ReviewRecruitmentProcessPreviewListProps {
  recruitmentProcessesQuery: FragmentType<
    typeof ReviewRecruitmentProcessPreviewList_Fragment
  >[];
  offPlatformProcessesQuery?: FragmentType<
    typeof ReviewOffPlatformRecruitmentProcesses_Fragment
  >;
}

const ReviewRecruitmentProcessPreviewList = ({
  recruitmentProcessesQuery,
  offPlatformProcessesQuery,
}: ReviewRecruitmentProcessPreviewListProps) => {
  const intl = useIntl();

  const recruitmentProcesses = getFragment(
    ReviewRecruitmentProcessPreviewList_Fragment,
    recruitmentProcessesQuery,
  );

  const recruitmentProcessesFiltered = recruitmentProcesses
    ? recruitmentProcesses.filter(
        (recruitmentProcess) =>
          recruitmentProcess.finalDecisionAt &&
          isQualifiedFinalDecision(recruitmentProcess.finalDecision?.value),
      )
    : []; // filter for qualified recruitment processes

  const offPlatformProcessData = getFragment(
    ReviewOffPlatformRecruitmentProcesses_Fragment,
    offPlatformProcessesQuery,
  );

  const user = offPlatformProcessData?.me;

  return (
    <>
      {recruitmentProcessesFiltered.length ? (
        <PreviewList.Root>
          {recruitmentProcessesFiltered.map((recruitmentProcess) => {
            const { id, pool, finalDecisionAt } = recruitmentProcess;

            const status = getQualifiedRecruitmentStatusChip(
              recruitmentProcess.suspendedAt,
              recruitmentProcess.placedAt,
              recruitmentProcess.status?.value ?? null,
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
        <Well className="text-center">
          <p className="mb-3 font-bold">
            {intl.formatMessage({
              defaultMessage:
                "You don't have any active recruitment processes at the moment.",
              id: "vVAqzB",
              description:
                "Title for notice when there are no recruitment processes",
            })}
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage: `Recruitment processes will appear in this section automatically if your application is successful.`,
              id: "MGYlS0",
              description:
                "Body for notice when there are no Recruitment processes",
            })}
          </p>
        </Well>
      )}
      <Separator space="sm" />
      <Heading level="h3" size="h6" className="mb-0.75 font-bold">
        {intl.formatMessage({
          defaultMessage: "Off-platform recruitment processes",
          id: "tpXtAJ",
          description: "Off-platform section header",
        })}
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
      {user?.offPlatformRecruitmentProcesses?.length && (
        <ul className="mb-6 flex flex-col">
          {user.offPlatformRecruitmentProcesses.map((recruitmentProcess) => {
            const classificationTitle = recruitmentProcess.classification
              ? wrapAbbr(
                  getClassificationName(
                    recruitmentProcess.classification,
                    intl,
                  ),
                  intl,
                )
              : intl.formatMessage(commonMessages.notFound);

            return (
              <li
                className="group/item relative flex items-center justify-between gap-3 odd:bg-gray-100/30 dark:odd:bg-gray-700/50 dark:even:bg-gray-700/30"
                key={recruitmentProcess.id}
              >
                <div className="ml-6 flex flex-col">
                  <Heading
                    level="h4"
                    className="mt-3 mb-3 inline-block text-base group-has-[a:focus-visible,button:focus-visible]/item:bg-focus group-has-[a:focus-visible,button:focus-visible]/item:text-black group-has-[a:hover,button:hover]/item:text-primary-600 xs:mb-0 lg:text-base dark:group-has-[a:hover,button:hover]/item:text-primary-200"
                  >
                    <span>
                      {recruitmentProcess.department
                        ? intl.formatMessage(
                            {
                              defaultMessage:
                                "{classification} with {departmentName} <hidden>off platform process</hidden>",
                              id: "pBRz2q",
                              description:
                                "Title for an off platform recruitment process if department is given.",
                            },
                            {
                              classification: classificationTitle,
                              departmentName:
                                recruitmentProcess.department.name.localized,
                            },
                          )
                        : intl.formatMessage(
                            {
                              defaultMessage:
                                "{classification} <hidden>off platform process</hidden>",
                              id: "QtDQkD",
                              description:
                                "Title for an off platform recruitment process if department is not given.",
                            },
                            {
                              classification: classificationTitle,
                            },
                          )}
                    </span>
                  </Heading>
                  <div className="mb-3 flex flex-col flex-nowrap items-start gap-y-3 text-sm xs:flex-row xs:flex-wrap xs:items-center">
                    <span className="text-gray-600 dark:text-gray-200">
                      {recruitmentProcess.platform &&
                      recruitmentProcess.platform.value !== HiringPlatform.Other
                        ? recruitmentProcess.platform.label.localized
                        : recruitmentProcess.platformOther}
                    </span>
                    <HTMLEntity
                      name="&bull;"
                      className="mx-3 hidden text-gray-300 xs:inline-block dark:text-gray-200"
                      aria-hidden
                    />
                    <span className="text-gray-600 dark:text-gray-200">
                      {recruitmentProcess.processNumber}
                    </span>
                  </div>
                </div>
                <UpdateOffPlatformProcessDialog
                  query={offPlatformProcessData}
                  process={recruitmentProcess}
                />
              </li>
            );
          })}
        </ul>
      )}
      <CreateOffPlatformProcessDialog query={offPlatformProcessData} />
    </>
  );
};

export default ReviewRecruitmentProcessPreviewList;
