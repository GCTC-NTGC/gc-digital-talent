import { useIntl } from "react-intl";
import { useMutation } from "urql";
import { DefaultValues, FieldValues, useForm } from "react-hook-form";

import {
  Community,
  FragmentType,
  getFragment,
  graphql,
  Pool,
  Role,
  Team,
  UpdateUserRolesInput,
} from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { Chip, Chips } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

export const UserRoleTable_Fragment = graphql(/** GraphQL */ `
  fragment UserRoleTable on User {
    id
    firstName
    lastName
    authInfo {
      roleAssignments {
        id
        role {
          id
          name
          isTeamBased
          displayName {
            localized
          }
        }
        teamable {
          id
          __typename
          ... on Pool {
            name {
              localized
            }
            teamIdForRoleAssignment
          }
          ... on Community {
            name {
              localized
            }
            teamIdForRoleAssignment
          }
        }
      }
    }
  }
`);

export const UserRoleTableAvailableRoles_Fragment = graphql(/** GraphQL */ `
  fragment UserRoleTableAvailableRoles on Query {
    roles {
      id
      isTeamBased
      name
      displayName {
        localized
      }
    }
  }
`);

export function roleCell(roles?: string | string[] | null) {
  if (!roles) return null;

  if (Array.isArray(roles)) {
    return (
      <Chips>
        {roles.map((role) => {
          return <Chip key={role}>{role}</Chip>;
        })}
      </Chips>
    );
  }
  return <Chip>{roles}</Chip>;
}

export interface UserRoleDialogBaseProps {
  query: FragmentType<typeof UserRoleTable_Fragment>;
}

export interface RoleTableProps extends UserRoleDialogBaseProps {
  optionsQuery: FragmentType<typeof UserRoleTableAvailableRoles_Fragment>;
}

export const getUserRoleDialogFragment = (
  query: FragmentType<typeof UserRoleTable_Fragment>,
) => getFragment(UserRoleTable_Fragment, query);

export const getRoleTableFragments = ({
  query,
  optionsQuery,
}: RoleTableProps) => {
  const user = getFragment(UserRoleTable_Fragment, query);
  const options = getFragment(
    UserRoleTableAvailableRoles_Fragment,
    optionsQuery,
  );

  return { user, options: unpackMaybes(options.roles) };
};

export const UpdateUserRoles_Mutation = graphql(/* GraphQL */ `
  mutation UpdateUserRoles($input: UpdateUserRolesInput!) {
    updateUserRoles(updateUserRolesInput: $input) {
      id
      roleAssignments {
        id
        role {
          id
          name
          isTeamBased
          displayName {
            localized
          }
        }
      }
    }
  }
`);

export const useUpdateRolesMutation = <TFormValues extends FieldValues>(
  defaultValues?: DefaultValues<TFormValues>,
) => {
  const [{ fetching }, executeMutation] = useMutation(UpdateUserRoles_Mutation);
  const intl = useIntl();
  const methods = useForm<TFormValues>({ defaultValues });

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Failed to update user role(s).",
        id: "4O9Ymu",
        description: "Error message for updating user roles",
      }),
    );
    return undefined;
  };

  const updateRoles = async (input: UpdateUserRolesInput) => {
    if (fetching) return Promise.resolve(undefined);
    return executeMutation({ input })
      .then((res) => {
        if (res.error || !res.data?.updateUserRoles?.id) {
          return handleError();
        }

        toast.success(
          intl.formatMessage({
            defaultMessage: "Updated user role(s) successfully!",
            id: "Sg6SEd",
            description: "Success message when updating a users roles",
          }),
        );

        return res.data?.updateUserRoles?.id;
      })
      .catch(handleError);
  };

  return { fetching, updateRoles, methods };
};

export type PoolTeamable = Pick<
  Pool,
  "id" | "__typename" | "name" | "teamIdForRoleAssignment"
>;

export type CommunityTeamable = Pick<
  Community,
  "id" | "__typename" | "name" | "teamIdForRoleAssignment"
>;

type TeamTeamable = Pick<Team, "id" | "__typename">;

export type Teamable = PoolTeamable | CommunityTeamable | TeamTeamable;

export interface PoolAssignment {
  pool: PoolTeamable;
  roles: Role[];
}
export interface CommunityAssignment {
  community: CommunityTeamable;
  roles: Role[];
}

export const isCommunityTeamable = (
  teamable: Teamable | undefined | null,
): teamable is CommunityTeamable => {
  if (teamable && teamable.__typename === "Community") {
    return true;
  }
  return false;
};

export const isPoolTeamable = (
  teamable: Teamable | undefined | null,
): teamable is PoolTeamable => {
  if (teamable && teamable.__typename === "Pool") {
    return true;
  }
  return false;
};
