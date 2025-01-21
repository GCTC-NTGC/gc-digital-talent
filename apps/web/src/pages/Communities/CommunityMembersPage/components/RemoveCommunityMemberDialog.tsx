import {
  useState,
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
} from "react";
import { useIntl } from "react-intl";
import { useMutation } from "urql";
import { useOutletContext } from "react-router";

import {
  Dialog,
  Button,
  Chip,
  Chips,
  DropdownMenu,
} from "@gc-digital-talent/ui";
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
import { ROLE_NAME } from "@gc-digital-talent/auth";

import { getFullNameLabel } from "~/utils/nameUtils";
import { CommunityMember } from "~/utils/communityUtils";

import { UpdateUserCommunityRoles_Mutation } from "./operations";
import { ContextType } from "./types";

type RemoveCommunityMemberDialogProps = ComponentPropsWithoutRef<
  typeof DropdownMenu.Item
> & {
  user: CommunityMember;
  community: CommunityMembersPageCommunityFragmentType;
  hasPlatformAdmin: boolean;
};

const RemoveCommunityMemberDialog = forwardRef<
  ElementRef<typeof DropdownMenu.Item>,
  RemoveCommunityMemberDialogProps
>(({ user, community, hasPlatformAdmin, onSelect, ...rest }, forwardedRef) => {
  const intl = useIntl();
  const { teamId } = useOutletContext<ContextType>();
  const [{ fetching }, executeMutation] = useMutation(
    UpdateUserCommunityRoles_Mutation,
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const roleInputArray: RoleInput[] = user.roles.map((role) => {
    return { roleId: role.id, teamId };
  });
  if (
    !hasPlatformAdmin &&
    user.roles.find((role) => role.name === ROLE_NAME.CommunityAdmin)
  ) {
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
  const communityName = getLocalizedName(community.name, intl);

  const label = intl.formatMessage({
    defaultMessage: "Remove member",
    id: "wsKhRd",
    description: "Label for the dialog to remove a users community membership",
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <DropdownMenu.Item
          ref={forwardedRef}
          onSelect={(event) => {
            event.preventDefault();
            onSelect?.(event);
          }}
          {...rest}
        >
          {intl.formatMessage({
            defaultMessage: "Remove member",
            id: "wsKhRd",
            description:
              "Label for the dialog to remove a users community membership",
          })}
        </DropdownMenu.Item>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage(
            {
              defaultMessage: "Remove {userName} from {communityName}.",
              id: "Uo2kBO",
              description:
                "Label for the dialog trigger to remove a user from a community",
            },
            {
              userName,
              communityName,
            },
          )}
        >
          {label}
        </Dialog.Header>
        <Dialog.Body>
          {user.roles.length ? (
            <>
              <p data-h2-margin-bottom="base(x1)">
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
});

export default RemoveCommunityMemberDialog;
