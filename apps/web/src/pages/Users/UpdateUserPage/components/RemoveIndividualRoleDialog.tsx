import { useState } from "react";
import { useIntl } from "react-intl";
import TrashIcon from "@heroicons/react/20/solid/TrashIcon";

import { Dialog, Button, Chip, IconButton } from "@gc-digital-talent/ui";
import {
  commonMessages,
  formMessages,
  getLocalizedName,
  uiMessages,
} from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import { Maybe, Role } from "@gc-digital-talent/graphql";

import { getFullNameHtml } from "~/utils/nameUtils";
import adminMessages from "~/messages/adminMessages";

import { UpdateUserRolesFunc } from "../types";

interface RemoveIndividualRoleDialogProps {
  userId: string;
  firstName?: Maybe<string>;
  lastName?: Maybe<string>;
  role: Role;
  onUpdateUserRoles: UpdateUserRolesFunc;
}

const RemoveIndividualRoleDialog = ({
  userId,
  firstName,
  lastName,
  role,
  onUpdateUserRoles,
}: RemoveIndividualRoleDialogProps) => {
  const intl = useIntl();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleRemove = async () => {
    setIsDeleting(true);
    return onUpdateUserRoles({
      userId: userId,
      roleAssignmentsInput: {
        detach: [{ roleId: role.id }],
      },
    })
      .then(() => {
        setIsOpen(false);
        toast.success(intl.formatMessage(adminMessages.roleRemoved));
      })
      .finally(() => setIsDeleting(false));
  };

  const userName = getFullNameHtml(firstName, lastName, intl);
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
        <IconButton color="error" icon={TrashIcon} label={label} />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{label}</Dialog.Header>
        <Dialog.Body>
          <p className="mb-6">
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
          <p className="my-6">
            {intl.formatMessage({
              defaultMessage: "The user will lose the following role:",
              id: "VsV4Vu",
              description:
                "Text notifying user which role will be removed from the user",
            })}
          </p>
          <p className="my-6">
            <Chip color="secondary">{roleDisplayName}</Chip>
          </p>
          <p className="my-6">
            {intl.formatMessage(uiMessages.confirmContinue)}
          </p>
          <Dialog.Footer>
            <Dialog.Close>
              <Button color="primary">
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
