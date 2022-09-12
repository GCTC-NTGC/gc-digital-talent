import React, { useCallback } from "react";
import { useIntl } from "react-intl";
import Dialog from "@common/components/Dialog";
import { PoolAdvertisement } from "@common/api/generated";
import { Button } from "@common/components";
import { FormProvider, useForm } from "react-hook-form";
import { Input } from "@common/components/form";
import { errorMessages } from "@common/messages";
import { currentDate } from "@common/helpers/formUtils";
import { strToDateTimeTz } from "@common/helpers/dateUtils";
import { type UpdatePoolAdvertisementInput } from "../../../api/generated";

type FormValues = {
  endDate?: PoolAdvertisement["expiryDate"];
};

export type ExtendSubmitData = Pick<UpdatePoolAdvertisementInput, "expiryDate">;

type ExtendDialogProps = {
  isOpen: boolean;
  onDismiss: () => void;
  expiryDate: NonNullable<PoolAdvertisement["expiryDate"]>;
  onExtend: (submitData: ExtendSubmitData) => void;
};

const ExtendDialog = ({
  isOpen,
  onDismiss,
  expiryDate,
  onExtend,
}: ExtendDialogProps): JSX.Element => {
  const intl = useIntl();

  const handleExtend = useCallback(
    (formValues: FormValues) => {
      onExtend({
        expiryDate: strToDateTimeTz(formValues.endDate),
      });
      onDismiss();
    },
    [onDismiss, onExtend],
  );

  const methods = useForm<FormValues>({
    defaultValues: { endDate: expiryDate },
  });

  const { handleSubmit } = methods;
  const Footer = React.useMemo(
    () => (
      <div data-h2-display="base(flex)">
        <div style={{ flexGrow: 2 } /* push other div to the right */}>
          <Button onClick={onDismiss} mode="outline" color="secondary">
            {intl.formatMessage({
              defaultMessage: "Cancel and go back",
              id: "tiF/jI",
              description: "Close dialog button",
            })}
          </Button>
        </div>
        <div>
          {/* Can't use regular Submit component since this isn't inside the form provider */}
          <Button
            onClick={methods.handleSubmit(handleExtend)}
            mode="solid"
            color="secondary"
            type="submit"
          >
            {intl.formatMessage({
              defaultMessage: "Extend closing date",
              id: "OIk63O",
              description:
                "Button to extend the pool closing date in the extend pool closing date dialog",
            })}
          </Button>
        </div>
      </div>
    ),
    [handleExtend, intl, methods, onDismiss],
  );
  return (
    <Dialog
      centered
      isOpen={isOpen}
      onDismiss={onDismiss}
      color="ts-secondary"
      title={intl.formatMessage({
        defaultMessage: "Extend Closing Date",
        id: "3mrTn5",
        description: "Heading for the extend pool closing date dialog",
      })}
    >
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
        </form>
      </FormProvider>
      <Dialog.Footer>{Footer}</Dialog.Footer>
    </Dialog>
  );
};

export default ExtendDialog;
