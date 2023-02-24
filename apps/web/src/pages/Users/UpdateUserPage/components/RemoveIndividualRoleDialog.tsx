import React from "react";
import { useIntl } from "react-intl";
import { TrashIcon } from "@heroicons/react/24/outline";

import { Dialog, Button, Pill } from "@gc-digital-talent/ui";

import { Role } from "~/api/generated";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";

interface RemoveIndividualRoleDialogProps {
  userName: React.ReactNode;
  role: Role;
}

const RemoveIndividualRoleDialog = ({
  userName,
  role,
}: RemoveIndividualRoleDialogProps) => {
  const intl = useIntl();
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handleRemove = async () => {
    setIsDeleting(true);
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
        toast.success(
          intl.formatMessage({
            defaultMessage: "Role removed successfully!",
            id: "qAABge",
            description:
              "Alert message displayed to user when a role was removed from a user",
          }),
        );
      }, 1000);
    })
      .then(() => setIsOpen(false))
      .finally(() => setIsDeleting(false));
  };

  const roleDisplayName = getLocalizedName(role.displayName, intl);

  const label = intl.formatMessage(
    {
      defaultMessage: "Remove role<hidden> {role}</hidden>",
      id: "fyidgo",
      description: "Label for the form to remove a role from a user",
    },
    {
      role: roleDisplayName,
    },
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="black" mode="outline">
          <TrashIcon data-h2-height="base(x.75)" data-h2-width="base(x.75)" />
          <span data-h2-visually-hidden="base(hidden)">{label}</span>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header color="ts-secondary">{label}</Dialog.Header>
        <p data-h2-margin="base(x1, 0)">
          {intl.formatMessage(
            {
              defaultMessage:
                "You are about to remove a role from the following user: <strong>{userName}</strong>",
              id: "Hy2UdW",
              description: "Lead in text for the remove role from user dialog",
            },
            { userName },
          )}
        </p>
        <p data-h2-margin="base(x1, 0)">
          {intl.formatMessage({
            defaultMessage: "They will lose the following role:",
            id: "HYYYtr",
            description:
              "Text notifying user which role will be removed from the user",
          })}
        </p>
        <p data-h2-margin="base(x1, 0)">
          <Pill mode="solid" color="blue">
            {roleDisplayName}
          </Pill>
        </p>
        <p data-h2-margin="base(x1, 0)">
          {intl.formatMessage({
            defaultMessage: "Do you wish to continue?",
            id: "vRLrmc",
            description:
              "Question posed to user before committing a destructive act",
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
            color="red"
            onClick={handleRemove}
            disabled={isDeleting}
          >
            {isDeleting ? intl.formatMessage(commonMessages.removing) : label}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default RemoveIndividualRoleDialog;
