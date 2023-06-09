import React from "react";
import { useIntl } from "react-intl";
import AcademicCapIcon from "@heroicons/react/24/outline/AcademicCapIcon";
import HomeIcon from "@heroicons/react/24/outline/HomeIcon";
import BuildingOfficeIcon from "@heroicons/react/24/outline/BuildingOfficeIcon";
import BuildingOffice2Icon from "@heroicons/react/24/outline/BuildingOffice2Icon";
import TagIcon from "@heroicons/react/24/outline/TagIcon";
import TicketIcon from "@heroicons/react/24/outline/TicketIcon";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";

import { IconType, SideMenu, SideMenuItem } from "@gc-digital-talent/ui";
import { useAuthorization, RoleName, ROLE_NAME } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import { checkRole } from "~/utils/teamUtils";
import adminMessages from "~/messages/adminMessages";

import LoginOrLogout from "./LoginOrLogout";

export interface AdminSideMenuProps {
  isOpen: boolean;
  onToggle: (newOpen: boolean) => void;
}

const AdminSideMenu = ({ isOpen, onToggle }: AdminSideMenuProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const { roleAssignments } = useAuthorization();

  const menuItems: {
    key: string;
    href: string;
    icon: IconType;
    roles: RoleName[];
    text: string;
  }[] = [
    {
      key: "dashboard",
      href: paths.adminDashboard(),
      icon: HomeIcon,
      roles: [
        ROLE_NAME.PoolOperator,
        ROLE_NAME.RequestResponder,
        ROLE_NAME.PlatformAdmin,
      ],
      text: intl.formatMessage({
        defaultMessage: "Dashboard",
        id: "ArwIQV",
        description: "Title for dashboard",
      }),
    },
    {
      key: "pools",
      href: paths.poolTable(),
      icon: Squares2X2Icon,
      roles: [ROLE_NAME.PoolOperator, ROLE_NAME.PlatformAdmin],
      text: intl.formatMessage(adminMessages.pools),
    },
    {
      key: "users",
      href: paths.userTable(),
      icon: UserIcon,
      roles: [ROLE_NAME.PlatformAdmin],
      text: intl.formatMessage(adminMessages.users),
    },
    {
      key: "requests",
      href: paths.searchRequestTable(),
      icon: TicketIcon,
      roles: [ROLE_NAME.RequestResponder],
      text: intl.formatMessage(adminMessages.requests),
    },
    {
      key: "classifications",
      href: paths.classificationTable(),
      icon: TagIcon,
      roles: [ROLE_NAME.PlatformAdmin],
      text: intl.formatMessage(adminMessages.classifications),
    },
    {
      key: "teams",
      href: paths.teamTable(),
      icon: BuildingOffice2Icon,
      roles: [ROLE_NAME.PoolOperator, ROLE_NAME.PlatformAdmin],
      text: intl.formatMessage(adminMessages.teams),
    },
    {
      key: "departments",
      href: paths.departmentTable(),
      icon: BuildingOfficeIcon,
      roles: [ROLE_NAME.PlatformAdmin],
      text: intl.formatMessage(adminMessages.departments),
    },
    {
      key: "skill-families",
      href: paths.skillFamilyTable(),
      icon: UserGroupIcon,
      roles: [ROLE_NAME.PlatformAdmin],
      text: intl.formatMessage(adminMessages.skillFamilies),
    },
    {
      key: "skills",
      href: paths.skillTable(),
      icon: AcademicCapIcon,
      roles: [ROLE_NAME.PlatformAdmin],
      text: intl.formatMessage(adminMessages.skills),
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
      onOpenChange={onToggle}
      open={isOpen}
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
