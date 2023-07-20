import React from "react";
import { useIntl } from "react-intl";

import { Button, Dialog } from "@gc-digital-talent/ui";

interface DialogFooterProps {
  saveText?: string;
}

const DialogFooter = ({ saveText }: DialogFooterProps) => {
  const intl = useIntl();
  return (
    <div data-h2-width="base(100%)">
      <Button type="submit" mode="solid" color="secondary">
        <span>
          {saveText ||
            intl.formatMessage({
              defaultMessage: "Save changes",
              id: "m8S3S/",
              description: "Button text to submit employment equity form.",
            })}
        </span>
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
