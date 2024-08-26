import { IntlShape } from "react-intl";

import { getLocalizedName } from "@gc-digital-talent/i18n";
import { Role } from "@gc-digital-talent/graphql";

// eslint-disable-next-line import/prefer-default-export
export const getTeamBasedRoleOptions = (
  roles: Role[],
  intl: IntlShape,
) => {
  return roles.map((role) => ({
    label: getLocalizedName(role.displayName, intl),
    value: role.id,
  }));
};
