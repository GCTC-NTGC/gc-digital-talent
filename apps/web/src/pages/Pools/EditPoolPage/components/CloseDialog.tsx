import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";

import { Dialog, Button } from "@gc-digital-talent/ui";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { formMessages } from "@gc-digital-talent/i18n";
import { Pool } from "@gc-digital-talent/graphql";

type CloseDialogProps = {
  closingDate: Pool["closingDate"];
  onClose: () => void;
};

const CloseDialog = ({
  closingDate,
  onClose,
}: CloseDialogProps): JSX.Element => {
  const intl = useIntl();
  const methods = useForm();
  const {
    formState: { isSubmitting },
  } = methods;
  const Footer = React.useMemo(
    () => (
      <>
        <div style={{ flexGrow: 2 } /* push other div to the right */}>
          <Dialog.Close>
            <Button color="secondary">
              {intl.formatMessage(formMessages.cancelGoBack)}
            </Button>
          </Dialog.Close>
        </div>
        <div>
          <Dialog.Close>
            <Button
              disabled={isSubmitting}
              onClick={() => {
                onClose();
              }}
              mode="solid"
              color="secondary"
            >
              {intl.formatMessage({
                defaultMessage: "Close pool now",
                id: "yYDzYE",
                description:
                  "Button to close the pool in the close pool dialog",
              })}
            </Button>
          </Dialog.Close>
        </div>
      </>
    ),
    [intl, isSubmitting, onClose],
  );
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button color="secondary" mode="solid">
          {intl.formatMessage({
            defaultMessage: "Close",
            id: "BhtXXY",
            description: "Text on a button to close the pool",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Close Manually",
            id: "7k27sT",
            description: "Heading for the close pool dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <FormProvider {...methods}>
            <p data-h2-margin="base(x1, 0)">
              {intl.formatMessage({
                defaultMessage: "This pool is set to automatically close on:",
                id: "rkPb6M",
                description: "First paragraph for the close pool dialog",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage: "Closing Date",
                id: "7OQHcx",
                description: "Closing Date field label for close pool dialog",
              })}
            </p>
            <div
              data-h2-width="base(100%)"
              data-h2-background-color="base(gray.light)"
              data-h2-padding="base(x.5)"
              data-h2-radius="base(s)"
            >
              {closingDate
                ? formatDate({
                    date: parseDateTimeUtc(closingDate),
                    formatString: "PPP",
                    intl,
                    timeZone: "Canada/Pacific",
                  })
                : ""}
            </div>
            <p data-h2-margin="base(x1, 0)">
              {intl.formatMessage({
                defaultMessage:
                  "You can choose to manually close it now, this will prevent users from submitting applications.",
                id: "NljjDf",
                description: "Second paragraph for the close pool dialog",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage: "Are you sure you want to continue?",
                id: "2++hVA",
                description: "Third paragraph for Close pool dialog",
              })}
            </p>
            <Dialog.Footer>{Footer}</Dialog.Footer>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default CloseDialog;
