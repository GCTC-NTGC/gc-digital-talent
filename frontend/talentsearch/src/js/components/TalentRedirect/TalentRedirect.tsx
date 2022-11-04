import React from "react";
import useAuthorizationContext from "@common/hooks/useAuthorizationContext";
import { Navigate } from "react-router-dom";
import { useApplicantProfileRoutes } from "../../applicantProfileRoutes";

const TalentRedirect = () => {
  const paths = useApplicantProfileRoutes();
  const { loggedInUser } = useAuthorizationContext();

  if (loggedInUser) {
    return <Navigate to={paths.home(loggedInUser.id)} replace />;
  }

  return null;
};

export default TalentRedirect;
