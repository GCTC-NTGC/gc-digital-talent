import { useState } from "react";
import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "urql";

import { Button, Dialog } from "@gc-digital-talent/ui";
import { Submit } from "@gc-digital-talent/forms";
import {
  DisqualificationReason,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";

import FinalDecisionForm, { FormValues } from "./FinalDecisionForm";

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
  const { handleSubmit } = methods;

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
        <Button type="button" color="primary" mode="solid" block>
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
              <FinalDecisionForm />
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
