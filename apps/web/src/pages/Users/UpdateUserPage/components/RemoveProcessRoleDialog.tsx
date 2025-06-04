import { useState } from "react";
import { useIntl } from "react-intl";
import TrashIcon from "@heroicons/react/20/solid/TrashIcon";

import { Dialog, Button, Chip, Chips, IconButton } from "@gc-digital-talent/ui";
import {
  commonMessages,
  formMessages,
  getLocalizedName,
  uiMessages,
} from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import {
  UpdateUserRolesInput,
  UpdateUserRolesMutation,
  Role,
  User,
  RoleInput,
} from "@gc-digital-talent/graphql";

import { getFullNameHtml } from "~/utils/nameUtils";
import adminMessages from "~/messages/adminMessages";

import { PoolTeamable } from "../types";

interface RemoveProcessRoleDialogProps {
  user: Pick<User, "id" | "firstName" | "lastName">;
  roles: Role[];
  pool: PoolTeamable;
  onRemoveRoles: (
    submitData: UpdateUserRolesInput,
  ) => Promise<UpdateUserRolesMutation["updateUserRoles"]>;
}

const RemoveProcessRoleDialog = ({
  user,
  roles,
  pool,
  onRemoveRoles,
}: RemoveProcessRoleDialogProps) => {
  const intl = useIntl();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { id, firstName, lastName } = user;

  const handleRemove = async () => {
    const roleInputArray: RoleInput[] = roles.map((r) => {
      return { roleId: r.id, teamId: pool.teamIdForRoleAssignment };
    });
    setIsDeleting(true);
    return onRemoveRoles({
      userId: id,
      roleAssignmentsInput: {
        detach: roleInputArray,
      },
    })
      .then(() => {
        setIsOpen(false);
        toast.success(intl.formatMessage(adminMessages.roleRemoved));
      })
      .catch(() => {
        toast.error(intl.formatMessage(adminMessages.rolesUpdateFailed));
      })
      .finally(() => setIsDeleting(false));
  };

  const userName = getFullNameHtml(firstName, lastName, intl);
  const roleDisplayName = (role: Role) =>
    getLocalizedName(role.displayName, intl);
  const poolDisplayName = getLocalizedName(pool.name, intl);

  const dialogLabel = intl.formatMessage({
    defaultMessage: "Remove from process",
    id: "l7Xz4j",
    description: "Header for the form to remove a process role from a user",
  });

  const buttonLabel = intl.formatMessage({
    defaultMessage: "Remove from process",
    id: "Hah9mB",
    description:
      "Button label for the form to remove a process role from a user",
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <IconButton color="error" icon={TrashIcon} label={buttonLabel} />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{dialogLabel}</Dialog.Header>
        <Dialog.Body>
          <p data-h2-margin="base(0, 0 ,x1, 0)">
            {intl.formatMessage({
              defaultMessage: "You are about to remove this member:",
              id: "95aNQ1",
              description: "Lead in text for removing roles on user form.",
            })}
          </p>
          <ul>
            <li data-h2-font-weight="base(bold)">
              <span>{userName}</span>
            </li>
          </ul>
          <p data-h2-margin="base(x1, 0 ,x1, 0)">
            {intl.formatMessage({
              defaultMessage: "From the following process:",
              id: "7+HKOE",
              description: "Follow in text for the process being updated",
            })}
          </p>
          <ul>
            <li data-h2-font-weight="base(bold)">
              <span>{poolDisplayName}</span>
            </li>
          </ul>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              defaultMessage:
                "The user will lose all the following process roles:",
              id: "hS96pl",
              description:
                "Text notifying user which process roles will be removed from the user",
            })}
          </p>
          <Chips>
            {roles.map((r) => (
              <Chip color="secondary" key={r.id}>
                {roleDisplayName(r)}
              </Chip>
            ))}
          </Chips>
          <p data-h2-margin="base(x1, 0)">
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
              {isDeleting
                ? intl.formatMessage(commonMessages.removing)
                : buttonLabel}
            </Button>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default RemoveProcessRoleDialog;
