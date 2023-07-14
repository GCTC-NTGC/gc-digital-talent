import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuthorization } from "@gc-digital-talent/auth";
import { Loading } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";

const TalentRedirect = () => {
  const paths = useRoutes();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthorization();

  React.useEffect(() => {
    if (user) {
      const { id } = user;
      let profilePath = paths.profile(id);
      if (pathname.includes("about-me")) {
        profilePath = paths.aboutMe(id);
      }
      if (pathname.includes("create-account")) {
        profilePath = paths.createAccount();
      }
      if (pathname.includes("language-information")) {
        profilePath = paths.languageInformation(id);
      }
      if (pathname.includes("government-information")) {
        profilePath = paths.governmentInformation(id);
      }
      if (pathname.includes("role-salary")) {
        profilePath = paths.roleSalary(id);
      }
      if (pathname.includes("work-location")) {
        profilePath = paths.workLocation(id);
      }
      if (pathname.includes("work-preferences")) {
        profilePath = paths.workPreferences(id);
      }
      if (pathname.includes("diversity-and-inclusion")) {
        profilePath = paths.diversityEquityInclusion(id);
      }
      if (pathname.includes("resume-and-recruitment")) {
        profilePath = paths.careerTimelineAndRecruitment(id);

        if (pathname.includes("create")) {
          if (pathname.includes("award")) {
            profilePath = paths.createAward(id);
          }
          if (pathname.includes("community")) {
            profilePath = paths.createCommunity(id);
          }
          if (pathname.includes("education")) {
            profilePath = paths.createEducation(id);
          }
          if (pathname.includes("personal")) {
            profilePath = paths.createPersonal(id);
          }
          if (pathname.includes("work")) {
            profilePath = paths.createWork(id);
          }
        }
      }

      navigate(profilePath, { replace: true });
    } else {
      // This is an else so it doesn't fire too early
      navigate(paths.home(), { replace: true });
    }
  }, [pathname, user, navigate, paths]);

  return <Loading />; // Show loading spinner while we process redirect
};

export default TalentRedirect;
