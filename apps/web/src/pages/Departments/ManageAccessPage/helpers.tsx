import orderBy from "lodash/orderBy";
import { IntlShape } from "react-intl";
import EllipsisVerticalIcon from "@heroicons/react/20/solid/EllipsisVerticalIcon";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { DropdownMenu, IconButton, Link, Ul } from "@gc-digital-talent/ui";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  Maybe,
  Role,
  DepartmentManageAccessPage_DepartmentFragment as DepartmentManageAccessPageDepartmentFragmentType,
} from "@gc-digital-talent/graphql";

import { DepartmentMember } from "~/utils/departmentUtils";

import EditDepartmentMembershipDialog from "./components/EditDepartmentMembership";
import RemoveDepartmentMembershipDialog from "./components/RemoveDepartmentMembership";

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
  user: DepartmentMember,
  department: DepartmentManageAccessPageDepartmentFragmentType,
  hasPlatformAdmin: boolean,
  intl: IntlShape,
) => {
  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          render={
            <IconButton
              icon={EllipsisVerticalIcon}
              color="black"
              label={intl.formatMessage(
                {
                  defaultMessage: "Actions for {userName} in {departmentName}",
                  id: "LLN1xf",
                  description:
                    "Aria label for the menu trigger for department actions",
                },
                {
                  userName: `${user.firstName} ${user.lastName}`,
                  departmentName:
                    department.name?.localized ??
                    intl.formatMessage(commonMessages.notFound),
                },
              )}
            />
          }
        />
        <DropdownMenu.Popup portalProps={{ keepMounted: true }}>
          <EditDepartmentMembershipDialog
            user={user}
            department={department}
            hasPlatformAdmin={hasPlatformAdmin}
          />
          <RemoveDepartmentMembershipDialog
            user={user}
            department={department}
            hasPlatformAdmin={hasPlatformAdmin}
          />
        </DropdownMenu.Popup>
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
