import { useQuery } from "urql";
import { ReactNode } from "react";

import { Pending } from "@gc-digital-talent/ui";
import { graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

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

interface AuthorizationProviderProps {
  children?: ReactNode;
}

const AuthorizationProvider = ({ children }: AuthorizationProviderProps) => {
  const [{ data, fetching, stale }] = useQuery({
    query: authorizationQuery,
  });
  const isLoaded = !fetching && !stale;

  return (
    <AuthorizationContainer
      roleAssignments={unpackMaybes(data?.myAuth?.roleAssignments)}
      userAuthInfo={data?.myAuth}
      isLoaded={isLoaded}
    >
      <Pending fetching={!isLoaded}>{children}</Pending>
    </AuthorizationContainer>
  );
};

export default AuthorizationProvider;
