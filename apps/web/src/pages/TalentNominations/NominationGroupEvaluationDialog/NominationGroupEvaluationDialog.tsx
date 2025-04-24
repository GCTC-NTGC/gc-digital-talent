import { useIntl } from "react-intl";
import { useState } from "react";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";
import { SubmitHandler } from "react-hook-form";
import { useMutation, useQuery } from "urql";

import {
  Button,
  Dialog,
  HydrogenAttributes,
  Pending,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import {
  graphql,
  Scalars,
  UpdateTalentNominationGroupInput,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";

import { dialogMessages, formMessages } from "./messages";
import { convertFormValuesToMutationInput, FormValues } from "./form";
import NominationGroupEvaluationForm from "./components/NominationGroupEvaluationForm";

const NominationGroupEvaluationDialog_Query = graphql(/* GraphQL */ `
  query NominationGroupEvaluationDialog_Query($talentNominationGroupId: UUID!) {
    talentNominationGroup(id: $talentNominationGroupId) {
      ...NominationGroupEvaluationForm
      id
    }
    ...NominationGroupEvaluationFormOptions
  }
`);

const NominationGroupEvaluationDialog_Mutation = graphql(/* GraphQL */ `
  mutation NominationGroupEvaluationDialog_Mutation(
    $id: UUID!
    $talentNominationGroup: UpdateTalentNominationGroupInput!
  ) {
    updateTalentNominationGroup(
      id: $id
      talentNominationGroup: $talentNominationGroup
    ) {
      id
    }
  }
`);

interface NominationGroupEvaluationDialogProps {
  triggerButtonStyle: HydrogenAttributes;
  talentNominationGroupId: string;
}

const NominationGroupEvaluationDialog = ({
  triggerButtonStyle,
  talentNominationGroupId,
}: NominationGroupEvaluationDialogProps) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);

  const [{ data: queryData, fetching: queryFetching, error: queryError }] =
    useQuery({
      query: NominationGroupEvaluationDialog_Query,
      variables: { talentNominationGroupId },
      pause: !open,
    });

  const [{ fetching: mutationFetching }, executeMutation] = useMutation(
    NominationGroupEvaluationDialog_Mutation,
  );

  // run the mutation
  const updateTalentNominationGroup = async (
    id: Scalars["UUID"]["input"],
    talentNominationGroup: UpdateTalentNominationGroupInput,
  ) =>
    executeMutation({ id, talentNominationGroup }).then((result) => {
      if (result.data?.updateTalentNominationGroup?.id) {
        return Promise.resolve(result.data.updateTalentNominationGroup.id);
      }
      return Promise.reject(new Error(result.error?.toString()));
    });

  // handle the submit event
  const handleSubmit: SubmitHandler<FormValues> = async (
    formValues: FormValues,
  ) => {
    if (mutationFetching) return; // avoid multiple submits
    const mutationInput = convertFormValuesToMutationInput(formValues);
    await updateTalentNominationGroup(talentNominationGroupId, mutationInput)
      .then(() => {
        toast.success(intl.formatMessage(formMessages.submissionSuccessful));
        setOpen(false);
      })
      .catch(() => {
        toast.error(intl.formatMessage(formMessages.submissionFailed));
      });
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button
          {...triggerButtonStyle}
          data-h2-margin-top="base(x.1)"
          icon={PencilSquareIcon}
          mode={"icon_only"}
          fontSize="h4"
          aria-label={intl.formatMessage(dialogMessages.title)}
        />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header subtitle={intl.formatMessage(dialogMessages.subtitle)}>
          {intl.formatMessage(dialogMessages.title)}
        </Dialog.Header>
        <Dialog.Body>
          <Pending fetching={queryFetching} error={queryError} inline>
            {queryData?.talentNominationGroup?.id ? (
              <NominationGroupEvaluationForm
                onSubmit={handleSubmit}
                talentNominationGroupQuery={queryData.talentNominationGroup}
                talentNominationGroupOptionsQuery={queryData}
              />
            ) : (
              <ThrowNotFound />
            )}
          </Pending>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default NominationGroupEvaluationDialog;
