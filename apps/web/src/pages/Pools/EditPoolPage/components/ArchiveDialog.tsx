import React from "react";
import { useIntl } from "react-intl";

import { Button, Dialog } from "@gc-digital-talent/ui";
import { Pool } from "@gc-digital-talent/graphql";

import { getFullPoolTitleLabel } from "~/utils/poolUtils";

type ArchiveDialogProps = {
  pool: Pool;
  onArchive: () => void;
};

const ArchiveDialog = ({
  pool,
  onArchive,
}: ArchiveDialogProps): JSX.Element => {
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
              onArchive();
            }}
            mode="solid"
            color="error"
          >
            {intl.formatMessage({
              defaultMessage: "Archive this pool",
              id: "Jp0Beg",
              description:
                "Button to archive the pool in the archive pool dialog",
            })}
          </Button>
        </Dialog.Close>
      </>
    ),
    [intl, onArchive],
  );
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button color="secondary" mode="solid">
          {intl.formatMessage({
            defaultMessage: "Archive",
            id: "P8NuMo",
            description: "Text on a button to archive the pool",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Archive this pool",
            id: "7gOyU5",
            description: "Heading for the archive pool dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <p data-h2-margin-bottom="base(x0.5)">
            {intl.formatMessage({
              defaultMessage: "You're about to archive this pool:",
              id: "FboyrB",
              description: "First paragraph for archive pool dialog",
            })}
          </p>
          <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x0.5)">
            {getFullPoolTitleLabel(intl, pool)}
          </p>
          <p data-h2-margin-bottom="base(x0.5)">
            {intl.formatMessage({
              defaultMessage:
                "This will hide this pool from all relevant tables and from a user's pool information.",
              id: "FGedDI",
              description: "Second paragraph for archive pool dialog",
            })}
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage: "Do you wish to continue?",
              id: "qYr1H8",
              description: "Third paragraph for archive pool dialog",
            })}
          </p>
          <Dialog.Footer>{Footer}</Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ArchiveDialog;
