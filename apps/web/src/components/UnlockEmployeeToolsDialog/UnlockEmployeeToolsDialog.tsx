import { ReactNode, useState } from "react";
import { defineMessage, useIntl } from "react-intl";

import { Button, Dialog } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import BoolCheckIcon from "../BoolCheckIcon/BoolCheckIcon";

const dialogTitle = defineMessage({
  defaultMessage: "Unlock employee tools",
  id: "Q87hfV",
  description: "Title for the dialog to unlock the employee tools",
});

const dialogSubtitle = defineMessage({
  defaultMessage:
    "Verify your status as an employee to gain access to internal career development tools.",
  id: "WswBQ+",
  description: "Subtitle for the dialog to unlock the employee tools",
});

interface UnlockEmployeeToolsDialogProps {
  children?: ReactNode;
  defaultOpen?: boolean;
}

const UnlockEmployeeToolsDialog = ({
  children,
  defaultOpen = false,
}: UnlockEmployeeToolsDialogProps) => {
  const intl = useIntl();
  const [isOpen, setOpen] = useState<boolean>(defaultOpen);

  return (
    <Dialog.Root open={isOpen} onOpenChange={setOpen}>
      <Dialog.Trigger>
        {children || <Button>{intl.formatMessage(dialogTitle)}</Button>}
      </Dialog.Trigger>
      <Dialog.Content hasSubtitle>
        <Dialog.Header subtitle={intl.formatMessage(dialogSubtitle)}>
          {intl.formatMessage(dialogTitle)}
        </Dialog.Header>
        <Dialog.Body>
          <p className="mb-6">
            {intl.formatMessage({
              defaultMessage:
                "Confirm your employee status to unlock exclusive tools. Simply verify your work email address and add your current Government of Canada position to your career experience.",
              id: "6kjRxg",
              description:
                "Subtitle for the dialog to unlock the employee tools",
            })}
          </p>
          <div className="flex flex-col gap-6 sm:flex-row">
            <BoolCheckIcon>
              {intl.formatMessage({
                defaultMessage: "Verified work email",
                id: "xVcPXK",
                description: "A label for status icon checking work email",
              })}
            </BoolCheckIcon>
            <BoolCheckIcon>
              {intl.formatMessage({
                defaultMessage: "Current GC work experience",
                id: "jDaXen",
                description: "A label for status icon checking work experience",
              })}
            </BoolCheckIcon>
          </div>
          <Dialog.Footer className="flex flex-col gap-6 sm:flex-row">
            <Button>
              {intl.formatMessage({
                defaultMessage: "Verify work email",
                id: "OvusdX",
                description: "Label to go to email verification",
              })}
            </Button>
            <Button>
              {intl.formatMessage({
                defaultMessage: "Add GC work experience",
                id: "izAPZA",
                description: "Label to go to adding experiences",
              })}
            </Button>
            <Button mode="inline" color="warning">
              {intl.formatMessage(commonMessages.cancel)}
            </Button>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default UnlockEmployeeToolsDialog;
