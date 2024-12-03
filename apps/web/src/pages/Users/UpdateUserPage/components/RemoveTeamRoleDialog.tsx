import { useState } from "react";
import { useIntl } from "react-intl";
import TrashIcon from "@heroicons/react/20/solid/TrashIcon";

import { Dialog, Button, Chip, Chips } from "@gc-digital-talent/ui";
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
  Team,
  User,
  RoleInput,
} from "@gc-digital-talent/graphql";

import { getFullNameHtml } from "~/utils/nameUtils";
import adminMessages from "~/messages/adminMessages";

interface RemoveTeamRoleDialogProps {
  user: Pick<User, "id" | "firstName" | "lastName">;
  roles: Role[];
  team: Pick<Team, "id" | "displayName">;
  onRemoveRoles: (
    submitData: UpdateUserRolesInput,
  ) => Promise<UpdateUserRolesMutation["updateUserRoles"]>;
}

const RemoveTeamRoleDialog = ({
  user,
  roles,
  team,
  onRemoveRoles,
}: RemoveTeamRoleDialogProps) => {
  const intl = useIntl();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { id, firstName, lastName } = user;

  const handleRemove = async () => {
    const roleInputArray: RoleInput[] = roles.map((r) => {
      return { roleId: r.id, teamId: team.id };
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
  const teamDisplayName = getLocalizedName(team.displayName, intl);

  const dialogLabel = intl.formatMessage(
    {
      defaultMessage: "Remove membership<hidden> in {team}</hidden>",
      id: "vkOyl3",
      description: "Header for the form to remove a team role from a user",
    },
    {
      team: teamDisplayName,
    },
  );

  const buttonLabel = intl.formatMessage(
    {
      defaultMessage: "Remove membership<hidden> in {team}</hidden>",
      id: "N6Qn5a",
      description:
        "Button label for the form to remove a team role from a user",
    },
    {
      team: teamDisplayName,
    },
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="error" icon={TrashIcon} mode="icon_only">
          <span data-h2-visually-hidden="base(invisible)">{buttonLabel}</span>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{dialogLabel}</Dialog.Header>
        <Dialog.Body>
          <p data-h2-margin="base(0, 0 ,x1, 0)">
            {intl.formatMessage(
              {
                defaultMessage:
                  "You are about to remove this member: <strong>{userName}</strong>",
                id: "JgwpTg",
                description:
                  "Lead in text for the remove role from user dialog",
              },
              { userName },
            )}
          </p>
          <p data-h2-margin="base(0, 0 ,x1, 0)">
            {intl.formatMessage(
              {
                defaultMessage:
                  "From the following team: <strong>{teamDisplayName}</strong>",
                id: "86qwfg",
                description: "Follow in text for the team being updated",
              },
              { teamDisplayName },
            )}
          </p>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              defaultMessage:
                "The user will lose all the following team roles:",
              id: "RTf/0v",
              description:
                "Text notifying user which role will be removed from the user",
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

export default RemoveTeamRoleDialog;
