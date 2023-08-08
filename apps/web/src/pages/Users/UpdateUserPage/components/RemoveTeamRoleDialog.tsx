import React from "react";
import { useIntl } from "react-intl";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";

import { Dialog, Button, Pill } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getLocalizedName,
  uiMessages,
  useLocale,
} from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";

import {
  Role,
  Team,
  UpdateUserAsAdminInput,
  UpdateUserAsAdminMutation,
  User,
} from "~/api/generated";
import { getFullNameHtml } from "~/utils/nameUtils";

interface RemoveTeamRoleDialogProps {
  user: User;
  roles: Role[];
  team: Team;
  onRemoveRoles: (
    submitData: UpdateUserAsAdminInput,
  ) => Promise<UpdateUserAsAdminMutation["updateUserAsAdmin"]>;
}

const RemoveTeamRoleDialog = ({
  user,
  roles,
  team,
  onRemoveRoles,
}: RemoveTeamRoleDialogProps) => {
  const intl = useIntl();
  const { locale } = useLocale();
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handleRemove = async () => {
    setIsDeleting(true);
    return onRemoveRoles({
      roleAssignmentsInput: {
        detach: {
          roles: roles.map((r) => r.id),
          team: team.id,
        },
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
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Member role update failed",
            id: "Ly2bBb",
            description:
              "Alert displayed to user when an error occurs while editing a team member's roles",
          }),
        );
      })
      .finally(() => setIsDeleting(false));
  };

  const userName = getFullNameHtml(user.firstName, user.lastName, intl);
  const roleDisplayName = (role: Role) =>
    getLocalizedName(role.displayName, intl, locale);
  const teamDisplayName = getLocalizedName(team.displayName, intl, locale);

  const label = intl.formatMessage(
    {
      defaultMessage: "Remove membership<hidden> in {team}</hidden>",
      id: "sSnNWm",
      description: "Label for the form to remove a team role from a user",
    },
    {
      team: teamDisplayName,
    },
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="black">
          <TrashIcon data-h2-height="base(x.75)" data-h2-width="base(x.75)" />
          <span data-h2-visually-hidden="base(hidden)">{label}</span>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{label}</Dialog.Header>
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
          <p data-h2-margin="base(x1, 0)">
            {roles.map((r) => (
              <Pill mode="solid" color="secondary" key={r.id}>
                {roleDisplayName(r)}
              </Pill>
            ))}
          </p>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage(uiMessages.confirmContinue)}
          </p>
          <Dialog.Footer>
            <Dialog.Close>
              <Button color="secondary">
                {intl.formatMessage({
                  defaultMessage: "Cancel and go back",
                  id: "tiF/jI",
                  description: "Close dialog button",
                })}
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

export default RemoveTeamRoleDialog;
