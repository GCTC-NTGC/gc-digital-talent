import type { IntlShape } from "react-intl";

import type { AuthRole } from "@gc-digital-talent/auth";
import { getLocalizedName } from "@gc-digital-talent/i18n";

export const getTeamBasedRoleOptions = (roles: AuthRole[], intl: IntlShape) => {
  return roles.map((role) => ({
    label: getLocalizedName(role.displayName, intl),
    value: role.id,
  }));
};
