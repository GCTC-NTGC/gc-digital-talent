import * as React from "react";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { FormProvider, useForm } from "react-hook-form";
import { useChangeApplicationSuspendedAtMutation } from "~/api/generated";
import { useIntl } from "react-intl";

interface TrackApplicationsDialogProps {
  id: string;
  title: string;
  isSuspended: boolean;
  primaryBodyText: string;
  secondaryBodyText: string;
  openDialogLabel: string;
  closeButtonLabel: string;
  successMessage: React.ReactNode;
  errorMessage: React.ReactNode;
}

type FormValues = {
  isSuspended: boolean;
};

const TrackApplicationsDialog = ({
  id,
  title,
  isSuspended,
  primaryBodyText,
  secondaryBodyText,
  openDialogLabel,
  closeButtonLabel,
  successMessage,
  errorMessage,
}: TrackApplicationsDialogProps) => {
  const intl = useIntl();
  const [, executeMutation] = useChangeApplicationSuspendedAtMutation();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const methods = useForm<FormValues>({ defaultValues: { isSuspended } });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const updateSuspendedAtStatus = async () => {
    await executeMutation({
      id,
      isSuspended: !isSuspended,
    })
      .then((res) => {
        if (!res.error) {
          setIsOpen(false);
          toast.success(successMessage);
        }
      })
      .catch(() => {
        toast.error(errorMessage);
      });
  };
  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="black" mode="inline">
          {openDialogLabel}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{title}</Dialog.Header>
        <Dialog.Body>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(updateSuspendedAtStatus)}>
              <p
                data-h2-font-weight="base(700)"
                data-h2-margin="base(0, 0, x.25, 0)"
              >
                {primaryBodyText}
              </p>
              <p>{secondaryBodyText}</p>

              <Dialog.Footer data-h2-justify-content="base(space-between)">
                <Dialog.Close>
                  <Button color="secondary" mode="inline">
                    {intl.formatMessage({
                      defaultMessage: "Cancel",
                      id: "9U2gWd",
                      description: "Label for close button on card dialogs.",
                    })}
                  </Button>
                </Dialog.Close>
                <Button
                  type="submit"
                  mode="solid"
                  color="secondary"
                  data-h2-display="base(flex)"
                  data-h2-align-items="base(center)"
                  disabled={isSubmitting}
                >
                  {closeButtonLabel}
                </Button>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default TrackApplicationsDialog;
