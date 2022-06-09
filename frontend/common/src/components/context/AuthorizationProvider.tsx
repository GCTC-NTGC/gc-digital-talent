import React from "react";

import { AuthorizationContainer } from "../Auth";
import { useGetMeQuery } from "../../api/generated";

const AuthorizationProvider: React.FC = ({ children }) => {
  const [result] = useGetMeQuery();
  const { data, fetching } = result;

  return (
    <AuthorizationContainer
      userRoles={data?.me?.roles}
      email={data?.me?.email}
      isLoaded={!fetching}
    >
      {children}
    </AuthorizationContainer>
  );
};

export default AuthorizationProvider;
