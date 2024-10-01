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
  User,
  RoleInput,
} from "@gc-digital-talent/graphql";

import { getFullNameHtml } from "~/utils/nameUtils";

import { CommunityTeamable } from "../types";

interface RemoveCommunityRoleDialogProps {
  user: Pick<User, "id" | "firstName" | "lastName">;
  roles: Role[];
  community: CommunityTeamable;
  onRemoveRoles: (
    submitData: UpdateUserRolesInput,
  ) => Promise<UpdateUserRolesMutation["updateUserRoles"]>;
}

const RemoveCommunityRoleDialog = ({
  user,
  roles,
  community,
  onRemoveRoles,
}: RemoveCommunityRoleDialogProps) => {
  const intl = useIntl();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { id, firstName, lastName } = user;

  const handleRemove = async () => {
    const roleInputArray: RoleInput[] = roles.map((r) => {
      return { roleId: r.id, teamId: community.teamIdForRoleAssignment };
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

  const userName = getFullNameHtml(firstName, lastName, intl);
  const roleDisplayName = (role: Role) =>
    getLocalizedName(role.displayName, intl);
  const communityDisplayName = getLocalizedName(community.name, intl);

  const label = intl.formatMessage({
    defaultMessage: "Remove from community",
    id: "pZ8pDw",
    description: "Label for the form to remove a community role from a user",
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="error" icon={TrashIcon} mode="icon_only">
          <span data-h2-visually-hidden="base(invisible)">{label}</span>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{label}</Dialog.Header>
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
              defaultMessage: "From the following community:",
              id: "hJDRa/",
              description: "Follow in text for the community being updated",
            })}
          </p>
          <ul>
            <li data-h2-font-weight="base(bold)">
              <span>{communityDisplayName}</span>
            </li>
          </ul>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              defaultMessage:
                "The user will lose all the following community roles:",
              id: "zsOKOD",
              description:
                "Text notifying user which community roles will be removed from the user",
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
              {isDeleting ? intl.formatMessage(commonMessages.removing) : label}
            </Button>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default RemoveCommunityRoleDialog;
