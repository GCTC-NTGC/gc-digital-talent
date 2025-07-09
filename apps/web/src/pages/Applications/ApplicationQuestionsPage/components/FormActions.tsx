import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";

import { Button, Separator } from "@gc-digital-talent/ui";

import applicationMessages from "~/messages/applicationMessages";

interface FormActionsProps {
  disabled?: boolean;
}

const FormActions = ({ disabled = false }: FormActionsProps) => {
  const intl = useIntl();
  const {
    register,
    setValue,
    formState: { isSubmitting },
  } = useFormContext();
  const actionProps = register("action");

  return (
    <>
      <Separator />
      <div className="flex flex-col flex-wrap items-start gap-6 sm:flex-row sm:items-center">
        <Button
          type="submit"
          color="primary"
          value="continue"
          disabled={disabled || isSubmitting}
          {...actionProps}
          onClick={() => setValue("action", "continue")}
        >
          {intl.formatMessage(applicationMessages.saveContinue)}
        </Button>
        <Button
          type="submit"
          mode="inline"
          color="primary"
          value="cancel"
          disabled={disabled || isSubmitting}
          {...actionProps}
          onClick={() => setValue("action", "cancel")}
        >
          {intl.formatMessage(applicationMessages.saveQuit)}
        </Button>
      </div>
    </>
  );
};

export default FormActions;
