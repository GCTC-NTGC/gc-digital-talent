import orderBy from "lodash/orderBy";
import { IntlShape } from "react-intl";
import EllipsisVerticalIcon from "@heroicons/react/20/solid/EllipsisVerticalIcon";

import { getLocalizedName } from "@gc-digital-talent/i18n";
import { DropdownMenu, IconButton, Link, Ul } from "@gc-digital-talent/ui";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  Maybe,
  Role,
  CommunityMembersPage_CommunityFragment as CommunityMembersPageCommunityFragmentType,
} from "@gc-digital-talent/graphql";

import { CommunityMember } from "~/utils/communityUtils";

import EditCommunityMemberDialog from "./components/EditCommunityMemberDialog";
import RemoveCommunityMemberDialog from "./components/RemoveCommunityMemberDialog";

export function orderRoles(roles: Role[], intl: IntlShape) {
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

export const actionCell = (
  user: CommunityMember,
  community: CommunityMembersPageCommunityFragmentType,
  hasPlatformAdmin: boolean,
  intl: IntlShape,
) => {
  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton
            icon={EllipsisVerticalIcon}
            color="black"
            label={intl.formatMessage(
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
          <EditCommunityMemberDialog
            user={user}
            community={community}
            hasPlatformAdmin={hasPlatformAdmin}
          />
          <RemoveCommunityMemberDialog
            user={user}
            community={community}
            hasPlatformAdmin={hasPlatformAdmin}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
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
    <span className="italic">
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

  return roleItems ? <Ul>{roleItems}</Ul> : null;
}

export function roleAccessor(roles: Maybe<Maybe<Role>[]>, intl: IntlShape) {
  const nonEmptyRoles = roles?.filter(notEmpty);

  return nonEmptyRoles
    ? orderRoles(nonEmptyRoles, intl)
        .map((role) => getLocalizedName(role.displayName, intl))
        .join(", ")
    : "";
}
