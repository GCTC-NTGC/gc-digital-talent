import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "urql";

import { Button, Dialog, Heading, Well } from "@gc-digital-talent/ui";
import { DateInput, RadioGroup, Submit } from "@gc-digital-talent/forms";
import {
  AssessmentResult,
  DisqualificationReason,
  Maybe,
  PoolCandidateStatus,
  Skill,
  graphql,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  errorMessages,
  formMessages,
} from "@gc-digital-talent/i18n";
import { strToFormDate } from "@gc-digital-talent/date-helpers";

import AssessmentSummary from "./components/AssessmentSummary";

const PoolCandidate_QualifyCandidateMutation = graphql(/* GraphQL */ `
  mutation PoolCandidate_QualifyCandidateMutation(
    $id: UUID!
    $expiryDate: Date!
  ) {
    qualifyCandidate(id: $id, expiryDate: $expiryDate) {
      id
      status
      expiryDate
    }
  }
`);

const PoolCandidate_DisqualifyCandidateMutation = graphql(/* GraphQL */ `
  mutation PoolCandidate_DisqualifyCandidateMutation(
    $id: UUID!
    $reason: DisqualificationReason!
  ) {
    disqualifyCandidate(id: $id, reason: $reason) {
      id
      status
      expiryDate
    }
  }
`);

type FormValues = {
  finalAssessmentDecision?: string;
  disqualifiedDecision?: string;
  expiryDate?: string;
};

interface FinalDecisionDialogProps {
  poolCandidateId: string;
  poolCandidateStatus: Maybe<PoolCandidateStatus> | undefined;
  expiryDate?: Maybe<string> | undefined;
  essentialSkills: Skill[];
  nonessentialSkills: Skill[];
  assessmentResults: AssessmentResult[];
  defaultOpen?: boolean;
}

const FinalDecisionDialog = ({
  poolCandidateId,
  expiryDate,
  essentialSkills,
  nonessentialSkills,
  assessmentResults,
  defaultOpen = false,
}: FinalDecisionDialogProps) => {
  const intl = useIntl();
  const todayDate = new Date();
  const [isOpen, setIsOpen] = React.useState<boolean>(defaultOpen);
  const [, executeQualifyMutation] = useMutation(
    PoolCandidate_QualifyCandidateMutation,
  );
  const [, executeDisqualifyMutation] = useMutation(
    PoolCandidate_DisqualifyCandidateMutation,
  );

  const methods = useForm<FormValues>({
    defaultValues: {
      expiryDate: expiryDate
        ? new Date(expiryDate).toISOString().split("T")[0]
        : "",
    },
  });
  const { handleSubmit, watch } = methods;
  const [finalAssessmentDecisionValue] = watch(["finalAssessmentDecision"]);

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: could not update pool candidate status",
        id: "FSlrKF",
        description:
          "Message displayed when an error occurs while an admin updates a pool candidate",
      }),
    );
  };

  const handleFormSubmit: SubmitHandler<FormValues> = async (
    values: FormValues,
  ) => {
    if (values.finalAssessmentDecision === "qualified" && values.expiryDate) {
      await executeQualifyMutation({
        id: poolCandidateId,
        expiryDate: values.expiryDate,
      })
        .then((result) => {
          if (result.data?.qualifyCandidate) {
            toast.success(
              intl.formatMessage({
                defaultMessage: "Pool candidate status updated successfully",
                id: "uSdcX4",
                description:
                  "Message displayed when a pool candidate has been updated by and admin",
              }),
            );
            setIsOpen(false);
          } else {
            handleError();
          }
        })
        .catch(() => {
          handleError();
        });
    } else if (
      values.finalAssessmentDecision === "disqualified" &&
      values.disqualifiedDecision
    ) {
      await executeDisqualifyMutation({
        id: poolCandidateId,
        reason:
          values.disqualifiedDecision === "application"
            ? DisqualificationReason.ScreenedOutApplication
            : DisqualificationReason.ScreenedOutAssessment,
      })
        .then((result) => {
          if (result.data?.disqualifyCandidate) {
            toast.success(
              intl.formatMessage({
                defaultMessage: "Pool candidate status updated successfully",
                id: "uSdcX4",
                description:
                  "Message displayed when a pool candidate has been updated by and admin",
              }),
            );
            setIsOpen(false);
          } else {
            handleError();
          }
        })
        .catch(() => {
          handleError();
        });
    } else {
      handleError();
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button type="button" color="primary" mode="solid">
          {intl.formatMessage({
            defaultMessage: "Record final decision",
            id: "ngHHmI",
            description: "Button to click on to fill out a final decision form",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage(commonMessages.finalAssessmentDecision)}
        </Dialog.Header>
        <Dialog.Body>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Use this section to finalize the decision on this candidate's application after you've performed all necessary assessments.",
              id: "mF9apF",
              description: "Text describing a dialog's purpose",
            })}
          </p>
          <Heading level="h3" size="h6" data-h2-margin-bottom="base(x.5)">
            {intl.formatMessage({
              defaultMessage: "Assessment summary",
              id: "DrG5Pl",
              description: "Assessment summary",
            })}
          </Heading>
          <AssessmentSummary
            essentialSkills={essentialSkills}
            nonessentialSkills={nonessentialSkills}
            assessmentResults={assessmentResults}
          />
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <Heading level="h3" size="h6" data-h2-margin-bottom="base(x.5)">
                {intl.formatMessage({
                  defaultMessage: "Final decision",
                  id: "VYOVUJ",
                  description: "Final decision heading",
                })}
              </Heading>
              <RadioGroup
                idPrefix="finalAssessmentDecision"
                name="finalAssessmentDecision"
                legend={intl.formatMessage(
                  commonMessages.finalAssessmentDecision,
                )}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                items={[
                  {
                    value: "qualified",
                    label: intl.formatMessage({
                      defaultMessage: "Qualify candidate",
                      description: "Qualify candidate option",
                      id: "EvR6qK",
                    }),
                  },
                  {
                    value: "disqualified",
                    label: intl.formatMessage({
                      defaultMessage: "Disqualify candidate",
                      description: "Disqualify candidate option",
                      id: "oIM22z",
                    }),
                  },
                ]}
              />
              {finalAssessmentDecisionValue === "disqualified" && (
                <RadioGroup
                  idPrefix="disqualifiedDecision"
                  name="disqualifiedDecision"
                  legend={intl.formatMessage({
                    defaultMessage: "Disqualified decision",
                    description: "Disqualified decision input",
                    id: "Ed+xy1",
                  })}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  items={[
                    {
                      value: "application",
                      label: intl.formatMessage({
                        defaultMessage: "Screened out on application",
                        description: "Screened out on application option",
                        id: "YueN6y",
                      }),
                    },
                    {
                      value: "assessment",
                      label: intl.formatMessage({
                        defaultMessage: "Unsuccessful during assessment",
                        description: "Unsuccessful during assessment option",
                        id: "wrqRvV",
                      }),
                    },
                  ]}
                  data-h2-margin-top="base(x1)"
                />
              )}
              {finalAssessmentDecisionValue === "qualified" && (
                <DateInput
                  id="expiryDate"
                  name="expiryDate"
                  legend={intl.formatMessage({
                    defaultMessage: "Select an expiry date",
                    id: "3MboNR",
                    description:
                      "Label for date selection input for expiry date",
                  })}
                  context={
                    <p>
                      {intl.formatMessage({
                        defaultMessage:
                          "This is the amount of time this candidate will be considered for placement based on the results of this process. The usual amount of time is two years.",
                        id: "DXjJyD",
                        description:
                          "Text describing expiry dates for candidates, what it is for and a recommendation",
                      })}
                    </p>
                  }
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                    min: {
                      value: strToFormDate(todayDate.toISOString()),
                      message: intl.formatMessage(errorMessages.futureDate),
                    },
                  }}
                  data-h2-margin-top="base(x1)"
                />
              )}
              <Well
                color="warning"
                fontSize="caption"
                data-h2-margin-top="base(x1)"
              >
                <p
                  data-h2-margin-bottom="base(x.5)"
                  data-h2-font-weight="base(700)"
                >
                  {intl.formatMessage({
                    defaultMessage: "Important",
                    id: "IKGhHj",
                    description: "Important note or caption",
                  })}
                </p>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "The candidate will be notified of any changes made in this form.",
                    id: "17dZD4",
                    description:
                      "Caption notifying the user about who can know about the results of form changes",
                  })}
                </p>
              </Well>
              <Dialog.Footer data-h2-justify-content="base(flex-start)">
                <Dialog.Close>
                  <Button type="button" color="primary" mode="inline">
                    {intl.formatMessage(formMessages.cancelGoBack)}
                  </Button>
                </Dialog.Close>
                <Submit
                  text={intl.formatMessage(formMessages.saveChanges)}
                  color="primary"
                  mode="solid"
                />
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default FinalDecisionDialog;
