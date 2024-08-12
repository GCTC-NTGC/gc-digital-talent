import { useState } from "react";
import { useIntl } from "react-intl";
import TrashIcon from "@heroicons/react/20/solid/TrashIcon";
import { useMutation } from "urql";
import { useOutletContext } from "react-router-dom";

import { Dialog, Button, Chip, Chips } from "@gc-digital-talent/ui";
import {
  commonMessages,
  formMessages,
  getLocalizedName,
} from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import {
  RoleInput,
  CommunityMembersPage_CommunityFragment as CommunityMembersPageCommunityFragmentType,
} from "@gc-digital-talent/graphql";

import { getFullNameLabel } from "~/utils/nameUtils";
import { CommunityMember } from "~/utils/communityUtils";

import { UpdateUserCommunityRoles_Mutation } from "./operations";
import { ContextType } from "./types";

interface RemoveCommunityMemberDialogProps {
  user: CommunityMember;
  community: CommunityMembersPageCommunityFragmentType;
}

const RemoveCommunityMemberDialog = ({
  user,
  community,
}: RemoveCommunityMemberDialogProps) => {
  const intl = useIntl();
  const { teamId } = useOutletContext<ContextType>();
  const [{ fetching }, executeMutation] = useMutation(
    UpdateUserCommunityRoles_Mutation,
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const roleInputArray: RoleInput[] = user.roles.map((role) => {
    return { roleId: role.id, teamId };
  });

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
  const communityName = getLocalizedName(community.name, intl);

  const label = intl.formatMessage({
    defaultMessage: "Remove member",
    id: "wsKhRd",
    description: "Label for the dialog to remove a users community membership",
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button
          color="error"
          aria-label={label}
          icon={TrashIcon}
          mode="icon_only"
        />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{label}</Dialog.Header>
        <Dialog.Body>
          <p data-h2-margin-bottom="base(x1)">
            {intl.formatMessage(
              {
                defaultMessage:
                  "You are about to remove <strong>{userName}</strong> from the community <strong>{communityName}</strong>.",
                id: "nOGbxc",
                description:
                  "Help text for the remove community membership dialog",
              },
              {
                userName,
                communityName,
              },
            )}
          </p>
          {user.roles.length ? (
            <>
              <p data-h2-margin="base(x1, 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "They will lose all of the following community roles",
                  id: "tBw54L",
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

export default RemoveCommunityMemberDialog;
