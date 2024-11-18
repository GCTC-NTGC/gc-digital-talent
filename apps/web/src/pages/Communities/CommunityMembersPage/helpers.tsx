import { useState } from "react";
import orderBy from "lodash/orderBy";
import { IntlShape, useIntl } from "react-intl";
import EllipsisVerticalIcon from "@heroicons/react/20/solid/EllipsisVerticalIcon";

import { getLocalizedName } from "@gc-digital-talent/i18n";
import { Button, DropdownMenu, Link } from "@gc-digital-talent/ui";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  Maybe,
  Role,
  CommunityMembersPage_CommunityFragment as CommunityMembersPageCommunityFragmentType,
} from "@gc-digital-talent/graphql";

import { CommunityMember } from "~/utils/communityUtils";

import EditCommunityMemberDialog from "./components/EditCommunityMemberDialog";
import RemoveCommunityMemberDialog from "./components/RemoveCommunityMemberDialog";

function orderRoles(roles: Role[], intl: IntlShape) {
  return orderBy(roles, ({ displayName }) => {
    const value = getLocalizedName(displayName, intl);

    return value
      ? value
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLocaleLowerCase()
      : value;
  });
}

interface ActionCellProps {
  user: CommunityMember;
  community: CommunityMembersPageCommunityFragmentType;
  hasPlatformAdmin: boolean;
}

export const ActionCell = ({
  user,
  community,
  hasPlatformAdmin,
}: ActionCellProps) => {
  const intl = useIntl();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState<boolean>(false);
  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button
            icon={EllipsisVerticalIcon}
            mode="icon_only"
            color="black"
            aria-label={intl.formatMessage(
              {
                defaultMessage: "Actions for {userName} in {communityName}",
                id: "J+haAz",
                description:
                  "Aria label for the menu trigger for community actions",
              },
              {
                userName: `${user.firstName} ${user.lastName}`,
                communityName: getLocalizedName(community.name, intl),
              },
            )}
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item onSelect={() => setIsEditDialogOpen(true)}>
            {intl.formatMessage({
              defaultMessage: "Edit community roles",
              id: "PsGkXc",
              description:
                "Label for the form to edit a users community membership",
            })}
          </DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => setIsRemoveDialogOpen(true)}>
            {intl.formatMessage({
              defaultMessage: "Remove member",
              id: "wsKhRd",
              description:
                "Label for the dialog to remove a users community membership",
            })}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <EditCommunityMemberDialog
        user={user}
        community={community}
        hasPlatformAdmin={hasPlatformAdmin}
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
      />
      <RemoveCommunityMemberDialog
        user={user}
        community={community}
        hasPlatformAdmin={hasPlatformAdmin}
        isOpen={isRemoveDialogOpen}
        setIsOpen={setIsRemoveDialogOpen}
      />
    </>
  );
};

export function emailLinkCell(
  email: Maybe<string> | undefined,
  intl: IntlShape,
) {
  if (email) {
    return (
      <Link color="black" external href={`mailto:${email}`}>
        {email}
      </Link>
    );
  }

  return (
    <span data-h2-font-style="base(italic)">
      {intl.formatMessage({
        defaultMessage: "No email provided",
        id: "1JCjTP",
        description: "Fallback for email value",
      })}
    </span>
  );
}

export function roleCell(roles: Maybe<Maybe<Role>[]>, intl: IntlShape) {
  const nonEmptyRoles = unpackMaybes(roles);
  const roleItems = nonEmptyRoles
    ? orderRoles(nonEmptyRoles, intl).map((role) => (
        <li key={role.id}>{getLocalizedName(role.displayName, intl)}</li>
      ))
    : null;

  return roleItems ? <ul>{roleItems}</ul> : null;
}

export function roleAccessor(roles: Maybe<Maybe<Role>[]>, intl: IntlShape) {
  const nonEmptyRoles = roles?.filter(notEmpty);

  return nonEmptyRoles
    ? orderRoles(nonEmptyRoles, intl)
        .map((role) => getLocalizedName(role.displayName, intl))
        .join(", ")
    : "";
}
