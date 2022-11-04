import React from "react";
import useAuthorizationContext from "@common/hooks/useAuthorizationContext";
import { Navigate, useLocation } from "react-router-dom";
import { useApplicantProfileRoutes } from "../../applicantProfileRoutes";
import { useTalentSearchRoutes } from "../../talentSearchRoutes";

const TalentRedirect = () => {
  const paths = useApplicantProfileRoutes();
  const tsPaths = useTalentSearchRoutes();
  const location = useLocation();
  const { loggedInUser } = useAuthorizationContext();

  if (loggedInUser) {
    const { id } = loggedInUser;
    let profilePath = paths.home(id);
    if (location.pathname.includes("about-me")) {
      profilePath = paths.aboutMe(id);
    }
    if (location.pathname.includes("create-account")) {
      profilePath = paths.createAccount();
    }
    if (location.pathname.includes("language-information")) {
      profilePath = paths.languageInformation(id);
    }
    if (location.pathname.includes("government-information")) {
      profilePath = paths.governmentInformation(id);
    }
    if (location.pathname.includes("role-salary")) {
      profilePath = paths.roleSalary(id);
    }
    if (location.pathname.includes("work-location")) {
      profilePath = paths.workLocation(id);
    }
    if (location.pathname.includes("work-preferences")) {
      profilePath = paths.workPreferences(id);
    }
    if (location.pathname.includes("diversity-and-inclusion")) {
      profilePath = paths.diversityEquityInclusion(id);
    }
    if (location.pathname.includes("skills-and-experiences")) {
      profilePath = paths.skillsAndExperiences(id);

      if (location.pathname.includes("create")) {
        if (location.pathname.includes("award")) {
          profilePath = paths.createAward(id);
        }
        if (location.pathname.includes("community")) {
          profilePath = paths.createCommunity(id);
        }
        if (location.pathname.includes("education")) {
          profilePath = paths.createEducation(id);
        }
        if (location.pathname.includes("personal")) {
          profilePath = paths.createPersonal(id);
        }
        if (location.pathname.includes("work")) {
          profilePath = paths.createWork(id);
        }
      }
    }

    return <Navigate to={profilePath} replace />;
  }

  return <Navigate to={tsPaths.home()} replace />;
};

export default TalentRedirect;
