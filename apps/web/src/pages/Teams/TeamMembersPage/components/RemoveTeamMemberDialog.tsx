import { useState } from "react";
import { useIntl } from "react-intl";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import { useMutation } from "urql";

import { Dialog, Button, Chip, Chips } from "@gc-digital-talent/ui";
import {
  commonMessages,
  formMessages,
  getLocalizedName,
  uiMessages,
} from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import {
  RoleInput,
  TeamMembersPage_TeamFragment as TeamMembersPageTeamFragmentType,
} from "@gc-digital-talent/graphql";

import { getFullNameLabel } from "~/utils/nameUtils";
import { TeamMember } from "~/utils/teamUtils";

import { UpdateUserTeamRoles_Mutation } from "./operations";

interface RemoveTeamMemberDialogProps {
  user: TeamMember;
  team: TeamMembersPageTeamFragmentType;
}

const RemoveTeamMemberDialog = ({
  user,
  team,
}: RemoveTeamMemberDialogProps) => {
  const intl = useIntl();
  const [{ fetching }, executeMutation] = useMutation(
    UpdateUserTeamRoles_Mutation,
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const roleInputArray: RoleInput[] = user.roles.map((role) => {
    return { roleId: role.id, teamId: team.id };
  });

  const handleRemove = async () => {
    await executeMutation({
      updateUserRolesInput: {
        userId: user.id,
        roleAssignmentsInput: {
          detach: roleInputArray,
        },
      },
    })
      .then((res) => {
        if (!res.error) {
          setIsOpen(false);
          toast.success(
            intl.formatMessage({
              defaultMessage: "Member removed from team successfully",
              id: "guzGyX",
              description:
                "Alert displayed to user when a team member is removed",
            }),
          );
        }
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Member removed from team failed",
            id: "7Mbt01",
            description:
              "Alert displayed to user when an error occurs while removing a team member",
          }),
        );
      });
  };

  const userName = getFullNameLabel(user.firstName, user.lastName, intl);
  const teamName = getLocalizedName(team.displayName, intl);

  const label = intl.formatMessage({
    defaultMessage: "Remove member",
    id: "DyHeaZ",
    description: "Label for the dialog to remove a users team membership",
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button color="error" aria-label={label}>
          <TrashIcon data-h2-height="base(x.75)" data-h2-width="base(x.75)" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{label}</Dialog.Header>
        <Dialog.Body>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage(
              {
                defaultMessage:
                  "You are about to remove <strong>{userName}</strong> from the team <strong>{teamName}</strong>.",
                id: "/esEW+",
                description: "Help text for the remove team membership dialog",
              },
              {
                userName,
                teamName,
              },
            )}
          </p>
          {user.roles.length ? (
            <>
              <p data-h2-margin="base(x1, 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "They will lose all of the following team roles:",
                  id: "o1M2Kc",
                  description:
                    "Lead text for the list of roles the user will lose",
                })}
              </p>
              <Chips>
                {user.roles.map((role) => (
                  <Chip key={role.id} color="black">
                    {getLocalizedName(role.displayName, intl)}
                  </Chip>
                ))}
              </Chips>
            </>
          ) : null}
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage(uiMessages.confirmContinue)}
          </p>
          <Dialog.Footer>
            <Button color="error" onClick={handleRemove} disabled={fetching}>
              {fetching ? intl.formatMessage(commonMessages.saving) : label}
            </Button>
            <Dialog.Close>
              <Button color="warning" mode="inline">
                {intl.formatMessage(formMessages.cancelGoBack)}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default RemoveTeamMemberDialog;
