import orderBy from "lodash/orderBy";
import { IntlShape } from "react-intl";

import { getLocalizedName } from "@gc-digital-talent/i18n";
import { Link, Chip, Chips } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import { Maybe, Role, Team } from "@gc-digital-talent/graphql";

import { TeamMember } from "~/utils/teamUtils";

import EditTeamMemberDialog from "./components/EditTeamMemberDialog";
import RemoveTeamMemberDialog from "./components/RemoveTeamMemberDialog";

function orderRoles(roles: Array<Role>, intl: IntlShape) {
  return orderBy(roles, ({ displayName }) => {
    const value = getLocalizedName(displayName, intl);

    return value
      ? value
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLocaleLowerCase()
      : value;
  });
}

export const actionCell = (user: TeamMember, team: Team) => (
  <div
    data-h2-display="base(flex)"
    data-h2-flex-wrap="base(wrap)"
    data-h2-gap="base(x.25)"
  >
    <EditTeamMemberDialog user={user} team={team} />
    <RemoveTeamMemberDialog user={user} team={team} />
  </div>
);

export function emailLinkCell(
  email: Maybe<string> | undefined,
  intl: IntlShape,
) {
  if (email) {
    return (
      <Link color="black" external href={`mailto:${email}`}>
        {email}
      </Link>
    );
  }

  return (
    <span data-h2-font-style="base(italic)">
      {intl.formatMessage({
        defaultMessage: "No email provided",
        id: "1JCjTP",
        description: "Fallback for email value",
      })}
    </span>
  );
}

export function roleCell(roles: Maybe<Maybe<Role>[]>, intl: IntlShape) {
  const nonEmptyRoles = roles?.filter(notEmpty);
  const roleChips = nonEmptyRoles
    ? orderRoles(nonEmptyRoles, intl).map((role) => (
        <Chip color="black" key={role.id}>
          {getLocalizedName(role.displayName, intl)}
        </Chip>
      ))
    : null;

  return roleChips ? <Chips>{roleChips}</Chips> : null;
}

export function roleAccessor(roles: Maybe<Maybe<Role>[]>, intl: IntlShape) {
  const nonEmptyRoles = roles?.filter(notEmpty);

  return nonEmptyRoles
    ? orderRoles(nonEmptyRoles, intl)
        .map((role) => getLocalizedName(role.displayName, intl))
        .join(", ")
    : "";
}
