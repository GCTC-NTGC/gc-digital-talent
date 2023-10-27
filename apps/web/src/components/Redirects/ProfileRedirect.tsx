import React from "react";
import { useNavigate } from "react-router-dom";

import { useAuthorization } from "@gc-digital-talent/auth";
import { Loading } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";

const ProfileRedirect = () => {
  const paths = useRoutes();
  const navigate = useNavigate();
  const { userAuthInfo } = useAuthorization();

  React.useEffect(() => {
    if (userAuthInfo) {
      navigate(paths.profile(userAuthInfo.id), { replace: true });
    } else {
      navigate(paths.home(), { replace: true });
    }
  }, [userAuthInfo, navigate, paths]);

  return <Loading />; // Show loading spinner while we process redirect
};

export default ProfileRedirect;
