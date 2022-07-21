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
      <div data-h2-display="b(flex)">
        <div style={{ flexGrow: 2 } /* push other div to the right */}>
          <Button onClick={onDismiss} mode="outline" color="secondary">
            {intl.formatMessage({
              defaultMessage: "Cancel and go back",
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
        description: "Heading for the close pool dialog",
      })}
      footer={Footer}
    >
      <p>
        {intl.formatMessage({
          defaultMessage: "This pool is set to automatically close on:",
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
          data-h2-display="b(flex)"
          data-h2-width="b(100)"
          style={{ gap: "0.5rem" }}
          data-h2-bg-color="b(lightgray)"
          data-h2-padding="b(all, xs)"
          data-h2-radius="b(s)"
        >
          {relativeExpiryDate(new Date(expiryDate), intl)}
        </div>
      </InputWrapper>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "You can choose to manually close it now, this will prevent users from submitting applications.",
          description: "Second paragraph for the close pool dialog",
        })}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage: "Are you sure you want to continue?",
          description: "Third paragraph for Close pool dialog",
        })}
      </p>
    </Dialog>
  );
};

export default CloseDialog;
