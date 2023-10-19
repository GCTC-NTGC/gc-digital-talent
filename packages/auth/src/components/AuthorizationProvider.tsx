import React from "react";

import { useGetCurrentAuthorizedUserQuery } from "@gc-digital-talent/graphql";
import { Pending } from "@gc-digital-talent/ui";
import { useLogger } from "@gc-digital-talent/logger";
import { notEmpty } from "@gc-digital-talent/helpers";

import AuthorizationContainer from "./AuthorizationContainer";
import { containsUserDeletedError } from "../utils/errors";

interface AuthorizationProviderProps {
  children?: React.ReactNode;
}

const AuthorizationProvider = ({ children }: AuthorizationProviderProps) => {
  const [{ data, fetching, stale, error }] = useGetCurrentAuthorizedUserQuery();
  const isLoaded = !fetching && !stale;
  let deleted = false;
  const logger = useLogger();

  if (error && containsUserDeletedError(error)) {
    logger.debug("Detected UserDeleted error in AuthorizationProvider");
    deleted = true;
  }

  const roleAssignmentsFiltered =
    data?.myAuth?.roleAssignments?.filter(notEmpty) ?? [];

  return (
    <AuthorizationContainer
      roleAssignments={roleAssignmentsFiltered}
      email={data?.myAuth?.email}
      deleted={deleted}
      userAuthInfo={data?.myAuth}
      isLoaded={isLoaded}
    >
      <Pending fetching={!isLoaded}>{children}</Pending>
    </AuthorizationContainer>
  );
};

export default AuthorizationProvider;
