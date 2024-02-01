import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useIntl } from "react-intl";

import { Dialog, Button } from "@gc-digital-talent/ui";
import {
  convertDateTimeZone,
  strToFormDate,
} from "@gc-digital-talent/date-helpers";
import { DateInput } from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  formMessages,
} from "@gc-digital-talent/i18n";

import { Pool, Scalars } from "~/api/generated";

import { ProcessDialogProps } from "./types";

type FormValues = {
  expiryEndDate?: Pool["closingDate"];
};

type ExtendProcessDialogProps = ProcessDialogProps & {
  closingDate?: Pool["closingDate"];
  onExtend: (closingDate: Scalars["DateTime"]) => Promise<void>;
};

const ExtendProcessDialog = ({
  poolName,
  closingDate,
  onExtend,
}: ExtendProcessDialogProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const intl = useIntl();
  const todayDate = new Date();

  const methods = useForm<FormValues>({
    defaultValues: {
      expiryEndDate: closingDate
        ? new Date(closingDate).toISOString().split("T")[0]
        : "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleExtend = React.useCallback(
    async (formValues: FormValues) => {
      const closingDateInUtc = formValues.expiryEndDate
        ? convertDateTimeZone(
            `${formValues.expiryEndDate} 23:59:59`,
            "Canada/Pacific",
            "UTC",
          )
        : "";

      await onExtend(closingDateInUtc).then(() => setIsOpen(false));
    },
    [onExtend],
  );

  const title = intl.formatMessage({
    defaultMessage: "Extend closing date",
    id: "F3Ma0i",
    description: "Title to extend a process",
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="secondary" mode="inline">
          {title}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{title}</Dialog.Header>
        <Dialog.Body>
          <p data-h2-margin-bottom="base(x1)">
            {intl.formatMessage(
              {
                id: "DpzAPD",
                defaultMessage:
                  "You are about to extend the closing date of this process: {poolName}",
                description: "Text to confirm the process to be extend",
              },
              {
                poolName,
              },
            )}
          </p>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              defaultMessage:
                "The closing time will be automatically set to 11:59 PM in the Pacific time zone.",
              id: "Aaas0w",
              description: "Helper message for changing the pool closing date",
            })}
          </p>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              defaultMessage: "Write a new closing date:",
              id: "BQsJSG",
              description:
                "First paragraph for extend pool closing date dialog",
            })}
          </p>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleExtend)}>
              <DateInput
                id="expiryEndDate"
                legend={intl.formatMessage({
                  defaultMessage: "End Date",
                  id: "80DOGy",
                  description:
                    "Label displayed on the pool candidate form end date field.",
                })}
                name="expiryEndDate"
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                  min: {
                    value: strToFormDate(todayDate.toISOString()),
                    message: intl.formatMessage(errorMessages.futureDate),
                  },
                }}
              />
              <Dialog.Footer data-h2-justify-content="base(flex-start)">
                <Button
                  type="submit"
                  mode="solid"
                  color="secondary"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? intl.formatMessage(commonMessages.saving)
                    : title}
                </Button>
                <Dialog.Close>
                  <Button type="button" color="warning" mode="inline">
                    {intl.formatMessage(formMessages.cancelGoBack)}
                  </Button>
                </Dialog.Close>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ExtendProcessDialog;
