import React, { useCallback } from "react";
import { useIntl } from "react-intl";
import Dialog from "@common/components/Dialog";
import { PoolAdvertisement } from "@common/api/generated";
import { Button } from "@common/components";
import { FormProvider, useForm } from "react-hook-form";
import { Input } from "@common/components/form";
import { errorMessages } from "@common/messages";
import { currentDate } from "@common/helpers/formUtils";
import { convertDateTimeZone } from "@common/helpers/dateUtils";
import { type UpdatePoolAdvertisementInput } from "../../../api/generated";

type FormValues = {
  endDate?: PoolAdvertisement["expiryDate"];
};

export type ExtendSubmitData = Pick<UpdatePoolAdvertisementInput, "expiryDate">;

type ExtendDialogProps = {
  expiryDate: PoolAdvertisement["expiryDate"];
  onExtend: (submitData: ExtendSubmitData) => void;
};

const ExtendDialog = ({
  expiryDate,
  onExtend,
}: ExtendDialogProps): JSX.Element => {
  const intl = useIntl();

  const handleExtend = useCallback(
    (formValues: FormValues) => {
      const expiryDateInUtc = formValues.endDate
        ? convertDateTimeZone(
            `${formValues.endDate} 23:59:59`,
            "Canada/Pacific",
            "UTC",
          )
        : null;

      onExtend({
        expiryDate: expiryDateInUtc,
      });
    },
    [onExtend],
  );

  const methods = useForm<FormValues>({
    defaultValues: { endDate: expiryDate },
  });

  const { handleSubmit } = methods;
  const Footer = React.useMemo(
    () => (
      <>
        <div style={{ flexGrow: 2 } /* push other div to the right */}>
          <Dialog.Close>
            <Button mode="outline" color="secondary">
              {intl.formatMessage({
                defaultMessage: "Cancel and go back",
                id: "tiF/jI",
                description: "Close dialog button",
              })}
            </Button>
          </Dialog.Close>
        </div>
        <div>
          <Dialog.Close>
            <Button mode="solid" color="secondary" type="submit">
              {intl.formatMessage({
                defaultMessage: "Extend closing date",
                id: "OIk63O",
                description:
                  "Button to extend the pool closing date in the extend pool closing date dialog",
              })}
            </Button>
          </Dialog.Close>
        </div>
      </>
    ),
    [intl],
  );
  return (
    <Dialog.Root>
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
        <Dialog.Header color="ts-secondary">
          {intl.formatMessage({
            defaultMessage: "Extend Closing Date",
            id: "3mrTn5",
            description: "Heading for the extend pool closing date dialog",
          })}
        </Dialog.Header>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "The closing time will be automatically set to 11:59 PM in the Pacific time zone.",
            id: "Aaas0w",
            description: "Helper message for changing the pool closing date",
          })}
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage: "Write a new closing date:",
            id: "BQsJSG",
            description: "First paragraph for extend pool closing date dialog",
          })}
        </p>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleExtend)}>
            <Input
              id="extendDialog-endDate"
              label={intl.formatMessage({
                defaultMessage: "End Date",
                id: "80DOGy",
                description:
                  "Label displayed on the pool candidate form end date field.",
              })}
              type="date"
              name="endDate"
              rules={{
                required: intl.formatMessage(errorMessages.required),
                min: {
                  value: currentDate(),
                  message: intl.formatMessage(errorMessages.futureDate),
                },
              }}
            />
            <Dialog.Footer>{Footer}</Dialog.Footer>
          </form>
        </FormProvider>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ExtendDialog;
