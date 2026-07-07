import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQuery } from "urql";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";

import {
  graphql,
  type TalentRequestTrackedUserNotSelectedReason,
} from "@gc-digital-talent/graphql";
import { Select } from "@gc-digital-talent/forms";
import { Button, Dialog } from "@gc-digital-talent/ui";
import {
  commonMessages,
  errorMessages,
  formMessages,
  uiMessages,
} from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import talentRequestMessages from "~/messages/talentRequestMessages";

import StatusDialogLayout from "./StatusDialogLayout";
import { type StatusDialogProps, trackedUsersMutationContext } from "./shared";

const InboxNotSelectReasons_Query = graphql(/* GraphQL */ `
  query InboxNotSelectReasons {
    reasons: localizedEnumStrings(
      enumName: "TalentRequestTrackedUserNotSelectedReason"
    ) {
      value
      label {
        localized
      }
    }
  }
`);

const InboxNotSelectTrackedUsers_Mutation = graphql(/* GraphQL */ `
  mutation InboxNotSelectTrackedUsers(
    $ids: [UUID!]!
    $notSelectedReason: TalentRequestTrackedUserNotSelectedReason!
  ) {
    updateTrackedUsersNotSelected(
      ids: $ids
      notSelectedReason: $notSelectedReason
    ) {
      id
    }
  }
`);

interface NotSelectFormValues {
  reason: TalentRequestTrackedUserNotSelectedReason;
}

const NotSelectTrackedUsersDialog = ({
  open,
  onOpenChange,
  selectedIds,
  onCompleted,
}: StatusDialogProps) => {
  const intl = useIntl();
  const methods = useForm<NotSelectFormValues>();
  const [{ data }] = useQuery({ query: InboxNotSelectReasons_Query });
  const [, executeMutation] = useMutation(InboxNotSelectTrackedUsers_Mutation);

  const reasonLabel = intl.formatMessage({
    defaultMessage: "Not selected reason",
    id: "s8WaQk",
    description: "Label for the not selected reason select field",
  });
  const reasonOptions = unpackMaybes(data?.reasons).map((reason) => ({
    value: reason.value,
    label: reason.label?.localized ?? reason.value,
  }));

  const handleSubmitNotSelected = async (values: NotSelectFormValues) => {
    const result = await executeMutation(
      { ids: selectedIds, notSelectedReason: values.reason },
      trackedUsersMutationContext,
    );
    if (
      result.error ||
      !(result.data?.updateTrackedUsersNotSelected?.length ?? 0)
    ) {
      toast.error(intl.formatMessage(talentRequestMessages.updateError));
      return;
    }
    toast.success(intl.formatMessage(talentRequestMessages.updateSuccess));
    onCompleted();
  };

  return (
    <StatusDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      icon={XMarkIcon}
      statusLabel={intl.formatMessage(commonMessages.notSelected)}
      selectedCount={selectedIds.length}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmitNotSelected)}>
          <Select
            id="reason"
            name="reason"
            label={reasonLabel}
            nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
            rules={{ required: intl.formatMessage(errorMessages.required) }}
            options={reasonOptions}
          />
          <Dialog.Footer>
            <Button type="submit" color="primary">
              {intl.formatMessage(formMessages.saveChanges)}
            </Button>
            <Dialog.Close>
              <Button type="button" mode="inline" color="warning">
                {intl.formatMessage(formMessages.cancelGoBack)}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </form>
      </FormProvider>
    </StatusDialogLayout>
  );
};

export default NotSelectTrackedUsersDialog;
