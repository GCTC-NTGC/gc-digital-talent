import React from "react";
import { Navigate } from "react-router-dom";

import useAuthorizationContext from "@common/hooks/useAuthorizationContext";

import useRoutes from "../../hooks/useRoutes";

const ProfileRedirect = () => {
  const paths = useRoutes();
  const { loggedInUser } = useAuthorizationContext();

  if (loggedInUser) {
    return <Navigate to={paths.profile(loggedInUser.id)} replace />;
  }

  return <Navigate to={paths.home()} replace />;
};

export default ProfileRedirect;
