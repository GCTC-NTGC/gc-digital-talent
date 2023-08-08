import { IntlShape } from "react-intl";

import { Locales, getLocalizedName } from "@gc-digital-talent/i18n";

import { Role } from "@gc-digital-talent/graphql";

// eslint-disable-next-line import/prefer-default-export
export const getTeamBasedRoleOptions = (
  roles: Array<Role>,
  intl: IntlShape,
  locale: Locales,
) => {
  return roles.map((role) => ({
    label: getLocalizedName(role.displayName, intl, locale),
    value: role.id,
  }));
};
