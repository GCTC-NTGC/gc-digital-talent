import { useState } from "react";
import { useIntl } from "react-intl";
import TrashIcon from "@heroicons/react/20/solid/TrashIcon";
import { useMutation } from "urql";

import { Dialog, Button, Chip, Chips, IconButton } from "@gc-digital-talent/ui";
import {
  commonMessages,
  formMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import {
  RoleInput,
  ManageAccessPagePoolFragment as ManageAccessPagePoolFragmentType,
} from "@gc-digital-talent/graphql";

import { getFullNameLabel } from "~/utils/nameUtils";

import { UpdateUserProcessRoles_Mutation } from "./operations";
import { PoolTeamMember } from "./types";

interface RemovePoolMembershipDialogProps {
  user: PoolTeamMember;
  pool: ManageAccessPagePoolFragmentType;
  canRemoveRole: boolean;
}

const RemovePoolMembershipDialog = ({
  user,
  pool,
  canRemoveRole,
}: RemovePoolMembershipDialogProps) => {
  const intl = useIntl();
  const teamId = pool?.teamIdForRoleAssignment;
  const [{ fetching }, executeMutation] = useMutation(
    UpdateUserProcessRoles_Mutation,
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const roleInputArray: RoleInput[] = user.roles.map((role) => {
    return { roleId: role.id, teamId };
  });
  if (!canRemoveRole) {
    return null;
  }

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Member removal failed",
        id: "fsvf1L",
        description:
          "Alert displayed to user when an error occurs while removing a community member",
      }),
    );
  };

  const handleRemove = () => {
    executeMutation({
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
              defaultMessage: "Member removed successfully",
              id: "KWXIKL",
              description:
                "Alert displayed to user when a community member is removed",
            }),
          );
        } else {
          handleError();
        }
      })
      .catch(handleError);
  };

  const userName = getFullNameLabel(user.firstName, user.lastName, intl);
  const poolName = getLocalizedName(pool.name, intl);

  const label = intl.formatMessage({
    defaultMessage: "Remove member",
    id: "wsKhRd",
    description: "Label for the dialog to remove a users community membership",
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <IconButton
          color="error"
          label={intl.formatMessage(
            {
              defaultMessage: "Remove {userName} from {poolName}.",
              id: "zRw5Fs",
              description:
                "Label for the dialog trigger to remove a user from a process/pool",
            },
            {
              userName,
              poolName,
            },
          )}
          icon={TrashIcon}
        />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage(
            {
              defaultMessage: "Remove {userName} from {poolName}.",
              id: "zRw5Fs",
              description:
                "Label for the dialog trigger to remove a user from a process/pool",
            },
            {
              userName,
              poolName,
            },
          )}
        >
          {label}
        </Dialog.Header>
        <Dialog.Body>
          {user.roles.length ? (
            <>
              <p className="mb-6">
                {intl.formatMessage({
                  defaultMessage:
                    "They will lose all of the following process roles",
                  id: "zejtvd",
                  description:
                    "Lead text for the list of roles the user will lose",
                })}
                {intl.formatMessage(commonMessages.dividingColon)}
              </p>
              <Chips>
                {user.roles.map((role) => (
                  <Chip key={role.id} color="secondary">
                    {getLocalizedName(role.displayName, intl)}
                  </Chip>
                ))}
              </Chips>
            </>
          ) : null}
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

export default RemovePoolMembershipDialog;
