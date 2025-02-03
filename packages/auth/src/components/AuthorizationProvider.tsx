import { useQuery } from "urql";
import { ReactNode } from "react";

import { Pending } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  graphql,
  AuthorizationQueryQuery as AuthorizationQueryType,
} from "@gc-digital-talent/graphql";

import AuthorizationContainer from "./AuthorizationContainer";

const authorizationQuery = graphql(/** GraphQL */ `
  query authorizationQuery {
    myAuth {
      id
      deletedDate
      roleAssignments {
        id
        role {
          id
          name
          isTeamBased
          displayName {
            en
            fr
          }
        }
        team {
          id
          name
          teamIdForRoleAssignment
        }
      }
    }
  }
`);

export type AuthorizationRoleAssignment = NonNullable<
  NonNullable<
    NonNullable<AuthorizationQueryType["myAuth"]>["roleAssignments"]
  >[number]
>;

interface AuthorizationProviderProps {
  children?: ReactNode;
}

const AuthorizationProvider = ({ children }: AuthorizationProviderProps) => {
  const [{ data, fetching, stale }] = useQuery({
    query: authorizationQuery,
  });
  const isLoaded = !fetching && !stale;

  const roleAssignmentsFiltered: AuthorizationRoleAssignment[] =
    data?.myAuth?.roleAssignments?.filter(notEmpty) ?? [];

  return (
    <AuthorizationContainer
      roleAssignments={roleAssignmentsFiltered}
      userAuthInfo={data?.myAuth}
      isLoaded={isLoaded}
    >
      <Pending fetching={!isLoaded}>{children}</Pending>
    </AuthorizationContainer>
  );
};

export default AuthorizationProvider;
