import { useIntl } from "react-intl";

import {
  Button,
  Dialog,
  IconLabel,
  type IconType,
} from "@gc-digital-talent/ui";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";
import type {
  TalentRequestTrackedUserNotReferredReason,
  TalentRequestTrackedUserNotSelectedReason,
} from "@gc-digital-talent/graphql";

import talentRequestMessages from "~/messages/talentRequestMessages";

import ChangeStatusForm from "./ChangeStatusForm";
import type { StatusReasonType } from "../../types";

interface ChangeStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  numOfSelectedCandidates: number;
  status: string;
  icon: IconType;
  onConfirm?: () => Promise<void>;
  onCancel: () => void;
  reasonType?: StatusReasonType;
  onUpdate?: (
    reason:
      | TalentRequestTrackedUserNotReferredReason
      | TalentRequestTrackedUserNotSelectedReason,
  ) => Promise<void>;
  disable?: boolean;
}

const ChangeStatusDialog = ({
  open,
  onOpenChange,
  numOfSelectedCandidates,
  status,
  icon,
  onConfirm,
  onCancel,
  reasonType,
  onUpdate,
  disable = false,
}: ChangeStatusDialogProps) => {
  const intl = useIntl();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Update the status of the selected candidates in this request.",
            id: "mDnvUx",
            description:
              "Subtitle for change status dialog in the talent request tracked users table",
          })}
        >
          {intl.formatMessage(talentRequestMessages.changeStatus, { status })}
        </Dialog.Header>
        <Dialog.Body>
          <p className="mb-6 flex flex-col gap-3">
            <span>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "The selected candidates <strong>({numOfSelectedCandidates})</strong> will be marked as",
                  id: "tgu3Ip",
                  description:
                    "Message for change status dialog in the talent request tracked users table",
                },
                { numOfSelectedCandidates },
              )}
              {intl.formatMessage(commonMessages.dividingColon)}
            </span>
            <span>
              <IconLabel label={status} icon={icon} />
            </span>
          </p>
          {onUpdate ? (
            <ChangeStatusForm
              reasonType={reasonType ?? "notSelected"}
              onUpdate={onUpdate}
              onCancel={onCancel}
            />
          ) : (
            <Dialog.Footer>
              <Button
                type="submit"
                color="primary"
                onClick={onConfirm}
                disabled={disable || !onConfirm}
              >
                {intl.formatMessage(formMessages.saveChanges)}
              </Button>
              <Dialog.Close>
                <Button
                  type="button"
                  mode="inline"
                  color="warning"
                  onClick={onCancel}
                >
                  {intl.formatMessage(formMessages.cancelGoBack)}
                </Button>
              </Dialog.Close>
            </Dialog.Footer>
          )}
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ChangeStatusDialog;
