import * as React from "react";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { FormProvider, useForm } from "react-hook-form";
import { useChangeApplicationSuspendedAtMutation } from "~/api/generated";
import { useIntl } from "react-intl";

interface QualifiedRecruitmentDialogProps {
  openDialogLabel: string;
  title: string;
  primaryBodyText: string;
  secondaryBodyText: string;
  closeButtonLabel: string;
  id: string;
  isSuspended: boolean;
}

type FormValues = {
  isSuspended: boolean;
};

// TODO: Should the dialog component be pulled out into another file?
const QualifiedRecruitmentDialog = ({
  openDialogLabel,
  primaryBodyText,
  secondaryBodyText,
  closeButtonLabel,
  title,
  id,
  isSuspended,
}: QualifiedRecruitmentDialogProps) => {
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
        }
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "INSERT ERROR CONTENT HERE.",
            id: "h2nLMI",
            description:
              "Alert displayed to user suspended at value has failed to update.",
          }),
        );
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
                      id: "AVPPm0",
                      description:
                        "Label for close button on qualified recruitment card dialogs.",
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

export default QualifiedRecruitmentDialog;
