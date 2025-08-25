import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useMutation } from "urql";

import { Submit } from "@gc-digital-talent/forms";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { Button, Dialog } from "@gc-digital-talent/ui";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import { defaultLogger } from "@gc-digital-talent/logger";

import JobPlacementForm, {
  FormValues as JobPlacementFormValues,
  JobPlacementOptions_Query,
} from "~/components/PoolCandidatesTable/JobPlacementForm";
import FormChangeNotifyWell from "~/components/FormChangeNotifyWell/FormChangeNotifyWell";

import FinalDecisionForm, {
  FormValues as FinalDecisionFormValues,
} from "./FinalDecisionForm";
import { FinalDecisionDialog_Fragment } from "./FinalDecisionDialog";
import {
  formValuesToDisqualifyCandidateInput,
  formValuesToQualifyAndPlaceCandidateInput,
  formValuesToQualifyCandidateInput,
} from "./formUtils";

export interface FormValues
  extends FinalDecisionFormValues,
    JobPlacementFormValues {}

const PoolCandidate_QualifyCandidateMutation = graphql(/* GraphQL */ `
  mutation PoolCandidate_QualifyCandidateMutation(
    $id: UUID!
    $poolCandidate: QualifyCandidateInput!
  ) {
    qualifyCandidate(id: $id, poolCandidate: $poolCandidate) {
      id
      status {
        value
      }
      expiryDate
    }
  }
`);

const PoolCandidate_QualifyAndPlaceCandidateMutation = graphql(/* GraphQL */ `
  mutation PoolCandidate_QualifyAndPlaceCandidateMutation(
    $id: UUID!
    $poolCandidate: QualifyAndPlaceCandidateInput!
  ) {
    qualifyAndPlaceCandidate(id: $id, poolCandidate: $poolCandidate) {
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

interface FinalDecisionAndPlaceDialogProps {
  poolCandidate: FragmentType<typeof FinalDecisionDialog_Fragment>;
  optionsQuery: FragmentType<typeof JobPlacementOptions_Query>;
  defaultOpen?: boolean;
}

const FinalDecisionAndPlaceDialog = ({
  poolCandidate: poolCandidateQuery,
  optionsQuery,
  defaultOpen = false,
}: FinalDecisionAndPlaceDialogProps) => {
  const intl = useIntl();
  const poolCandidate = getFragment(
    FinalDecisionDialog_Fragment,
    poolCandidateQuery,
  );
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const [, executeQualifyMutation] = useMutation(
    PoolCandidate_QualifyCandidateMutation,
  );
  const [, executeQualifyAndPlaceMutation] = useMutation(
    PoolCandidate_QualifyAndPlaceCandidateMutation,
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

  const handleFormSubmit: SubmitHandler<FormValues> = async (
    values: FormValues,
  ) => {
    let mutationPromise: Promise<void> | null = null;

    if (values.finalAssessmentDecision === "qualified") {
      // We're going to qualify them with an expiry date.  We may or may not place them.

      if (values.placementType && values.placementType !== "NOT_PLACED") {
        // We have a placement so we will both qualify and place.
        mutationPromise = executeQualifyAndPlaceMutation({
          id: poolCandidate.id,
          ...formValuesToQualifyAndPlaceCandidateInput(values),
        }).then((result) => {
          if (result.data?.qualifyAndPlaceCandidate) {
            return Promise.resolve();
          } else {
            return Promise.reject(new Error(result.error?.message));
          }
        });
      } else {
        // No placement so we will just qualify
        mutationPromise = executeQualifyMutation({
          id: poolCandidate.id,
          ...formValuesToQualifyCandidateInput(values),
        }).then((result) => {
          if (result.data?.qualifyCandidate) {
            return Promise.resolve();
          } else {
            return Promise.reject(new Error(result.error?.message));
          }
        });
      }
    } else if (values.finalAssessmentDecision === "disqualified") {
      // We're going to mark them as disqualified.  No option to place them.

      mutationPromise = executeDisqualifyMutation({
        id: poolCandidate.id,
        ...formValuesToDisqualifyCandidateInput(values),
      }).then((result) => {
        if (result.data?.disqualifyCandidate) {
          return Promise.resolve();
        } else {
          return Promise.reject(new Error(result.error?.message));
        }
      });
    }

    if (!mutationPromise) {
      defaultLogger.error(
        `Could not pick a mutation for final assessment decision: ${values.finalAssessmentDecision}`,
      );
      return;
    }

    await mutationPromise
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Pool candidate status updated successfully",
            id: "uSdcX4",
            description:
              "Message displayed when a pool candidate has been updated by and admin",
          }),
        );
        setIsOpen(false);
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: could not update pool candidate status",
            id: "FSlrKF",
            description:
              "Message displayed when an error occurs while an admin updates a pool candidate",
          }),
        );
      });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button type="button" color="primary" mode="solid" block>
          {intl.formatMessage({
            defaultMessage: "Final assessment decision",
            id: "YrbtRw",
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
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
              className="flex flex-col gap-6"
            >
              <FinalDecisionForm />
              {finalAssessmentDecisionValue === "qualified" && (
                <JobPlacementForm optionsQuery={optionsQuery} />
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

export default FinalDecisionAndPlaceDialog;
