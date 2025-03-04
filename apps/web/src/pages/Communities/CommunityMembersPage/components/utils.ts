import { IntlShape } from "react-intl";

import { getLocalizedName } from "@gc-digital-talent/i18n";
import { Role } from "@gc-digital-talent/graphql";

export const getTeamBasedRoleOptions = (roles: Role[], intl: IntlShape) => {
  return roles.map((role) => ({
    label: getLocalizedName(role.displayName, intl),
    value: role.id,
  }));
};
