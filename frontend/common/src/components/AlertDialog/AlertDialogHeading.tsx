import React from "react";
import { useIntl } from "react-intl";
import { AlertDialogLabel } from "@reach/alert-dialog";
import { XMarkIcon } from "@heroicons/react/24/outline";

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
      data-h2-radius="base(s, s, none, none)"
      data-h2-padding="base(x1)"
      data-h2-position="base(relative)"
    >
      <button
        type="button"
        onClick={onDismiss}
        className="alert-dialog-close"
        data-h2-padding="base(x.5)"
        data-h2-position="base(absolute)"
        data-h2-offset="base(x.5, x.5, auto, auto)"
        data-h2-color="base(dt-black)"
      >
        <span data-h2-visibility="base(invisible)">
          {intl.formatMessage({
            defaultMessage: "Close dialog",
            id: "g2X8Fx",
            description: "Text for the button to close a modal dialog.",
          })}
        </span>
        <XMarkIcon className="alert-dialog-close__icon" />
      </button>
      <AlertDialogLabel
        data-h2-font-weight="base(700)"
        data-h2-font-size="base(h3)"
        data-h2-margin="base(0)"
      >
        {children}
      </AlertDialogLabel>
    </div>
  );
};

export default AlertDialogHeading;
