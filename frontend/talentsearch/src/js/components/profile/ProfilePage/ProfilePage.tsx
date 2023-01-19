import React from "react";
import { useIntl } from "react-intl";
import { ThrowNotFound } from "@common/components/NotFound";
import Pending from "@common/components/Pending";
import imageUrl from "@common/helpers/imageUrl";
import { notEmpty } from "@common/helpers/util";
import { getFullNameHtml } from "@common/helpers/nameUtils";
import ExperienceSection from "@common/components/UserProfile/ExperienceSection";
import SEO from "@common/components/SEO/SEO";

import UserProfile from "@common/components/UserProfile";
import type { Applicant } from "@common/api/generated";

import MyStatusApi from "../../myStatusForm/MyStatusForm";
import TALENTSEARCH_APP_DIR from "../../../talentSearchConstants";
import useRoutes from "../../../hooks/useRoutes";
import { useGetMeQuery, User, GetMeQuery } from "../../../api/generated";
import profileMessages from "../profileMessages";

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

  return (
    <>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "My profile",
          id: "pR23NW",
          description: "Page title for the applicants profile page",
        })}
      />
      <div
        data-h2-padding="base(x1, x.5)"
        data-h2-color="base(dt-white)"
        data-h2-text-align="base(center)"
        style={{
          background: `url(${imageUrl(
            TALENTSEARCH_APP_DIR,
            "applicant-profile-banner.png",
          )})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h1
          data-h2-margin="base(x2, 0)"
          data-h2-font-weight="base(700)"
          style={{
            letterSpacing: "-2px",
            textShadow: "0 3px 3px rgba(10, 10, 10, .3)",
          }}
        >
          {intl.formatMessage(
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
        </h1>
      </div>

      <UserProfile
        applicant={profileDataInput as Applicant}
        sections={{
          myStatus: { isVisible: true, override: <MyStatusApi /> },
          hiringPools: { isVisible: false },
          about: { isVisible: true, editUrl: paths.aboutMe(userId) },
          language: {
            isVisible: true,
            editUrl: paths.languageInformation(userId),
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
