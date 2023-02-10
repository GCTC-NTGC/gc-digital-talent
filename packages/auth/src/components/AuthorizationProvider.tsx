import React from "react";

import { useGetCurrentAuthorizedUserQuery } from "@gc-digital-talent/graphql";
import AuthorizationContainer from "./AuthorizationContainer";

import Pending from "../Pending";

interface AuthorizationProviderProps {
  children?: React.ReactNode;
}

const AuthorizationProvider = ({ children }: AuthorizationProviderProps) => {
  const [{ data, fetching, stale }] = useGetCurrentAuthorizedUserQuery();
  const isLoaded = !fetching && !stale;

  return (
    <AuthorizationContainer
      userRoles={data?.me?.legacyRoles}
      email={data?.me?.email}
      currentUser={data?.me}
      isLoaded={isLoaded}
    >
      <Pending fetching={!isLoaded}>{children}</Pending>
    </AuthorizationContainer>
  );
};

export default AuthorizationProvider;
