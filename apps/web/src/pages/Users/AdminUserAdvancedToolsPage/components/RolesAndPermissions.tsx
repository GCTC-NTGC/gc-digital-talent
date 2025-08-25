import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";
import { useIntl } from "react-intl";

import { TableOfContents } from "@gc-digital-talent/ui";

import adminMessages from "~/messages/adminMessages";

import IndividualRoleTable from "./IndividualRoleTable";
import CommunityRoleTable from "./CommunityRoleTable";
import ProcessRoleTable from "./ProcessRoleTable";
import { RoleTableProps } from "../utils";

export const ROLE_PERMISSIONS_ID = "role-permissions";
export const ROLE_TABLE_IDS = {
  INDIVIDUAL: "individual-roles",
  COMMUNITY: "community-roles",
  PROCESS: "process-roles",
};

const RolePermissions = ({ query, optionsQuery }: RoleTableProps) => {
  const intl = useIntl();

  return (
    <TableOfContents.Section id={ROLE_PERMISSIONS_ID}>
      <TableOfContents.Heading
        icon={IdentificationIcon}
        color="secondary"
        className="mb-6"
      >
        {intl.formatMessage(adminMessages.rolesAndPermissions)}
      </TableOfContents.Heading>

      <TableOfContents.Section id={ROLE_TABLE_IDS.INDIVIDUAL}>
        <IndividualRoleTable {...{ query, optionsQuery }} />
      </TableOfContents.Section>
      <TableOfContents.Section id={ROLE_TABLE_IDS.COMMUNITY}>
        <CommunityRoleTable {...{ query, optionsQuery }} />
      </TableOfContents.Section>
      <TableOfContents.Section id={ROLE_TABLE_IDS.PROCESS}>
        <ProcessRoleTable {...{ query, optionsQuery }} />
      </TableOfContents.Section>
    </TableOfContents.Section>
  );
};

export default RolePermissions;
