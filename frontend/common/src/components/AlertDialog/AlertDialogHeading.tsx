import React from "react";
import { useIntl } from "react-intl";
import { AlertDialogLabel } from "@reach/alert-dialog";
import { XIcon } from "@heroicons/react/outline";

export interface AlertDialogHeadingProps {
  children: React.ReactNode;
  onDismiss: () => void;
}

const AlertDialogHeading = ({
  children,
  onDismiss,
}: AlertDialogHeadingProps) => {
  const intl = useIntl();
  return (
    <div
      className="alert-dialog__header"
      data-h2-radius="b(s, s, none, none)"
      data-h2-padding="b(all, m)"
      data-h2-position="b(relative)"
    >
      <button
        type="button"
        onClick={onDismiss}
        className="alert-dialog-close"
        data-h2-padding="b(all, xs)"
        data-h2-position="b(absolute)"
        data-h2-location="b(top-right, s)"
        data-h2-font-color="b(black)"
      >
        <span data-h2-visibility="b(invisible)">
          {intl.formatMessage({
            defaultMessage: "Close dialog",
            description: "Text for the button to close a modal dialog.",
          })}
        </span>
        <XIcon className="alert-dialog-close__icon" />
      </button>
      <AlertDialogLabel
        data-h2-font-weight="b(700)"
        data-h2-font-size="b(h3)"
        data-h2-margin="b(all, none)"
      >
        {children}
      </AlertDialogLabel>
    </div>
  );
};

export default AlertDialogHeading;
