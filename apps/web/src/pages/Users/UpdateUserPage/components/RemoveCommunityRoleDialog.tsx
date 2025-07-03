import { useState } from "react";
import { useIntl } from "react-intl";
import TrashIcon from "@heroicons/react/20/solid/TrashIcon";

import {
  Dialog,
  Button,
  Chip,
  Chips,
  IconButton,
  Ul,
} from "@gc-digital-talent/ui";
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
  const communityDisplayName = getLocalizedName(community.name, intl);

  const dialogLabel = intl.formatMessage({
    defaultMessage: "Remove from community",
    id: "xjdD1/",
    description: "Header for the form to remove a community role from a user",
  });

  const buttonLabel = intl.formatMessage({
    defaultMessage: "Remove from community",
    id: "uG1ZWN",
    description:
      "Button label for the form to remove a community role from a user",
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <IconButton color="error" icon={TrashIcon} label={buttonLabel} />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{dialogLabel}</Dialog.Header>
        <Dialog.Body>
          <p className="mb-6">
            {intl.formatMessage({
              defaultMessage: "You are about to remove this member:",
              id: "95aNQ1",
              description: "Lead in text for removing roles on user form.",
            })}
          </p>
          <Ul>
            <li className="font-bold">
              <span>{userName}</span>
            </li>
          </Ul>
          <p className="my-6">
            {intl.formatMessage({
              defaultMessage: "From the following community:",
              id: "hJDRa/",
              description: "Follow in text for the community being updated",
            })}
          </p>
          <Ul>
            <li className="font-bold">
              <span>{communityDisplayName}</span>
            </li>
          </Ul>
          <p className="my-6">
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

export default RemoveCommunityRoleDialog;
