import React from "react";
import { useIntl } from "react-intl";
import Dialog from "@common/components/Dialog";
import { InputWrapper } from "@common/components/inputPartials";
import { PoolAdvertisement } from "@common/api/generated";
import { relativeExpiryDate } from "@common/helpers/dateUtils";
import { Button } from "@common/components";

type CloseDialogProps = {
  isOpen: boolean;
  onDismiss: () => void;
  expiryDate: NonNullable<PoolAdvertisement["expiryDate"]>;
  onClose: () => void;
};

const CloseDialog = ({
  isOpen,
  onDismiss,
  expiryDate,
  onClose,
}: CloseDialogProps): JSX.Element => {
  const intl = useIntl();
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
          <Button
            onClick={() => {
              onClose();
              onDismiss();
            }}
            mode="solid"
            color="secondary"
          >
            {intl.formatMessage({
              defaultMessage: "Close pool now",
              id: "yYDzYE",
              description: "Button to close the pool in the close pool dialog",
            })}
          </Button>
        </div>
      </div>
    ),
    [intl, onDismiss, onClose],
  );
  return (
    <Dialog
      centered
      isOpen={isOpen}
      onDismiss={onDismiss}
      color="ts-secondary"
      title={intl.formatMessage({
        defaultMessage: "Close Manually",
        id: "7k27sT",
        description: "Heading for the close pool dialog",
      })}
    >
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          defaultMessage: "This pool is set to automatically close on:",
          id: "rkPb6M",
          description: "First paragraph for the close pool dialog",
        })}
      </p>
      <InputWrapper
        inputId="closingDate"
        label="Closing Date"
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
    </Dialog>
  );
};

export default CloseDialog;
