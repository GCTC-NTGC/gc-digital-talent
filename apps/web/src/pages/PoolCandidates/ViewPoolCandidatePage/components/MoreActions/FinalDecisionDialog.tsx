import { useState } from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "urql";

import { Button, Dialog, Heading } from "@gc-digital-talent/ui";
import { DateInput, RadioGroup, Submit } from "@gc-digital-talent/forms";
import {
  DisqualificationReason,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import {
  commonMessages,
  errorMessages,
  formMessages,
} from "@gc-digital-talent/i18n";
import { strToFormDate } from "@gc-digital-talent/date-helpers";

import FormChangeNotifyWell from "~/components/FormChangeNotifyWell/FormChangeNotifyWell";

export const FinalDecisionDialog_Fragment = graphql(/* GraphQL */ `
  fragment FinalDecisionDialog on PoolCandidate {
    id
    status {
      value
      label {
        en
        fr
      }
    }
    expiryDate
  }
`);

const PoolCandidate_QualifyCandidateMutation = graphql(/* GraphQL */ `
  mutation PoolCandidate_QualifyCandidateMutation(
    $id: UUID!
    $expiryDate: Date!
  ) {
    qualifyCandidate(id: $id, expiryDate: $expiryDate) {
      id
      status {
        value
      }
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
      status {
        value
      }
      expiryDate
    }
  }
`);

interface FormValues {
  finalAssessmentDecision?: string;
  disqualifiedDecision?: string;
  expiryDate?: string;
}

interface FinalDecisionDialogProps {
  poolCandidate: FragmentType<typeof FinalDecisionDialog_Fragment>;
  defaultOpen?: boolean;
}

const FinalDecisionDialog = ({
  poolCandidate: poolCandidateQuery,
  defaultOpen = false,
}: FinalDecisionDialogProps) => {
  const intl = useIntl();
  const poolCandidate = getFragment(
    FinalDecisionDialog_Fragment,
    poolCandidateQuery,
  );
  const todayDate = new Date();
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const [, executeQualifyMutation] = useMutation(
    PoolCandidate_QualifyCandidateMutation,
  );
  const [, executeDisqualifyMutation] = useMutation(
    PoolCandidate_DisqualifyCandidateMutation,
  );

  const methods = useForm<FormValues>({
    defaultValues: {
      expiryDate: poolCandidate.expiryDate
        ? new Date(poolCandidate.expiryDate).toISOString().split("T")[0]
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
        id: poolCandidate.id,
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
        id: poolCandidate.id,
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
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <Heading level="h3" size="h6" className="mb-3">
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
                  className="mt-6"
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
                  className="mt-6"
                />
              )}
              <FormChangeNotifyWell className="mt-6" />
              <Dialog.Footer>
                <Submit text={intl.formatMessage(formMessages.saveChanges)} />
                <Dialog.Close>
                  <Button color="warning" mode="inline">
                    {intl.formatMessage(formMessages.cancelGoBack)}
                  </Button>
                </Dialog.Close>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default FinalDecisionDialog;
