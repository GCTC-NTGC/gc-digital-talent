import React from "react";
import useAuthorizationContext from "@common/hooks/useAuthorizationContext";
import { Navigate } from "react-router-dom";
import { useApplicantProfileRoutes } from "../../applicantProfileRoutes";
import { useTalentSearchRoutes } from "../../talentSearchRoutes";

const ProfileRedirect = () => {
  const paths = useApplicantProfileRoutes();
  const tsPaths = useTalentSearchRoutes();
  const { loggedInUser } = useAuthorizationContext();

  if (loggedInUser) {
    return <Navigate to={paths.home(loggedInUser.id)} replace />;
  }

  return <Navigate to={tsPaths.home()} replace />;
};

export default ProfileRedirect;
