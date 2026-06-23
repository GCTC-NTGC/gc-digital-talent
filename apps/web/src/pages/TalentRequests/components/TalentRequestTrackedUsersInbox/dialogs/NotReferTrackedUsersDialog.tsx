import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQuery } from "urql";
import ArchiveBoxIcon from "@heroicons/react/24/outline/ArchiveBoxIcon";

import {
  graphql,
  type TalentRequestTrackedUserNotReferredReason,
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

import messages from "../messages";

import StatusDialogLayout from "./StatusDialogLayout";
import { type StatusDialogProps, trackedUsersMutationContext } from "./shared";

const InboxNotReferReasons_Query = graphql(/* GraphQL */ `
  query InboxNotReferReasons {
    reasons: localizedEnumStrings(
      enumName: "TalentRequestTrackedUserNotReferredReason"
    ) {
      value
      label {
        localized
      }
    }
  }
`);

const InboxNotReferTrackedUsers_Mutation = graphql(/* GraphQL */ `
  mutation InboxNotReferTrackedUsers(
    $ids: [UUID!]!
    $notReferredReason: TalentRequestTrackedUserNotReferredReason!
  ) {
    updateTrackedUsersNotReferred(
      ids: $ids
      notReferredReason: $notReferredReason
    ) {
      id
    }
  }
`);

interface NotReferFormValues {
  reason: TalentRequestTrackedUserNotReferredReason;
}

const NotReferTrackedUsersDialog = ({
  open,
  onOpenChange,
  selectedIds,
  onCompleted,
}: StatusDialogProps) => {
  const intl = useIntl();
  const methods = useForm<NotReferFormValues>();
  const [{ data }] = useQuery({ query: InboxNotReferReasons_Query });
  const [, executeMutation] = useMutation(InboxNotReferTrackedUsers_Mutation);

  const reasonLabel = intl.formatMessage({
    defaultMessage: "Not referred reason",
    id: "pIbTze",
    description: "Label for the not referred reason select field",
  });
  const reasonOptions = unpackMaybes(data?.reasons).map((reason) => ({
    value: reason.value,
    label: reason.label?.localized ?? reason.value,
  }));

  const handleSubmitNotReferred = async (values: NotReferFormValues) => {
    const result = await executeMutation(
      { ids: selectedIds, notReferredReason: values.reason },
      trackedUsersMutationContext,
    );
    if (
      result.error ||
      !(result.data?.updateTrackedUsersNotReferred?.length ?? 0)
    ) {
      toast.error(intl.formatMessage(messages.updateError));
      return;
    }
    toast.success(intl.formatMessage(messages.updateSuccess));
    onCompleted();
  };

  return (
    <StatusDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      icon={ArchiveBoxIcon}
      statusLabel={intl.formatMessage(commonMessages.notReferred)}
      selectedCount={selectedIds.length}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmitNotReferred)}>
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

export default NotReferTrackedUsersDialog;
