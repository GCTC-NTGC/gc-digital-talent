import React from "react";
import { useIntl } from "react-intl";

import SideMenuWrapper, { SideMenuItem } from "@common/components/SideMenu";

import {
  AcademicCapIcon,
  HomeIcon,
  OfficeBuildingIcon,
  PaperClipIcon,
  TagIcon,
  TicketIcon,
  UserGroupIcon,
  UserIcon,
  ViewGridIcon,
} from "@heroicons/react/outline";
import { navigate } from "@common/helpers/router";
import LoginOrLogout from "./LoginOrLogout";
import { AuthorizationContext } from "../AuthorizationContainer";

import { useAdminRoutes } from "../../adminRoutes";
import { Role } from "../../api/generated";

interface SideMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * Check to see if user contains one or more roles
 *
 * @param checkRoles    Roles to check for
 * @param userRoles     Users current roles
 * @returns boolean
 */
const checkRole = (
  checkRoles: Role[] | null,
  userRoles: (Role | null | undefined)[] | null | undefined,
): boolean => {
  if (!checkRoles) {
    return true;
  }
  const visible = checkRoles.reduce((prev, curr) => {
    if (userRoles?.includes(curr)) {
      return true;
    }

    return prev;
  }, false);

  return visible;
};

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onToggle }) => {
  const intl = useIntl();
  const paths = useAdminRoutes();

  const { loggedInUserRoles } = React.useContext(AuthorizationContext);

  const menuItems = [
    {
      key: "dashboard",
      href: paths.dashboard(),
      icon: HomeIcon,
      roles: [Role.Admin],
      text: intl.formatMessage({
        defaultMessage: "Dashboard",
        description: "Label displayed on the dashboard menu item.",
      }),
    },
    {
      key: "pools",
      href: paths.poolTable(),
      icon: ViewGridIcon,
      roles: [Role.Admin],
      text: intl.formatMessage({
        defaultMessage: "Pools",
        description: "Label displayed on the Pools menu item.",
      }),
    },
    {
      key: "users",
      href: paths.userTable(),
      icon: UserIcon,
      roles: [Role.Admin],
      text: intl.formatMessage({
        defaultMessage: "Users",
        description: "Label displayed on the Users menu item.",
      }),
    },
    {
      key: "requests",
      href: paths.searchRequestTable(),
      icon: TicketIcon,
      roles: [Role.Admin],
      text: intl.formatMessage({
        defaultMessage: "Requests",
        description: "Label displayed on the requests menu item.",
      }),
    },
    {
      key: "classifications",
      href: paths.classificationTable(),
      icon: TagIcon,
      roles: [Role.Admin],
      text: intl.formatMessage({
        defaultMessage: "Classifications",
        description: "Label displayed on the classifications menu item.",
      }),
    },
    {
      key: "cmo-assets",
      href: paths.cmoAssetTable(),
      icon: PaperClipIcon,
      roles: [Role.Admin],
      text: intl.formatMessage({
        defaultMessage: "CMO Assets",
        description: "Label displayed on the CMO Assets menu item.",
      }),
    },
    {
      key: "departments",
      href: paths.departmentTable(),
      icon: OfficeBuildingIcon,
      roles: [Role.Admin],
      text: intl.formatMessage({
        defaultMessage: "Departments",
        description: "Label displayed on the departments menu item.",
      }),
    },
    {
      key: "skill-families",
      href: paths.skillFamilyTable(),
      icon: UserGroupIcon,
      roles: [Role.Admin],
      text: intl.formatMessage({
        defaultMessage: "Skill Families",
        description: "Label displayed on the skill families menu item.",
      }),
    },
    {
      key: "skills",
      href: paths.skillTable(),
      icon: AcademicCapIcon,
      roles: [Role.Admin],
      text: intl.formatMessage({
        defaultMessage: "Skills",
        description: "Label displayed on the skills menu item.",
      }),
    },
  ];

  return (
    <SideMenuWrapper
      onToggle={onToggle}
      isOpen={isOpen}
      footer={<LoginOrLogout />}
    >
      {menuItems.map((item) => (
        <React.Fragment key={item.key}>
          {checkRole(item.roles, loggedInUserRoles) ? (
            <SideMenuItem
              href={item.href}
              icon={item.icon}
              onClick={(e) => {
                e.preventDefault();
                if (item.href) navigate(item.href);
              }}
            >
              {item.text}
            </SideMenuItem>
          ) : null}
        </React.Fragment>
      ))}
    </SideMenuWrapper>
  );
};

export default SideMenu;
