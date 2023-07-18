import React from "react";
import { useIntl } from "react-intl";

import { Button, Dialog } from "@gc-digital-talent/ui";
import { Pool } from "@gc-digital-talent/graphql";

import { getFullPoolTitleLabel } from "~/utils/poolUtils";
import { uiMessages } from "@gc-digital-talent/i18n";

type UnarchiveDialogProps = {
  pool: Pool;
  onUnarchive: () => void;
};

const UnarchiveDialog = ({
  pool,
  onUnarchive,
}: UnarchiveDialogProps): JSX.Element => {
  const intl = useIntl();
  const Footer = React.useMemo(
    () => (
      <>
        <Dialog.Close>
          <Button color="secondary" mode="inline">
            {intl.formatMessage({
              defaultMessage: "Cancel and go back",
              id: "tiF/jI",
              description: "Close dialog button",
            })}
          </Button>
        </Dialog.Close>

        <Dialog.Close>
          <Button
            onClick={() => {
              onUnarchive();
            }}
            mode="solid"
            color="error"
          >
            {intl.formatMessage({
              defaultMessage: "Un-archive this pool",
              id: "Rs50V0",
              description:
                "Button to un-archive the pool in the un-archive pool dialog",
            })}
          </Button>
        </Dialog.Close>
      </>
    ),
    [intl, onUnarchive],
  );
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button color="secondary" mode="solid">
          {intl.formatMessage({
            defaultMessage: "Un-archive",
            id: "U/zhJQ",
            description: "Text on a button to un-archive the pool",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Un-archive this pool",
            id: "jdD/iA",
            description: "Heading for the un-archive pool dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p data-h2-margin-bottom="base(x0.5)">
            {intl.formatMessage({
              defaultMessage: "You're about to un-archive this pool:",
              id: "/42EqQ",
              description: "First paragraph for un-archive pool dialog",
            })}
          </p>
          <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x0.5)">
            {getFullPoolTitleLabel(intl, pool)}
          </p>
          <p data-h2-margin-bottom="base(x0.5)">
            {intl.formatMessage({
              defaultMessage:
                "This will show this pool back to the public.  All users associated with this pool will be able to see it on their profile information.",
              id: "8Bsa1r",
              description: "Second paragraph for un-archive pool dialog",
            })}
          </p>
          {intl.formatMessage(uiMessages.confirmContinue)}
          <Dialog.Footer>{Footer}</Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default UnarchiveDialog;
