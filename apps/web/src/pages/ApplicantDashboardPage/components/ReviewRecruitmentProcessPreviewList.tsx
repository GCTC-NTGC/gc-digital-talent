import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import { useMutation } from "urql";

import {
  FragmentType,
  getFragment,
  graphql,
  ReviewRecruitmentProcessPreviewListFragment,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  formMessages,
  getLocale,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import {
  Button,
  Dialog,
  Link,
  PreviewList,
  PreviewMetaData,
  Separator,
  Well,
} from "@gc-digital-talent/ui";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { toast } from "@gc-digital-talent/toast";
import { RadioGroup } from "@gc-digital-talent/forms";

import FieldDisplay from "~/components/ToggleForm/FieldDisplay";
import talentRequestMessages from "~/messages/talentRequestMessages";
import processMessages from "~/messages/processMessages";
import { getClassificationName } from "~/utils/poolUtils";
import {
  ApplicationStatus,
  getQualifiedRecruitmentStatusChip,
  getSalaryRange,
  isQualifiedFinalDecision,
} from "~/utils/poolCandidate";
import useRoutes from "~/hooks/useRoutes";

import { RecruitmentDate } from "./MetadataDate";
import StatusSummary from "./StatusSummary";

interface FormValues {
  isSuspended: "true" | "false";
}

const ReviewRecruitmentProcess_Mutation = graphql(/* GraphQL */ `
  mutation Name($id: ID!, $isSuspended: Boolean!) {
    changeApplicationSuspendedAt(id: $id, isSuspended: $isSuspended) {
      id
      suspendedAt
    }
  }
`);

export const ReviewRecruitmentProcessPreviewList_Fragment = graphql(
  /* GraphQL */ `
    fragment ReviewRecruitmentProcessPreviewList on PoolCandidate {
      id
      expiryDate
      finalDecisionAt
      submittedAt
      suspendedAt
      removedAt
      placedAt
      status {
        value
        label {
          en
          fr
        }
      }
      finalDecision {
        value
        label {
          en
          fr
        }
      }
      pool {
        id
        name {
          en
          fr
        }
        classification {
          group
          level
          minSalary
          maxSalary
        }
        workStream {
          name {
            en
            fr
          }
        }
        language {
          value
          label {
            en
            fr
          }
        }
        department {
          name {
            en
            fr
          }
        }
        closingDate
        opportunityLength {
          value
          label {
            en
            fr
          }
        }
        isRemote
        location {
          en
          fr
        }
        securityClearance {
          value
          label {
            en
            fr
          }
        }
        processNumber
      }
    }
  `,
);

interface ReviewRecruitmentProcessDialogProps {
  recruitmentProcessQuery: ReviewRecruitmentProcessPreviewListFragment;
}

const ReviewRecruitmentProcessDialog = ({
  recruitmentProcessQuery: recruitmentProcess,
}: ReviewRecruitmentProcessDialogProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();

  const pool = recruitmentProcess?.pool;

  const nullMessage = intl.formatMessage(commonMessages.notFound);
  const poolName = getLocalizedName(pool?.name, intl);

  const [, executeMutation] = useMutation(ReviewRecruitmentProcess_Mutation);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const isSuspended = !!recruitmentProcess.suspendedAt;
  const methods = useForm<FormValues>({
    defaultValues: { isSuspended: isSuspended ? "true" : "false" },
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const updateSuspendedAtStatus = async (values: FormValues) => {
    await executeMutation({
      id: recruitmentProcess.id,
      isSuspended: values.isSuspended === "true",
    })
      .then((res) => {
        if (!res.error) {
          setIsOpen(false);
          if (values.isSuspended === "true") {
            toast.success(
              intl.formatMessage({
                defaultMessage:
                  "You have been removed from the search results.",
                id: "PoFTwr",
                description:
                  "Alert displayed to the user when application card dialog submits successfully.",
              }),
            );
          } else {
            toast.success(
              intl.formatMessage({
                defaultMessage:
                  "You have been added back into the search results.",
                id: "lB/SWR",
                description:
                  "Alert displayed to the user when they updated something to appear in search results again.",
              }),
            );
          }
        }
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: failed removing you from search results.",
            id: "7tdU/G",
            description:
              "Alert displayed to the user when application card dialog fails.",
          }),
        );
      });
  };

  const status = getQualifiedRecruitmentStatusChip(
    recruitmentProcess.suspendedAt,
    recruitmentProcess.placedAt,
    intl,
  );

  const isExpiredStatus = status.value === ApplicationStatus.EXPIRED;
  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <PreviewList.Button
          label={poolName}
          id={`${recruitmentProcess.id}-test`}
        />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Check out the details of a recruitment process you belong to and update your interest in receiving jobs.",
            id: "29z3+q",
            description: "Subtitle for the review recruitment process dialog",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Review a recruitment process",
            id: "mivSCS",
            description: "Title for the review recruitment process dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <div
            data-h2-display="base(grid)"
            data-h2-grid-template-columns="base(repeat(1, 1fr)) p-tablet(repeat(2, 1fr))"
            data-h2-gap="base(x1)"
          >
            <StatusSummary
              label={status.label}
              description={status.description}
              color={status.color}
              data-h2-grid-column="p-tablet(span 2)"
            />

            <Separator
              decorative
              data-h2-grid-column="p-tablet(span 2)"
              data-h2-margin="base(0)"
            />

            <FieldDisplay
              label={intl.formatMessage(talentRequestMessages.jobTitle)}
              data-h2-grid-column="p-tablet(span 2)"
            >
              {poolName ?? nullMessage}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(talentRequestMessages.classification)}
            >
              {pool?.classification
                ? getClassificationName(pool?.classification, intl)
                : nullMessage}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(talentRequestMessages.salaryRange)}
            >
              {pool?.classification
                ? getSalaryRange(locale, pool.classification)
                : nullMessage}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(talentRequestMessages.workStream)}
            >
              {getLocalizedName(pool?.workStream?.name, intl)}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(processMessages.languageRequirement)}
            >
              {getLocalizedName(pool?.language?.label, intl)}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(commonMessages.department)}
              data-h2-grid-column="p-tablet(span 2)"
            >
              {getLocalizedName(pool?.department?.name, intl)}
            </FieldDisplay>
            <FieldDisplay label={intl.formatMessage(commonMessages.awarded)}>
              {recruitmentProcess.finalDecisionAt
                ? formatDate({
                    date: parseDateTimeUtc(recruitmentProcess.finalDecisionAt),
                    formatString: "PPP",
                    intl,
                    timeZone: "Canada/Pacific",
                  })
                : nullMessage}
            </FieldDisplay>
            <FieldDisplay label={intl.formatMessage(commonMessages.expires)}>
              {recruitmentProcess.expiryDate
                ? formatDate({
                    date: parseDateTimeUtc(recruitmentProcess.expiryDate),
                    formatString: "PPP",
                    intl,
                    timeZone: "Canada/Pacific",
                  })
                : nullMessage}
            </FieldDisplay>
            <Separator
              decorative
              data-h2-grid-column="p-tablet(span 2)"
              data-h2-margin="base(0)"
            />
            <FieldDisplay
              label={intl.formatMessage(talentRequestMessages.employmentLength)}
              data-h2-grid-column="p-tablet(span 2)"
            >
              {getLocalizedName(pool?.opportunityLength?.label, intl)}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(talentRequestMessages.workLocation)}
              data-h2-grid-column="p-tablet(span 2)"
            >
              {getLocalizedName(pool?.location, intl)}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(
                talentRequestMessages.securityClearance,
              )}
              data-h2-grid-column="p-tablet(span 2)"
            >
              {getLocalizedName(pool?.securityClearance?.label, intl)}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(processMessages.processNumber)}
              data-h2-grid-column="p-tablet(span 2)"
            >
              {pool?.processNumber ?? nullMessage}
            </FieldDisplay>
            {!isExpiredStatus ? (
              <>
                <Separator
                  decorative
                  data-h2-grid-column="p-tablet(span 2)"
                  data-h2-margin="base(0)"
                />
                <FormProvider {...methods}>
                  <form
                    onSubmit={handleSubmit(updateSuspendedAtStatus)}
                    data-h2-display="base(grid)"
                    data-h2-gap="base(x1)"
                    data-h2-grid-column="p-tablet(span 2)"
                  >
                    <p>
                      {intl.formatMessage({
                        defaultMessage:
                          "Congratulations on being accepted into this recruitment process! You’ll now be considered for related opportunities. If you’ve recently taken a new job or no longer want to be contacted about opportunities, you can change your availability here. <strong>This choice can be reversed at any time if you change your mind</strong>.",
                        id: "xHAPBe",
                        description:
                          "Message congratulating the applicant into the recruitment process.",
                      })}
                    </p>
                    <RadioGroup
                      legend={intl.formatMessage({
                        defaultMessage: "Your availability",
                        id: "jaMIil",
                        description:
                          "Label for available for opportunities radio group",
                      })}
                      idPrefix="availability"
                      id="isSuspended"
                      name="isSuspended"
                      items={[
                        {
                          label: intl.formatMessage({
                            defaultMessage:
                              "I am <strong>available</strong> for hire and want to be contacted about opportunities from this recruitment process.",
                            id: "cAOf3a",
                            description:
                              "Radio button label for available for opportunities option",
                          }),
                          value: "false",
                        },
                        {
                          label: intl.formatMessage({
                            defaultMessage:
                              "I am <strong>unavailable</strong> and do not want to be contacted about opportunities from this recruitment process.",
                            id: "1mYPEx",
                            description:
                              "Radio button label for not available for opportunities option",
                          }),
                          value: "true",
                        },
                      ]}
                    />
                    <Dialog.Footer data-h2-gap="base(0 x1)">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        color="secondary"
                      >
                        {intl.formatMessage(formMessages.saveChanges)}
                      </Button>
                      <Link
                        href={paths.application(recruitmentProcess.id)}
                        mode="inline"
                        color="secondary"
                      >
                        {intl.formatMessage({
                          defaultMessage: "View application",
                          id: "xg/wvH",
                          description: "Label for view application link",
                        })}
                      </Link>
                      <Link
                        href={paths.pool(pool.id)}
                        mode="inline"
                        color="secondary"
                      >
                        {intl.formatMessage({
                          defaultMessage: "View job advertisement",
                          id: "eZlUrp",
                          description: "Label for view job advertisement link",
                        })}
                      </Link>
                      <Dialog.Close>
                        <Button mode="inline" color="warning">
                          {intl.formatMessage(commonMessages.cancel)}
                        </Button>
                      </Dialog.Close>
                    </Dialog.Footer>
                  </form>
                </FormProvider>
              </>
            ) : (
              <Dialog.Footer data-h2-gap="base(0 x1)">
                <Dialog.Close>
                  <Button mode="solid" color="secondary">
                    {intl.formatMessage(commonMessages.close)}
                  </Button>
                </Dialog.Close>
                <Link
                  href={paths.application(recruitmentProcess.id)}
                  mode="inline"
                  color="secondary"
                >
                  {intl.formatMessage({
                    defaultMessage: "View application",
                    id: "xg/wvH",
                    description: "Label for view application link",
                  })}
                </Link>
                <Link
                  href={paths.pool(pool.id)}
                  mode="inline"
                  color="secondary"
                >
                  {intl.formatMessage({
                    defaultMessage: "View job advertisement",
                    id: "eZlUrp",
                    description: "Label for view job advertisement link",
                  })}
                </Link>
              </Dialog.Footer>
            )}
          </div>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

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
                title={getLocalizedName(pool.name, intl)}
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
              defaultMessage:
                'You can find a job using the "Browse jobs" button or navigation to the "Browse jobs" page from the main navigation.',
              id: "zeEjHi",
              description: "Body for notice when there are no applications",
            })}
          </p>
        </Well>
      )}
    </>
  );
};

export default ReviewRecruitmentProcessPreviewList;
