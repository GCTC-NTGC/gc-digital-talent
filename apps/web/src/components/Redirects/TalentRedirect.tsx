import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuthorization } from "@gc-digital-talent/auth";
import { Loading } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";

const TalentRedirect = () => {
  const paths = useRoutes();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { userAuthInfo } = useAuthorization();

  React.useEffect(() => {
    if (userAuthInfo) {
      const { id } = userAuthInfo;
      let profilePath = paths.profile(id);
      if (pathname.includes("create-account")) {
        profilePath = paths.createAccount();
      }
      if (pathname.includes("career-timeline")) {
        profilePath = paths.careerTimelineAndRecruitment(id);

        if (pathname.includes("create")) {
          profilePath = paths.createExperience(id);
        }
      }

      navigate(profilePath, { replace: true });
    } else {
      // This is an else so it doesn't fire too early
      navigate(paths.home(), { replace: true });
    }
  }, [pathname, userAuthInfo, navigate, paths]);

  return <Loading />; // Show loading spinner while we process redirect
};

export default TalentRedirect;
