import React from "react";

import { AuthorizationContainer } from "../Auth";
import { useGetMeQuery } from "../../api/generated";
import Pending from "../Pending";

const AuthorizationProvider: React.FC = ({ children }) => {
  const [{ data, fetching, stale }] = useGetMeQuery();
  const isLoaded = !fetching && !stale;

  return (
    <AuthorizationContainer
      userRoles={data?.me?.roles}
      email={data?.me?.email}
      currentUser={data?.me}
      isLoaded={isLoaded}
    >
      <Pending fetching={!isLoaded}>{children}</Pending>
    </AuthorizationContainer>
  );
};

export default AuthorizationProvider;
