import React from "react";
import { useIntl } from "react-intl";
import {
  AcademicCapIcon,
  HomeIcon,
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  TagIcon,
  TicketIcon,
  UserGroupIcon,
  UserIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

import { SideMenu, SideMenuItem } from "@gc-digital-talent/ui";
import { useAuthorization } from "@gc-digital-talent/auth";
import { Maybe, RoleAssignment } from "@gc-digital-talent/graphql";
import { RoleName } from "@gc-digital-talent/auth/src/const";

import useRoutes from "~/hooks/useRoutes";
import LoginOrLogout from "./LoginOrLogout";

export interface AdminSideMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onDismiss: () => void;
}

/**
 * Check to see if user contains one or more roles
 *
 * @param checkRoles              Roles to check for
 * @param userRoleAssignments     Users current role assignments
 * @returns boolean
 */
const checkRole = (
  checkRoles: RoleName[] | null,
  userRoleAssignments: Maybe<RoleAssignment[]>,
): boolean => {
  if (!checkRoles) {
    return true;
  }
  const visible = checkRoles.reduce((prev, curr) => {
    if (userRoleAssignments?.map((a) => a.role?.name)?.includes(curr)) {
      return true;
    }

    return prev;
  }, false);

  return visible;
};

const AdminSideMenu: React.FC<AdminSideMenuProps> = ({
  isOpen,
  onToggle,
  onDismiss,
}) => {
  const intl = useIntl();
  const paths = useRoutes();

  const { roleAssignments } = useAuthorization();

  const menuItems: {
    key: string;
    href: string;
    icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
    roles: RoleName[];
    text: string;
  }[] = [
    {
      key: "dashboard",
      href: paths.adminDashboard(),
      icon: HomeIcon,
      roles: ["platform_admin"],
      text: intl.formatMessage({
        defaultMessage: "Dashboard",
        id: "ZDmkKD",
        description: "Label displayed on the dashboard menu item.",
      }),
    },
    {
      key: "pools",
      href: paths.poolTable(),
      icon: Squares2X2Icon,
      roles: ["platform_admin"],
      text: intl.formatMessage({
        defaultMessage: "Pools",
        id: "wCBE9S",
        description: "Label displayed on the Pools menu item.",
      }),
    },
    {
      key: "users",
      href: paths.userTable(),
      icon: UserIcon,
      roles: ["platform_admin"],
      text: intl.formatMessage({
        defaultMessage: "Users",
        id: "154pGu",
        description: "Label displayed on the Users menu item.",
      }),
    },
    {
      key: "requests",
      href: paths.searchRequestTable(),
      icon: TicketIcon,
      roles: ["platform_admin"],
      text: intl.formatMessage({
        defaultMessage: "Requests",
        id: "QftM3f",
        description: "Label displayed on the requests menu item.",
      }),
    },
    {
      key: "classifications",
      href: paths.classificationTable(),
      icon: TagIcon,
      roles: ["platform_admin"],
      text: intl.formatMessage({
        defaultMessage: "Classifications",
        id: "gk7uJQ",
        description: "Label displayed on the classifications menu item.",
      }),
    },
    {
      key: "teams",
      href: paths.teamTable(),
      icon: BuildingOffice2Icon,
      roles: ["platform_admin"],
      text: intl.formatMessage({
        defaultMessage: "Teams",
        id: "GJsuQg",
        description: "Label displayed on the teams menu item.",
      }),
    },
    {
      key: "departments",
      href: paths.departmentTable(),
      icon: BuildingOfficeIcon,
      roles: ["platform_admin"],
      text: intl.formatMessage({
        defaultMessage: "Departments",
        id: "HQOsq2",
        description: "Label displayed on the departments menu item.",
      }),
    },
    {
      key: "skill-families",
      href: paths.skillFamilyTable(),
      icon: UserGroupIcon,
      roles: ["platform_admin"],
      text: intl.formatMessage({
        defaultMessage: "Skill Families",
        id: "4fOu5j",
        description: "Label displayed on the skill families menu item.",
      }),
    },
    {
      key: "skills",
      href: paths.skillTable(),
      icon: AcademicCapIcon,
      roles: ["platform_admin"],
      text: intl.formatMessage({
        defaultMessage: "Skills",
        id: "UC+4MX",
        description: "Label displayed on the skills menu item.",
      }),
    },
  ];

  return (
    <SideMenu
      label={intl.formatMessage({
        defaultMessage: "Main Menu",
        id: "QjF2CL",
        description:
          "Label for the main menu on the pool manager admin portal.",
      })}
      onToggle={onToggle}
      isOpen={isOpen}
      onDismiss={onDismiss}
      footer={<LoginOrLogout />}
    >
      {menuItems.map((item) => (
        <React.Fragment key={item.key}>
          {checkRole(item.roles, roleAssignments) ? (
            <SideMenuItem href={item.href} icon={item.icon} end>
              {item.text}
            </SideMenuItem>
          ) : null}
        </React.Fragment>
      ))}
    </SideMenu>
  );
};

export default AdminSideMenu;
