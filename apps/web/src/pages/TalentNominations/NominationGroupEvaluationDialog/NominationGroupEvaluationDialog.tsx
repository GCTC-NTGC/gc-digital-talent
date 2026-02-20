import { useIntl } from "react-intl";
import { useState } from "react";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";
import { SubmitHandler } from "react-hook-form";
import { useMutation, useQuery } from "urql";

import {
  Dialog,
  Pending,
  ThrowNotFound,
  StatusButton,
  StatusButtonProps,
} from "@gc-digital-talent/ui";
import {
  FragmentType,
  getFragment,
  graphql,
  Scalars,
  TalentNominationGroupStatus,
  UpdateTalentNominationGroupInput,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { commonMessages } from "@gc-digital-talent/i18n";

import { dialogMessages, formMessages } from "./messages";
import { convertFormValuesToMutationInput, FormValues } from "./form";
import NominationGroupEvaluationForm from "./components/NominationGroupEvaluationForm";

const NominationGroupEvaluationDialog_Fragment = graphql(/** GraphQL */ `
  fragment NominationGroupEvaluationDialog on TalentNominationGroup {
    id
    status {
      value
      label {
        localized
      }
    }
    ...NominationGroupEvaluationForm
  }
`);

const NominationGroupEvaluationDialog_Query = graphql(/* GraphQL */ `
  query NominationGroupEvaluationDialogFormOptions {
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

const statusColorMap = new Map<
  TalentNominationGroupStatus,
  StatusButtonProps["color"]
>([
  [TalentNominationGroupStatus.InProgress, "primary"],
  [TalentNominationGroupStatus.Rejected, "error"],
  [TalentNominationGroupStatus.Approved, "success"],
  [TalentNominationGroupStatus.PartiallyApproved, "success"],
]);

export interface NominationGroupEvaluationDialogProps {
  query: FragmentType<typeof NominationGroupEvaluationDialog_Fragment>;
}

const NominationGroupEvaluationDialog = ({
  query,
}: NominationGroupEvaluationDialogProps) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);
  const nominationGroup = getFragment(
    NominationGroupEvaluationDialog_Fragment,
    query,
  );

  const [{ data: queryData, fetching: queryFetching, error: queryError }] =
    useQuery({
      query: NominationGroupEvaluationDialog_Query,
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
    await updateTalentNominationGroup(nominationGroup.id, mutationInput)
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
        <StatusButton
          color={statusColorMap.get(
            nominationGroup?.status?.value ??
              TalentNominationGroupStatus.InProgress,
          )}
          icon={PencilSquareIcon}
          label={intl.formatMessage(dialogMessages.title)}
          block
        >
          {nominationGroup?.status?.label?.localized ??
            intl.formatMessage(commonMessages.notProvided)}
        </StatusButton>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header subtitle={intl.formatMessage(dialogMessages.subtitle)}>
          {intl.formatMessage(dialogMessages.title)}
        </Dialog.Header>
        <Dialog.Body>
          <Pending fetching={queryFetching} error={queryError} inline>
            {queryData ? (
              <NominationGroupEvaluationForm
                onSubmit={handleSubmit}
                talentNominationGroupQuery={nominationGroup}
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
