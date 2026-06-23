import { useIntl } from "react-intl";
import { useMutation } from "urql";
import CheckIcon from "@heroicons/react/24/outline/CheckIcon";

import { graphql } from "@gc-digital-talent/graphql";
import { Button, Dialog } from "@gc-digital-talent/ui";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";

import messages from "../messages";

import StatusDialogLayout from "./StatusDialogLayout";
import { type StatusDialogProps, trackedUsersMutationContext } from "./shared";

const InboxSelectTrackedUsers_Mutation = graphql(/* GraphQL */ `
  mutation InboxSelectTrackedUsers($ids: [UUID!]!) {
    updateTrackedUsersSelected(ids: $ids) {
      id
    }
  }
`);

const SelectTrackedUsersDialog = ({
  open,
  onOpenChange,
  selectedIds,
  onCompleted,
}: StatusDialogProps) => {
  const intl = useIntl();
  const [, executeMutation] = useMutation(InboxSelectTrackedUsers_Mutation);

  const handleConfirmSelected = async () => {
    const result = await executeMutation(
      { ids: selectedIds },
      trackedUsersMutationContext,
    );
    if (
      result.error ||
      !(result.data?.updateTrackedUsersSelected?.length ?? 0)
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
      icon={CheckIcon}
      statusLabel={intl.formatMessage(commonMessages.selected)}
      selectedCount={selectedIds.length}
    >
      <Dialog.Footer>
        <Button color="primary" onClick={handleConfirmSelected}>
          {intl.formatMessage(formMessages.saveChanges)}
        </Button>
        <Dialog.Close>
          <Button mode="inline" color="warning">
            {intl.formatMessage(formMessages.cancelGoBack)}
          </Button>
        </Dialog.Close>
      </Dialog.Footer>
    </StatusDialogLayout>
  );
};

export default SelectTrackedUsersDialog;
