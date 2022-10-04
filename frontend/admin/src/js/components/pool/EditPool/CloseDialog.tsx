import React from "react";
import { useIntl } from "react-intl";
import Dialog from "@common/components/Dialog";
import { InputWrapper } from "@common/components/inputPartials";
import { PoolAdvertisement } from "@common/api/generated";
import { relativeExpiryDate } from "@common/helpers/dateUtils";
import { Button } from "@common/components";

type CloseDialogProps = {
  expiryDate: NonNullable<PoolAdvertisement["expiryDate"]>;
  onClose: () => void;
};

const CloseDialog = ({
  expiryDate,
  onClose,
}: CloseDialogProps): JSX.Element => {
  const intl = useIntl();
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
            <Button
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
    [intl, onClose],
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
        <Dialog.Header color="ts-secondary">
          {intl.formatMessage({
            defaultMessage: "Close Manually",
            id: "7k27sT",
            description: "Heading for the close pool dialog",
          })}
        </Dialog.Header>
        <p data-h2-margin="base(x1, 0)">
          {intl.formatMessage({
            defaultMessage: "This pool is set to automatically close on:",
            id: "rkPb6M",
            description: "First paragraph for the close pool dialog",
          })}
        </p>
        <InputWrapper
          inputId="closingDate"
          label={intl.formatMessage({
            defaultMessage: "Closing Date",
            id: "7OQHcx",
            description: "Closing Date field label for close pool dialog",
          })}
          hideOptional
          required={false}
        >
          <div
            data-h2-display="base(flex)"
            data-h2-width="base(100%)"
            data-h2-gap="base(.5rem)"
            data-h2-background-color="base(dt-gray.light)"
            data-h2-padding="base(x.25)"
            data-h2-radius="base(s)"
          >
            {relativeExpiryDate(new Date(expiryDate), intl)}
          </div>
        </InputWrapper>
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
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default CloseDialog;
