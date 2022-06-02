import React from "react";
import { useIntl } from "react-intl";
import Dialog from "@common/components/Dialog";
import Button from "@common/components/Button";

export interface DialogLevelsProps {
  isOpen: boolean;
  onDismiss: () => void;
}

export interface CloseDialogButtonProps {
  close: () => void;
  children?: React.ReactNode;
}

export const CloseDialogButton: React.FC<CloseDialogButtonProps> = ({
  close,
  children,
}) => {
  return (
    <Button type="button" mode="outline" color="secondary" onClick={close}>
      {children}
    </Button>
  );
};

export const ChangeStatusDialog: React.FC<DialogLevelsProps> = ({
  isOpen,
  onDismiss,
}) => {
  const intl = useIntl();

  return (
    <Dialog
      title={intl.formatMessage({
        defaultMessage: "Change status",
        description: "title for change status dialog on view-user page",
      })}
      color="ts-primary"
      isOpen={isOpen}
      onDismiss={onDismiss}
      footer={
        <div data-h2-display="b(flex)" data-h2-justify-content="b(center)">
          <CloseDialogButton close={onDismiss}>
            {intl.formatMessage({
              defaultMessage: "Close",
              description: "Close Confirmations",
            })}
          </CloseDialogButton>
        </div>
      }
    >
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Technicians (IT-01) provide technical support in the development, implementation, integration, and maintenance of service delivery to clients and stakeholders",
          description: "blurb describing IT-01",
        })}
      </p>
    </Dialog>
  );
};
