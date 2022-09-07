import React from "react";
import { useIntl } from "react-intl";
import Dialog from "@common/components/Dialog";
import { InputWrapper } from "@common/components/inputPartials";
import { PoolAdvertisement } from "@common/api/generated";
import { relativeExpiryDate } from "@common/helpers/dateUtils";
import { Button } from "@common/components";

type PublishDialogProps = {
  isOpen: boolean;
  onDismiss: () => void;
  expiryDate: NonNullable<PoolAdvertisement["expiryDate"]>;
  onPublish: () => void;
};

const PublishDialog = ({
  isOpen,
  onDismiss,
  expiryDate,
  onPublish,
}: PublishDialogProps): JSX.Element => {
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
              onPublish();
              onDismiss();
            }}
            mode="solid"
            color="secondary"
          >
            {intl.formatMessage({
              defaultMessage: "Publish pool",
              id: "uDuEu0",
              description:
                "Button to publish the pool in the publish pool dialog",
            })}
          </Button>
        </div>
      </div>
    ),
    [intl, onDismiss, onPublish],
  );
  return (
    <Dialog
      centered
      isOpen={isOpen}
      onDismiss={onDismiss}
      color="ts-secondary"
      title={intl.formatMessage({
        defaultMessage: "Publish",
        id: "+svnC6",
        description: "Heading for the publish pool dialog",
      })}
    >
      <p>
        {intl.formatMessage({
          defaultMessage: "You're about to PUBLISH this pool.",
          id: "45BhQw",
          description: "First paragraph for publish pool dialog",
        })}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "This will make your pool available to applicants to submit applications.",
          id: "ekGCv2",
          description: "Second paragraph for publish pool dialog",
        })}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage: "This pool is set to automatically close on:",
          id: "gLHr9Y",
          description: "Third paragraph for publish pool dialog",
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
          data-h2-gap="base(.5rem, all)"
          data-h2-background-color="base(dt-gray.light)"
          data-h2-padding="base(x.5)"
          data-h2-radius="base(s)"
        >
          {relativeExpiryDate(new Date(expiryDate), intl)}
        </div>
      </InputWrapper>
      <Dialog.Footer>{Footer}</Dialog.Footer>
    </Dialog>
  );
};

export default PublishDialog;
