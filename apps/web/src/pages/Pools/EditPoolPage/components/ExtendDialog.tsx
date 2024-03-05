import React, { useCallback } from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { DateInput } from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  formMessages,
} from "@gc-digital-talent/i18n";
import {
  convertDateTimeZone,
  strToFormDate,
} from "@gc-digital-talent/date-helpers";
import { Pool, Scalars } from "@gc-digital-talent/graphql";

type FormValues = {
  expiryEndDate?: Pool["closingDate"];
};

type ExtendDialogProps = {
  closingDate: Pool["closingDate"];
  onExtend: (closingDate: Scalars["DateTime"]["output"]) => Promise<void>;
};

const ExtendDialog = ({
  closingDate,
  onExtend,
}: ExtendDialogProps): JSX.Element => {
  const intl = useIntl();
  const [open, setOpen] = React.useState(false);
  const todayDate = new Date();

  const handleExtend = useCallback(
    async (formValues: FormValues) => {
      const closingDateInUtc = formValues.expiryEndDate
        ? convertDateTimeZone(
            `${formValues.expiryEndDate} 23:59:59`,
            "Canada/Pacific",
            "UTC",
          )
        : "";

      await onExtend(closingDateInUtc).then(() => setOpen(false));
    },
    [onExtend],
  );

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

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button color="secondary" mode="solid">
          {intl.formatMessage({
            defaultMessage: "Extend the date",
            id: "jiUwae",
            description: "Text on a button to extend the expiry date the pool",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Extend Closing Date",
            id: "3mrTn5",
            description: "Heading for the extend pool closing date dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "The closing time will be automatically set to 11:59 PM in the Pacific time zone.",
              id: "Aaas0w",
              description: "Helper message for changing the pool closing date",
            })}
          </p>
          <p data-h2-margin="base(x.5 0)">
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
              <Dialog.Footer>
                <div style={{ flexGrow: 2 } /* push other div to the right */}>
                  <Dialog.Close>
                    <Button color="secondary">
                      {intl.formatMessage(formMessages.cancelGoBack)}
                    </Button>
                  </Dialog.Close>
                </div>
                <div>
                  <Button
                    mode="solid"
                    color="secondary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? intl.formatMessage(commonMessages.saving)
                      : intl.formatMessage({
                          defaultMessage: "Extend closing date",
                          id: "OIk63O",
                          description:
                            "Button to extend the pool closing date in the extend pool closing date dialog",
                        })}
                  </Button>
                </div>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ExtendDialog;
