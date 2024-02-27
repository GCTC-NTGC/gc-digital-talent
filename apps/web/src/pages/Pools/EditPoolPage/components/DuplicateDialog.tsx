import React from "react";
import { useIntl } from "react-intl";

import { Dialog, Button, Heading } from "@gc-digital-talent/ui";
import { ROLE_NAME, useAuthorization } from "@gc-digital-talent/auth";
import { formMessages } from "@gc-digital-talent/i18n";
import { Pool } from "@gc-digital-talent/graphql";

import { getShortPoolTitleHtml } from "~/utils/poolUtils";
import { checkRole } from "~/utils/teamUtils";

import { useEditPoolContext } from "./EditPoolContext";

type DuplicateDialogProps = {
  pool: Pool;
  onDuplicate: () => void;
};

const DuplicateDialog = ({ pool, onDuplicate }: DuplicateDialogProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const { roleAssignments } = useAuthorization();
  const { isSubmitting } = useEditPoolContext();
  const intl = useIntl();

  // Only show this button to the roles that can create a pool
  if (!checkRole([ROLE_NAME.PoolOperator], roleAssignments)) {
    return null;
  }

  const title = intl.formatMessage({
    defaultMessage: "Duplicate job poster",
    id: "DxvIPq",
    description: "Title to duplicate a job poster",
  });
  const poolName = getShortPoolTitleHtml(intl, pool);

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
                <Button color="secondary">
                  {intl.formatMessage(formMessages.cancelGoBack)}
                </Button>
              </Dialog.Close>
              <Button
                mode="solid"
                color="secondary"
                disabled={isSubmitting}
                onClick={onDuplicate}
              >
                {intl.formatMessage({
                  defaultMessage: "Duplicate and view new job poster",
                  id: "QmMm7V",
                  description: "Button text to duplicate a job poster",
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
