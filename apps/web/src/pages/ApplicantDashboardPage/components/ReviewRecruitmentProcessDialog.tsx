import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";
import { useMutation } from "urql";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  commonMessages,
  formMessages,
  getLocale,
} from "@gc-digital-talent/i18n";
import {
  Button,
  Dialog,
  Link,
  PreviewList,
  Separator,
} from "@gc-digital-talent/ui";
import {
  DATE_FORMAT_LOCALIZED,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";
import { toast } from "@gc-digital-talent/toast";
import { RadioGroup } from "@gc-digital-talent/forms";

import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import talentRequestMessages from "~/messages/talentRequestMessages";
import processMessages from "~/messages/processMessages";
import { getClassificationName } from "~/utils/poolUtils";
import { candidateInterestColorMap } from "~/utils/poolCandidate";
import useRoutes from "~/hooks/useRoutes";
import { getSalaryRange } from "~/utils/classification";
import { wrapAbbr } from "~/utils/nameUtils";

import StatusSummary from "./StatusSummary";
import { candidateInterestDesc } from "./utils";

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

const ReviewRecruitmentProcessDialog_Fragment = graphql(/* GraphQL */ `
  fragment ReviewRecruitmentProcessDialog on PoolCandidate {
    id
    expiryDate
    statusUpdatedAt
    suspendedAt
    candidateInterest {
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
      workStream {
        name {
          localized
        }
      }
      language {
        value
        label {
          localized
        }
      }
      department {
        name {
          localized
        }
      }
      opportunityLength {
        value
        label {
          localized
        }
      }
      isRemote
      location {
        localized
      }
      securityClearance {
        value
        label {
          localized
        }
      }
      processNumber
    }
  }
`);

interface ReviewRecruitmentProcessDialogProps {
  recruitmentProcessQuery: FragmentType<
    typeof ReviewRecruitmentProcessDialog_Fragment
  >;
}

const ReviewRecruitmentProcessDialog = ({
  recruitmentProcessQuery,
}: ReviewRecruitmentProcessDialogProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();

  const recruitmentProcess = getFragment(
    ReviewRecruitmentProcessDialog_Fragment,
    recruitmentProcessQuery,
  );

  const pool = recruitmentProcess?.pool;

  const nullMessage = intl.formatMessage(commonMessages.notFound);

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

  const handleError = () =>
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: failed removing you from search results.",
        id: "7tdU/G",
        description:
          "Alert displayed to the user when application card dialog fails.",
      }),
    );

  const updateSuspendedAtStatus = async (values: FormValues) => {
    await executeMutation({
      id: recruitmentProcess.id,
      isSuspended: values.isSuspended === "true",
    })
      .then((res) => {
        if (res.data) {
          setIsOpen(false);
          if (res.data.changeApplicationSuspendedAt?.suspendedAt) {
            toast.success(
              intl.formatMessage(
                {
                  defaultMessage:
                    "You have been removed from the search results for {poolName}.",
                  id: "Wyi02N",
                  description:
                    "Alert displayed to the user when application card dialog submits successfully.",
                },
                { poolName: pool.name?.localized },
              ),
            );
          } else {
            toast.success(
              intl.formatMessage(
                {
                  defaultMessage:
                    "You have been added back into the search results for {poolName}.",
                  id: "ghTJqE",
                  description:
                    "Alert displayed to the user when they updated something to appear in search results again.",
                },
                { poolName: pool.name?.localized },
              ),
            );
          }
        } else {
          handleError();
        }
      })
      .catch(handleError);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <PreviewList.Button
          label={
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
              : nullMessage
          }
        />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Check out the details of a recruitment process you belong to and update your interest in receiving job offers.",
            id: "Hwt9jD",
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
          <div className="grid gap-6 xs:grid-cols-2">
            {recruitmentProcess.candidateInterest && (
              <StatusSummary
                label={recruitmentProcess.candidateInterest.label.localized}
                description={candidateInterestDesc({
                  interest: recruitmentProcess.candidateInterest.value,
                  intl,
                })}
                color={
                  candidateInterestColorMap.get(
                    recruitmentProcess.candidateInterest.value,
                  ) ?? "secondary"
                }
                className="xs:col-span-2"
              />
            )}

            <Separator decorative className="m-0 xs:col-span-2" />

            <FieldDisplay
              label={intl.formatMessage(talentRequestMessages.jobTitle)}
              className="xs:col-span-2"
            >
              {pool.name?.localized ?? nullMessage}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(talentRequestMessages.classification)}
            >
              {pool?.classification
                ? wrapAbbr(
                    getClassificationName(pool?.classification, intl),
                    intl,
                  )
                : nullMessage}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(commonMessages.salaryRange)}
            >
              {pool?.classification
                ? getSalaryRange(locale, pool.classification)
                : nullMessage}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(talentRequestMessages.workStream)}
            >
              {pool.workStream?.name?.localized}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(processMessages.languageRequirement)}
            >
              {pool.language?.label.localized}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(commonMessages.department)}
              className="xs:col-span-2"
            >
              {pool.department?.name.localized}
            </FieldDisplay>
            <FieldDisplay label={intl.formatMessage(commonMessages.qualified)}>
              {recruitmentProcess.statusUpdatedAt
                ? formatDate({
                    date: parseDateTimeUtc(recruitmentProcess.statusUpdatedAt),
                    formatString: DATE_FORMAT_LOCALIZED,
                    intl,
                  })
                : nullMessage}
            </FieldDisplay>
            <FieldDisplay label={intl.formatMessage(commonMessages.expires)}>
              {recruitmentProcess.expiryDate
                ? formatDate({
                    date: parseDateTimeUtc(recruitmentProcess.expiryDate),
                    formatString: DATE_FORMAT_LOCALIZED,
                    intl,
                  })
                : nullMessage}
            </FieldDisplay>
            <Separator decorative className="m-0 xs:col-span-2" />
            <FieldDisplay
              label={intl.formatMessage(commonMessages.employmentLength)}
              className="xs:col-span-2"
            >
              {pool.opportunityLength?.label.localized}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(talentRequestMessages.workLocation)}
              className="xs:col-span-2"
            >
              {pool.isRemote
                ? intl.formatMessage(commonMessages.remote)
                : pool.location?.localized}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(commonMessages.securityClearance)}
              className="xs:col-span-2"
            >
              {pool.securityClearance?.label.localized}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(processMessages.processNumber)}
              className="xs:col-span-2"
            >
              {pool?.processNumber ?? nullMessage}
            </FieldDisplay>

            <Separator decorative className="m-0 xs:col-span-2" />
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(updateSuspendedAtStatus)}
                className="grid gap-6 xs:col-span-2"
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
                <Dialog.Footer className="flex-col gap-y-6 xs:flex-row xs:gap-x-6">
                  <Button type="submit" disabled={isSubmitting} color="primary">
                    {intl.formatMessage(formMessages.saveChanges)}
                  </Button>
                  <Link
                    href={paths.application(recruitmentProcess.id)}
                    mode="inline"
                    color="primary"
                  >
                    {intl.formatMessage({
                      defaultMessage: "View application",
                      id: "xg/wvH",
                      description: "Label for view application link",
                    })}
                  </Link>
                  <Link
                    href={paths.jobPoster(pool.id)}
                    mode="inline"
                    color="primary"
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
          </div>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ReviewRecruitmentProcessDialog;
