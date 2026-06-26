import { useIntl } from "react-intl";
import type { ReactNode } from "react";

import { Dialog, IconLabel, type IconType } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import talentRequestMessages from "~/messages/talentRequestMessages";

interface StatusDialogLayoutProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icon: IconType;
  statusLabel: string;
  selectedCount: number;
  children: ReactNode;
}

const StatusDialogLayout = ({
  open,
  onOpenChange,
  icon,
  statusLabel,
  selectedCount,
  children,
}: StatusDialogLayoutProps) => {
  const intl = useIntl();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Update the status of the selected users in this request.",
            id: "q0Xh8C",
            description:
              "Subtitle for the change status dialog in the tracked users inbox",
          })}
        >
          {intl.formatMessage(talentRequestMessages.changeStatus, { status: statusLabel })}
        </Dialog.Header>
        <Dialog.Body>
          <p className="mb-6 flex flex-col gap-3">
            <span>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "The selected users <strong>({count})</strong> will be marked as",
                  id: "mq7Yzf",
                  description:
                    "Lead-in describing how many selected tracked users will change status",
                },
                { count: selectedCount },
              )}
              {intl.formatMessage(commonMessages.dividingColon)}
            </span>
            <span>
              <IconLabel label={statusLabel} icon={icon} />
            </span>
          </p>
          {children}
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default StatusDialogLayout;
