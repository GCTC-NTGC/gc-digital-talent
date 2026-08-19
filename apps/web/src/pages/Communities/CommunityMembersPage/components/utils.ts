import type { IntlShape } from "react-intl";

import { getLocalizedName } from "@gc-digital-talent/i18n";
import type { AuthRole } from "@gc-digital-talent/auth";

export const getTeamBasedRoleOptions = (roles: AuthRole[], intl: IntlShape) => {
  return roles.map((role) => ({
    label: getLocalizedName(role.displayName, intl),
    value: role.id,
  }));
};
