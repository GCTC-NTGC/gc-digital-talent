import React from "react";
import { useIntl } from "react-intl";

import { Dialog, Button, Heading } from "@gc-digital-talent/ui";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";

import { Pool } from "~/api/generated";
import { getFullPoolAdvertisementTitleHtml } from "~/utils/poolUtils";
import { checkRole } from "~/utils/teamUtils";

import { useEditPoolContext } from "./EditPoolContext";

type DuplicateDialogProps = {
  poolAdvertisement: Pool;
  onDuplicate: () => void;
};

const DuplicateDialog = ({
  poolAdvertisement,
  onDuplicate,
}: DuplicateDialogProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const { roleAssignments } = useAuthorization();
  const { isSubmitting } = useEditPoolContext();
  const intl = useIntl();

  // Only show this button to the roles that can create a pool
  if (!checkRole([ROLE_NAME.PoolOperator], roleAssignments)) {
    return null;
  }

  const title = intl.formatMessage({
    defaultMessage: "Duplicate this pool",
    id: "jCS7J4",
    description: "Title to duplicate a pool",
  });
  const poolName = getFullPoolAdvertisementTitleHtml(intl, poolAdvertisement);

  return (
    <>
      <Heading level="h3" size="h4">
        {title}
      </Heading>
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger>
          <Button color="secondary" mode="solid">
            {title}
          </Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>{title}</Dialog.Header>

          <Dialog.Body>
            <p data-h2-margin="base(x1, 0)">
              {intl.formatMessage(
                {
                  id: "oJri9k",
                  defaultMessage:
                    "You are about to duplicate the following pool: {poolName}",
                  description: "Text to confirm the pool to be duplicated",
                },
                {
                  poolName,
                },
              )}
            </p>
            <p data-h2-margin="base(x1, 0)">
              {intl.formatMessage({
                id: "7NbXj1",
                defaultMessage:
                  "This will create a new pool and copy all existing information.",
                description:
                  "Text explaining what will happen when duplicating a pool",
              })}
            </p>
            <p data-h2-margin="base(x1, 0)">
              {intl.formatMessage({
                id: "3Rad8l",
                defaultMessage:
                  "Do you wish to continue? This will navigate away from this page.",
                description:
                  "Text explaining what will happen after duplicating a pool and confirming the action",
              })}
            </p>

            <Dialog.Footer>
              <Dialog.Close>
                <Button mode="outline" color="secondary">
                  {intl.formatMessage({
                    defaultMessage: "Cancel and go back",
                    id: "tiF/jI",
                    description: "Close dialog button",
                  })}
                </Button>
              </Dialog.Close>
              <Button
                mode="solid"
                color="secondary"
                disabled={isSubmitting}
                onClick={onDuplicate}
              >
                {intl.formatMessage({
                  defaultMessage: "Duplicate and view new pool",
                  id: "b71NDl",
                  description: "Button text to duplicate a pool",
                })}
              </Button>
            </Dialog.Footer>
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

export default DuplicateDialog;
