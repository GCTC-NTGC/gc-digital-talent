import React from "react";
import { useFormState } from "react-hook-form";
import { useIntl } from "react-intl";

import { Button, Dialog } from "@gc-digital-talent/ui";
import { formMessages } from "@gc-digital-talent/i18n";

interface DialogFooterProps {
  saveText?: string;
  disabled?: boolean;
}

const DialogFooter = ({ saveText, disabled }: DialogFooterProps) => {
  const intl = useIntl();
  const { isSubmitting } = useFormState();
  return (
    <div data-h2-width="base(100%)">
      <Button
        type="submit"
        mode="solid"
        color="secondary"
        disabled={disabled || isSubmitting}
      >
        <span>{saveText || intl.formatMessage(formMessages.saveChanges)}</span>
      </Button>
      <Dialog.Close
        data-h2-align-self="base(center)"
        data-h2-padding-left="base(x1)"
      >
        <Button type="button" mode="inline" color="tertiary">
          {intl.formatMessage({
            defaultMessage: "Cancel",
            id: "LjE48l",
            description: "Button text to close employment equity form.",
          })}
        </Button>
      </Dialog.Close>
    </div>
  );
};

export default DialogFooter;
