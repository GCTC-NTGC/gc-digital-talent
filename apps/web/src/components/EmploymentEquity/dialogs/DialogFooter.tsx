import { useFormState } from "react-hook-form";
import { useIntl } from "react-intl";

import { Button, Dialog } from "@gc-digital-talent/ui";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";

interface DialogFooterProps {
  saveText?: string;
  disabled?: boolean;
}

const DialogFooter = ({ saveText, disabled }: DialogFooterProps) => {
  const intl = useIntl();
  const { isSubmitting } = useFormState();
  return (
    <div className="w-100">
      <Button
        type="submit"
        mode="solid"
        color="secondary"
        disabled={disabled || isSubmitting}
      >
        <span>{saveText || intl.formatMessage(formMessages.saveChanges)}</span>
      </Button>
      <Dialog.Close className="ml-6">
        <Button type="button" mode="inline" color="warning">
          {intl.formatMessage(commonMessages.cancel)}
        </Button>
      </Dialog.Close>
    </div>
  );
};

export default DialogFooter;
