import { useState } from "react";
import { useIntl } from "react-intl";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";

import { Dialog, Button, Chip } from "@gc-digital-talent/ui";
import {
  commonMessages,
  formMessages,
  getLocalizedName,
  uiMessages,
} from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import { Role, User } from "@gc-digital-talent/graphql";

import { getFullNameHtml } from "~/utils/nameUtils";

import { UpdateUserRolesFunc } from "../types";

interface RemoveIndividualRoleDialogProps {
  user: User;
  role: Role;
  onUpdateUserRoles: UpdateUserRolesFunc;
}

const RemoveIndividualRoleDialog = ({
  user,
  role,
  onUpdateUserRoles,
}: RemoveIndividualRoleDialogProps) => {
  const intl = useIntl();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleRemove = async () => {
    setIsDeleting(true);
    return onUpdateUserRoles({
      userId: user.id,
      roleAssignmentsInput: {
        detach: [{ roleId: role.id }],
      },
    })
      .then(() => {
        setIsOpen(false);
        toast.success(
          intl.formatMessage({
            defaultMessage: "Role removed successfully",
            id: "XcS2q2",
            description:
              "Message displayed to user when a role has been removed from a user",
          }),
        );
      })
      .finally(() => setIsDeleting(false));
  };

  const userName = getFullNameHtml(user.firstName, user.lastName, intl);
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
        <Button color="black">
          <TrashIcon data-h2-height="base(x.75)" data-h2-width="base(x.75)" />
          <span data-h2-visually-hidden="base(invisible)">{label}</span>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{label}</Dialog.Header>
        <Dialog.Body>
          <p data-h2-margin="base(0, 0 ,x1, 0)">
            {intl.formatMessage(
              {
                defaultMessage:
                  "You are about to remove a role from the following user: <strong>{userName}</strong>",
                id: "Hy2UdW",
                description:
                  "Lead in text for the remove role from user dialog",
              },
              { userName },
            )}
          </p>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              defaultMessage: "The user will lose the following role:",
              id: "VsV4Vu",
              description:
                "Text notifying user which role will be removed from the user",
            })}
          </p>
          <p data-h2-margin="base(x1, 0)">
            <Chip color="secondary">{roleDisplayName}</Chip>
          </p>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage(uiMessages.confirmContinue)}
          </p>
          <Dialog.Footer>
            <Dialog.Close>
              <Button color="secondary">
                {intl.formatMessage(formMessages.cancelGoBack)}
              </Button>
            </Dialog.Close>
            <Button
              mode="solid"
              color="error"
              onClick={handleRemove}
              disabled={isDeleting}
            >
              {isDeleting ? intl.formatMessage(commonMessages.removing) : label}
            </Button>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default RemoveIndividualRoleDialog;
