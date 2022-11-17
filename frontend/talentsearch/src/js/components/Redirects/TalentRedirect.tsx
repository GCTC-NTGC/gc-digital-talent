import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import useAuthorizationContext from "@common/hooks/useAuthorizationContext";
import Loading from "@common/components/Pending/Loading";

import useRoutes from "../../hooks/useRoutes";

const TalentRedirect = () => {
  const paths = useRoutes();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { loggedInUser } = useAuthorizationContext();

  React.useEffect(() => {
    if (loggedInUser) {
      const { id } = loggedInUser;
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
      if (pathname.includes("skills-and-experiences")) {
        profilePath = paths.skillsAndExperiences(id);

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
  }, [pathname, loggedInUser, navigate, paths]);

  return <Loading />; // Show loading spinner while we process redirect
};

export default TalentRedirect;
