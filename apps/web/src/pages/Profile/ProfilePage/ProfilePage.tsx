import React from "react";
import { useIntl } from "react-intl";

import Hero from "@common/components/Hero/Hero";
import { ThrowNotFound } from "@common/components/NotFound";
import Pending from "@common/components/Pending";
import { notEmpty } from "@common/helpers/util";
import { getFullNameHtml } from "@common/helpers/nameUtils";
import ExperienceSection from "@common/components/UserProfile/ExperienceSection";
import SEO from "@common/components/SEO/SEO";
import UserProfile from "@common/components/UserProfile";
import type { Applicant } from "@common/api/generated";

import useRoutes from "~/hooks/useRoutes";
import profileMessages from "~/messages/profileMessages";
import { useGetMeQuery, User, GetMeQuery } from "~/api/generated";

import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import LanguageInformationSection from "@common/components/UserProfile/ProfileSections/LanguageInformationSection";
import MyStatusApi from "./components/MyStatusForm/MyStatusForm";

export interface ProfilePageProps {
  profileDataInput: User;
}

// styling a text bit with red colour within intls
export function redText(msg: string) {
  return <span data-h2-color="base(dt-error)">{msg}</span>;
}

export const ProfileForm: React.FC<ProfilePageProps> = ({
  profileDataInput,
}) => {
  const { id: userId, experiences } = profileDataInput;
  const paths = useRoutes();

  const experienceEditPaths = {
    awardUrl: (id: string) => paths.editExperience(userId, "award", id),
    communityUrl: (id: string) => paths.editExperience(userId, "community", id),
    educationUrl: (id: string) => paths.editExperience(userId, "education", id),
    personalUrl: (id: string) => paths.editExperience(userId, "personal", id),
    workUrl: (id: string) => paths.editExperience(userId, "work", id),
  };
  const intl = useIntl();

  const pageTitle = intl.formatMessage({
    defaultMessage: "My profile",
    id: "pR23NW",
    description: "Page title for the applicants profile page",
  });

  const crumbs = useBreadcrumbs([
    {
      label: pageTitle,
      url: paths.profile(userId),
    },
  ]);

  return (
    <>
      <SEO title={pageTitle} />
      <Hero
        title={intl.formatMessage(
          {
            defaultMessage: "{name}'s profile",
            id: "jslBEY",
            description: "Title for a specific users profile page",
          },
          {
            name: getFullNameHtml(
              profileDataInput.firstName,
              profileDataInput.lastName,
              intl,
            ),
          },
        )}
        crumbs={crumbs}
      />
      <UserProfile
        applicant={profileDataInput as Applicant}
        sections={{
          myStatus: { isVisible: true, override: <MyStatusApi /> },
          hiringPools: { isVisible: false },
          about: { isVisible: true, editUrl: paths.aboutMe(userId) },
          language: {
            isVisible: true,
            editUrl: paths.languageInformation(userId),
            override: (
              <LanguageInformationSection
                applicant={profileDataInput}
                editPath={paths.languageInformation(userId)}
              />
            ),
          },
          government: {
            isVisible: true,
            editUrl: paths.governmentInformation(userId),
          },
          workLocation: {
            isVisible: true,
            editUrl: paths.workLocation(userId),
          },
          workPreferences: {
            isVisible: true,
            editUrl: paths.workPreferences(userId),
          },
          employmentEquity: {
            isVisible: true,
            editUrl: paths.diversityEquityInclusion(userId),
          },
          roleSalary: { isVisible: true, editUrl: paths.roleSalary(userId) },
          skillsExperience: {
            isVisible: true,
            editUrl: paths.skillsAndExperiences(userId),
            override: (
              <ExperienceSection
                experiences={experiences?.filter(notEmpty)}
                experienceEditPaths={experienceEditPaths}
                editPath={paths.skillsAndExperiences(userId)}
              />
            ),
          },
        }}
      />
    </>
  );
};

const ProfilePage: React.FunctionComponent = () => {
  const intl = useIntl();
  const [result] = useGetMeQuery();
  const { data, fetching, error } = result;

  // type magic on data variable to make it end up as a valid User type
  const dataToUser = (input: GetMeQuery): User | undefined => {
    if (input) {
      if (input.me) {
        return input.me;
      }
    }
    return undefined;
  };
  const userData = data ? dataToUser(data) : undefined;

  return (
    <Pending fetching={fetching} error={error}>
      {userData ? (
        <ProfileForm profileDataInput={userData} />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export default ProfilePage;
