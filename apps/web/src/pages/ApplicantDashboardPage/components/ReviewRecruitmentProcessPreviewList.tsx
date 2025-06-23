import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import {
  Heading,
  PreviewList,
  PreviewMetaData,
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
import OffPlatformProcessesDialog from "./OffPlatformProcessesDialog";

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

interface ReviewRecruitmentProcessPreviewListProps {
  recruitmentProcessesQuery: FragmentType<
    typeof ReviewRecruitmentProcessPreviewList_Fragment
  >[];
  userId: string;
  offPlatformRecruitmentProcesses?: string | null;
}

const ReviewRecruitmentProcessPreviewList = ({
  recruitmentProcessesQuery,
  userId,
  offPlatformRecruitmentProcesses,
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
      <div className="mt-6 border-t-gray-300 pt-6">
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
        <p className="mb-6">
          {offPlatformRecruitmentProcesses ??
            intl.formatMessage({
              defaultMessage:
                "No off-platform process information has been provided.",
              id: "dbeDy2",
              description: "Null state for off-platform section",
            })}
        </p>
        <OffPlatformProcessesDialog
          userId={userId}
          offPlatformRecruitmentProcesses={offPlatformRecruitmentProcesses}
        />
      </div>
    </>
  );
};

export default ReviewRecruitmentProcessPreviewList;
