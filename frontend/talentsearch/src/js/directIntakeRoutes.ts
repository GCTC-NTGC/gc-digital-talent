import { getLocale } from "@common/helpers/localize";
import path from "path-browserify";
import { useIntl } from "react-intl";
import { DIRECTINTAKE_APP_DIR } from "./talentSearchConstants";

export type DirectIntakeRoutes = ReturnType<typeof directIntakeRoutes>;

const directIntakeRoutes = (lang: string) => {
  const home = (): string => path.join("/", lang, DIRECTINTAKE_APP_DIR);
  const userHome = (userId: string): string =>
    path.join("/", lang, "users", userId);

  return {
    home,
    allPools: (): string => path.join(home(), "pools"),
    pool: (id: string) => path.join(home(), "pools", id),
    poolApply: (id: string) => path.join(home(), "pools", id, "apply"),
    poolAdvertisement: (id: string) => path.join(home(), "pools", id, "view"),
    poolApplyThanks: (id: string) =>
      path.join(home(), "pools", id, "apply", "thanks"),
    signAndSubmit: (id: string) =>
      path.join(home(), "applications", id, "submit"),
    applications: (userId: string) =>
      path.join(userHome(userId), "applications"),
    aboutMe: (poolCandidateId: string) =>
      path.join(home(), "applications", poolCandidateId, "apply", "about-me"),
    languageInformation: (poolCandidateId: string) =>
      path.join(
        home(),
        "applications",
        poolCandidateId,
        "apply",
        "language-info",
      ),
    governmentInformation: (poolCandidateId: string) =>
      path.join(
        home(),
        "applications",
        poolCandidateId,
        "apply",
        "government-info",
      ),
    roleSalary: (poolCandidateId: string) =>
      path.join(
        home(),
        "applications",
        poolCandidateId,
        "apply",
        "role-salary-expectations",
      ),
    workLocation: (poolCandidateId: string) =>
      path.join(
        home(),
        "applications",
        poolCandidateId,
        "apply",
        "work-location",
      ),
    workPreferences: (poolCandidateId: string) =>
      path.join(
        home(),
        "applications",
        poolCandidateId,
        "apply",
        "work-preferences",
      ),
    diversityEquityInclusion: (poolCandidateId: string) =>
      path.join(
        home(),
        "applications",
        poolCandidateId,
        "apply",
        "employment-equity",
      ),
    skillsAndExperiences: (poolCandidateId: string) =>
      path.join(
        home(),
        "applications",
        poolCandidateId,
        "apply",
        "experiences",
      ),
    reviewApplication: (poolCandidateId: string) =>
      path.join(home(), "applications", poolCandidateId, "apply"),
  };
};

export const useDirectIntakeRoutes = (): DirectIntakeRoutes => {
  const intl = useIntl();
  const locale = getLocale(intl);
  return directIntakeRoutes(locale);
};

export default directIntakeRoutes;
