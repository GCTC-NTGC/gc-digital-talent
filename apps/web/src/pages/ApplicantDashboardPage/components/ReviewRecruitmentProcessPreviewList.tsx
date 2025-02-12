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
}

const ReviewRecruitmentProcessPreviewList = ({
  recruitmentProcessesQuery,
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
                  ? getClassificationName(pool?.classification, intl)
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
        <Well data-h2-text-align="base(center)">
          <p data-h2-font-weight="base(bold)" data-h2-margin-bottom="base(x.5)">
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
    </>
  );
};

export default ReviewRecruitmentProcessPreviewList;
