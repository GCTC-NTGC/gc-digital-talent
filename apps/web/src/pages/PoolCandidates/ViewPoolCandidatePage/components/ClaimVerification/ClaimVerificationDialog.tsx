import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "urql";
import { useState } from "react";

import {
  ClaimVerificationResult,
  Maybe,
  Scalars,
  UpdatePoolCandidateClaimVerificationInput,
  graphql,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { Button, Dialog } from "@gc-digital-talent/ui";
import { DateInput, RadioGroup } from "@gc-digital-talent/forms";
import { errorMessages, formMessages } from "@gc-digital-talent/i18n";
import { strToFormDate } from "@gc-digital-talent/date-helpers";

import profileMessages from "~/messages/profileMessages";

interface FormValues {
  result: ClaimVerificationResult;
  expiry?: Scalars["DateTime"]["input"];
}

const UpdateClaimVerification_Mutation = graphql(/* GraphQL */ `
  mutation UpdatePriorityVerification(
    $id: UUID!
    $values: UpdatePoolCandidateClaimVerificationInput!
  ) {
    updatePoolCandidateClaimVerification(id: $id, poolCandidate: $values) {
      id
    }
  }
`);

const todayDate = new Date();

interface ClaimVerificationDialogProps {
  context: "veteran" | "priority";
  id: Scalars["UUID"]["output"];
  result?: Maybe<ClaimVerificationResult>;
  expiry?: Maybe<Scalars["DateTime"]["output"]>;
  priorityNumber?: Maybe<string>;
}

const ClaimVerificationDialog = ({
  id,
  context,
  result,
  expiry,
  priorityNumber,
}: ClaimVerificationDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [{ fetching }, executeMutation] = useMutation(
    UpdateClaimVerification_Mutation,
  );
  const isPriority = context === "priority";

  const methods = useForm<FormValues>({
    defaultValues: {
      expiry: expiry ?? undefined,
      result: result ?? undefined,
    },
  });

  const verificationResult = methods.watch("result");

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Error: could not update claim verification",
        id: "8HMXsd",
        description:
          "Error message for updating a candidates claim verification",
      }),
    );
  };

  const handleSubmit: SubmitHandler<FormValues> = (data) => {
    const values: UpdatePoolCandidateClaimVerificationInput = isPriority
      ? {
          priorityVerification: data.result,
          priorityVerificationExpiry:
            data.result === ClaimVerificationResult.Accepted
              ? data?.expiry
              : null,
        }
      : {
          veteranVerification: data.result,
          veteranVerificationExpiry:
            data.result === ClaimVerificationResult.Accepted
              ? data?.expiry
              : null,
        };

    executeMutation({
      id,
      values,
    })
      .then((res) => {
        if (res.data?.updatePoolCandidateClaimVerification?.id) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Successfully updated claim verification",
              id: "pFkIhb",
              description:
                "Success message when updating a candidates claim verification",
            }),
          );
          methods.reset(data);
          setIsOpen(false);
        } else {
          handleError();
        }
      })
      .catch(handleError);
  };

  const title = intl.formatMessage(
    isPriority ? profileMessages.priorityStatus : profileMessages.veteranStatus,
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button mode="inline" color="black">
          {intl.formatMessage(
            {
              defaultMessage: "Edit<hidden> {claim}</hidden>",
              id: "PNWDpo",
              description:
                "Button text for editing verification of candidate claim",
            },
            { claim: title },
          )}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content hasSubtitle>
        <Dialog.Header
          subtitle={
            isPriority
              ? intl.formatMessage({
                  defaultMessage:
                    "Review and verify the candidate's priority status",
                  id: "ZvrwDW",
                  description:
                    "Subtitle for verifying a candidate's priority claim",
                })
              : intl.formatMessage({
                  defaultMessage:
                    "Review and verify the candidate's veteran status",
                  id: "tBxdBY",
                  description:
                    "Subtitle for verifying a candidate's veteran claim",
                })
          }
        >
          {title}
        </Dialog.Header>
        <Dialog.Body>
          <p data-h2-margin-bottom="base(x1)">
            {isPriority
              ? intl.formatMessage(
                  {
                    defaultMessage:
                      "This candidate has claimed a <strong>priority status</strong> and has submitted the following number: <strong>{priorityNumber}</strong>.",
                    id: "QGKWJ5",
                    description:
                      "Message for a candidates priority status claim",
                  },
                  {
                    priorityNumber,
                  },
                )
              : intl.formatMessage({
                  defaultMessage:
                    "This candidate has claimed a <strong>veteran status</strong>.",
                  id: "ssSdOn",
                  description: "Message for a candidates veteran status claim",
                })}
          </p>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <RadioGroup
                id="result"
                idPrefix="result"
                name="result"
                legend={title}
                data-h2-margin-bottom="base(x1)"
                rules={{ required: intl.formatMessage(errorMessages.required) }}
                items={[
                  {
                    value: ClaimVerificationResult.Unverified,
                    label: intl.formatMessage({
                      defaultMessage: "Currently unverified",
                      id: "q70oUn",
                      description: "Label for the unverified claim option",
                    }),
                  },
                  {
                    value: ClaimVerificationResult.Accepted,
                    label: intl.formatMessage({
                      defaultMessage: "This claim has been verified",
                      id: "3jpTNK",
                      description: "Label for the verified claim option",
                    }),
                  },
                  {
                    value: ClaimVerificationResult.Rejected,
                    label: intl.formatMessage({
                      defaultMessage:
                        "This claim does not apply to this process",
                      id: "9q6fZo",
                      description: "Label for the rejected claim option",
                    }),
                  },
                ]}
              />
              {verificationResult === ClaimVerificationResult.Accepted && (
                <DateInput
                  id="expiry"
                  name="expiry"
                  legend={
                    isPriority
                      ? intl.formatMessage({
                          defaultMessage: "Priority status expiration date",
                          id: "H+g+uL",
                          description:
                            "Label for a priority status claim expiration date",
                        })
                      : intl.formatMessage({
                          defaultMessage: "Veteran status expiration date",
                          id: "QG9Tcs",
                          description:
                            "Label for a veteran status claim expiration date",
                        })
                  }
                  rules={{
                    required: isPriority
                      ? intl.formatMessage(errorMessages.required)
                      : undefined,
                    min: {
                      value: strToFormDate(todayDate.toISOString()),
                      message: intl.formatMessage(errorMessages.futureDate),
                    },
                  }}
                />
              )}
              <Dialog.Footer>
                <Button type="submit" color="secondary" disabled={fetching}>
                  {intl.formatMessage(formMessages.saveChanges)}
                </Button>
                <Dialog.Close>
                  <Button
                    type="button"
                    mode="inline"
                    color="warning"
                    disabled={fetching}
                  >
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

export default ClaimVerificationDialog;
