import { useIntl } from "react-intl";
import { useMutation } from "urql";
import PaperAirplaneIcon from "@heroicons/react/24/outline/PaperAirplaneIcon";

import { graphql } from "@gc-digital-talent/graphql";
import { Button, Dialog } from "@gc-digital-talent/ui";
import { formMessages } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";

import messages from "../messages";

import StatusDialogLayout from "./StatusDialogLayout";
import { type StatusDialogProps, trackedUsersMutationContext } from "./shared";

const InboxReferTrackedUsers_Mutation = graphql(/* GraphQL */ `
  mutation InboxReferTrackedUsers($ids: [UUID!]!) {
    updateTrackedUsersReferred(ids: $ids) {
      id
    }
  }
`);

const ReferTrackedUsersDialog = ({
  open,
  onOpenChange,
  selectedIds,
  onCompleted,
}: StatusDialogProps) => {
  const intl = useIntl();
  const [, executeMutation] = useMutation(InboxReferTrackedUsers_Mutation);

  const handleConfirmReferred = async () => {
    const result = await executeMutation(
      { ids: selectedIds },
      trackedUsersMutationContext,
    );
    if (
      result.error ||
      !(result.data?.updateTrackedUsersReferred?.length ?? 0)
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
      icon={PaperAirplaneIcon}
      statusLabel={intl.formatMessage(messages.referred)}
      selectedCount={selectedIds.length}
    >
      <Dialog.Footer>
        <Button color="primary" onClick={handleConfirmReferred}>
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

export default ReferTrackedUsersDialog;
