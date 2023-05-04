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

import { SideMenu, SideMenuItem } from "@gc-digital-talent/ui";
import { useAuthorization, RoleName, ROLE_NAME } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import adminMenuMessages from "~/messages/adminMenuMessages";
import { checkRole } from "~/utils/teamUtils";

import LoginOrLogout from "./LoginOrLogout";

export interface AdminSideMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onDismiss: () => void;
}

const AdminSideMenu = ({ isOpen, onToggle, onDismiss }: AdminSideMenuProps) => {
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
      roles: [
        ROLE_NAME.PoolOperator,
        ROLE_NAME.RequestResponder,
        ROLE_NAME.PlatformAdmin,
      ],
      text: intl.formatMessage(adminMenuMessages.dashboard),
    },
    {
      key: "pools",
      href: paths.poolTable(),
      icon: Squares2X2Icon,
      roles: [ROLE_NAME.PoolOperator, ROLE_NAME.PlatformAdmin],
      text: intl.formatMessage(adminMenuMessages.pools),
    },
    {
      key: "users",
      href: paths.userTable(),
      icon: UserIcon,
      roles: [ROLE_NAME.PlatformAdmin],
      text: intl.formatMessage(adminMenuMessages.users),
    },
    {
      key: "requests",
      href: paths.searchRequestTable(),
      icon: TicketIcon,
      roles: [ROLE_NAME.RequestResponder],
      text: intl.formatMessage(adminMenuMessages.requests),
    },
    {
      key: "classifications",
      href: paths.classificationTable(),
      icon: TagIcon,
      roles: [ROLE_NAME.PlatformAdmin],
      text: intl.formatMessage(adminMenuMessages.classifications),
    },
    {
      key: "teams",
      href: paths.teamTable(),
      icon: BuildingOffice2Icon,
      roles: [ROLE_NAME.PoolOperator, ROLE_NAME.PlatformAdmin],
      text: intl.formatMessage(adminMenuMessages.teams),
    },
    {
      key: "departments",
      href: paths.departmentTable(),
      icon: BuildingOfficeIcon,
      roles: [ROLE_NAME.PlatformAdmin],
      text: intl.formatMessage(adminMenuMessages.departments),
    },
    {
      key: "skill-families",
      href: paths.skillFamilyTable(),
      icon: UserGroupIcon,
      roles: [ROLE_NAME.PlatformAdmin],
      text: intl.formatMessage(adminMenuMessages.skillFamilies),
    },
    {
      key: "skills",
      href: paths.skillTable(),
      icon: AcademicCapIcon,
      roles: [ROLE_NAME.PlatformAdmin],
      text: intl.formatMessage(adminMenuMessages.skills),
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
