import React from "react";
import { useIntl } from "react-intl";
import NotFound from "@common/components/NotFound";
import Pending from "@common/components/Pending";
import { imageUrl } from "@common/helpers/router";
import { notEmpty } from "@common/helpers/util";
import ExperienceSection from "@common/components/UserProfile/ExperienceSection";

import UserProfile from "@common/components/UserProfile";
import type { Applicant } from "@common/api/generated";

import { commonMessages } from "@common/messages";
import { isEmpty } from "lodash";
import MyStatusApi from "../../myStatusForm/MyStatusForm";
import TALENTSEARCH_APP_DIR from "../../../talentSearchConstants";
import { useApplicantProfileRoutes } from "../../../applicantProfileRoutes";
import { useGetMeQuery, User, GetMeQuery } from "../../../api/generated";
import profileMessages from "../profileMessages";

export interface ProfilePageProps {
  profileDataInput: User;
}

// styling a text bit with red colour within intls
export function redText(msg: string) {
  return <span data-h2-font-color="b(red)">{msg}</span>;
}

export const ProfileForm: React.FC<ProfilePageProps> = ({
  profileDataInput,
}) => {
  const { id: userId, firstName, lastName, experiences } = profileDataInput;
  const paths = useApplicantProfileRoutes();

  const experienceEditPaths = {
    awardUrl: (id: string) => paths.editExperience(userId, "award", id),
    communityUrl: (id: string) => paths.editExperience(userId, "community", id),
    educationUrl: (id: string) => paths.editExperience(userId, "education", id),
    personalUrl: (id: string) => paths.editExperience(userId, "personal", id),
    workUrl: (id: string) => paths.editExperience(userId, "work", id),
  };
  let userName = `${firstName} ${lastName}`;
  const intl = useIntl();

  if (
    (firstName === null || isEmpty(firstName)) &&
    (lastName === null || isEmpty(firstName))
  ) {
    userName = intl.formatMessage({
      defaultMessage: "(Missing name)",
      description: "Message for Missing names in profile",
    });
  }

  return (
    <>
      <div
        data-h2-padding="b(top-bottom, m) b(right-left, s)"
        data-h2-font-color="b(white)"
        data-h2-text-align="b(center)"
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
        <h1 data-h2-margin="b(top-bottom, l)">{userName}</h1>
      </div>

      <UserProfile
        applicant={profileDataInput as Applicant}
        sections={{
          myStatus: { isVisible: true, override: <MyStatusApi /> },
          hiringPools: { isVisible: true },
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
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>{intl.formatMessage(profileMessages.userNotFound)}</p>
        </NotFound>
      )}
    </Pending>
  );
};

export default ProfilePage;
