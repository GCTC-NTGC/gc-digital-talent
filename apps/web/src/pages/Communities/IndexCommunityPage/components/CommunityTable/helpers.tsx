import { IntlShape } from "react-intl";

import { Link, Chip } from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  FragmentType,
  getFragment,
  graphql,
  Maybe,
} from "@gc-digital-talent/graphql";

import { MyRoleTeam } from "./types";

export function viewCell(
  url: string,
  label: Maybe<string>,
  intl: IntlShape,
  currentUrl?: string,
) {
  return (
    <Link href={url} color="black" state={{ from: currentUrl ?? null }}>
      {label ?? intl.formatMessage(commonMessages.noNameProvided)}
    </Link>
  );
}

export function myRolesAccessor(
  communityId: string,
  myRoleTeams: MyRoleTeam[],
  intl: IntlShape,
) {
  // pull out roles associated with the (row's) community id passed in for generating searchable string
  const communityFiltered = myRoleTeams.filter(
    (roleCommunity) =>
      roleCommunity.communityId && roleCommunity.communityId === communityId,
  );
  const accessorString = communityFiltered
    .map((roleCommunity) => getLocalizedName(roleCommunity.roleName, intl))
    .join(", ");

  return accessorString;
}

export function myRolesCell(
  teamId: string,
  myRoleTeams: MyRoleTeam[],
  intl: IntlShape,
) {
  // pull out roles associated with the (row's) community id passed in for generating UI elements
  const communityFiltered = myRoleTeams.filter(
    (roleCommunity) =>
      roleCommunity.communityId && roleCommunity.communityId === teamId,
  );

  const rolesChipsArray = communityFiltered.map((roleCommunity) => (
    <Chip color="secondary" key={`${teamId}-${roleCommunity.roleName.en}`}>
      {getLocalizedName(roleCommunity.roleName, intl)}
    </Chip>
  ));

  return rolesChipsArray.length > 0 ? <span>{rolesChipsArray}</span> : null;
}

const CommunityRoleAssignment_Fragment = graphql(/* GraphQL */ `
  fragment CommunityRoleAssignment on RoleAssignment {
    id
    role {
      id
      name
      displayName {
        en
        fr
      }
      isTeamBased
    }
    teamable {
      ... on Community {
        id
        name {
          en
          fr
        }
      }
    }
  }
`);

// given an array of RoleAssignments
// generate an array of MyRoleTeam objects for team-based roles, filtering out individual roles and empty
// the returned array functions like a map
export function roleAssignmentsToRoleTeamArray(
  query: FragmentType<typeof CommunityRoleAssignment_Fragment>[],
): MyRoleTeam[] {
  const roleAssignments = getFragment(CommunityRoleAssignment_Fragment, query);

  let collection: MyRoleTeam[] = [];

  roleAssignments.forEach((roleAssignment) => {
    if (
      roleAssignment?.role &&
      roleAssignment.role.isTeamBased &&
      roleAssignment?.teamable &&
      roleAssignment?.teamable.__typename === "Community" &&
      roleAssignment.role.displayName
    ) {
      const newTeam: MyRoleTeam = {
        communityId: roleAssignment.teamable.id,
        roleName: roleAssignment.role.displayName,
      };

      collection = [newTeam, ...collection];
    }
  });

  return collection;
}
