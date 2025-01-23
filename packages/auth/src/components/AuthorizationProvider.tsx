import { useQuery } from "urql";
import { ReactNode } from "react";

import { Pending } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import { graphql } from "@gc-digital-talent/graphql";

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
        }
      }
    }
  }
`);

const authorizationTeamableQuery = graphql(/** GraphQL */ `
  query authorizationTeamableQuery {
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
        }
        teamable {
          id
        }
      }
    }
  }
`);

interface AuthorizationProviderProps {
  children?: ReactNode;
}

const AuthorizationProvider = ({ children }: AuthorizationProviderProps) => {
  // query teamable objects conditionally
  const privilegedPaths = ["/admin", "/en/admin", "/fr/admin"];
  const isPrivilegedLocation = privilegedPaths.some(
    (path) =>
      window.location.pathname === path ||
      window.location.pathname.startsWith(`${path}/`),
  );

  const [{ data, fetching, stale }] = useQuery({
    query: isPrivilegedLocation
      ? authorizationTeamableQuery
      : authorizationQuery,
  });
  const isLoaded = !fetching && !stale;

  const roleAssignmentsFiltered =
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
