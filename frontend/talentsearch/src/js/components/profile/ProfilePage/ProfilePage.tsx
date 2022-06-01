import React from "react";
import {
  BriefcaseIcon,
  ChatAlt2Icon,
  LibraryIcon,
  LightBulbIcon,
  LightningBoltIcon,
  ThumbUpIcon,
  UserCircleIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/solid";
import { useIntl } from "react-intl";
import { Link } from "@common/components";
import TableOfContents from "@common/components/TableOfContents";
import commonMessages from "@common/messages/commonMessages";
import { imageUrl } from "@common/helpers/router";
import { notEmpty } from "@common/helpers/util";
import ExperienceSection from "@common/components/UserProfile/ExperienceSection";
import { unpackMaybes } from "@common/helpers/formUtils";

import UserProfile from "@common/components/UserProfile";

import AboutSection from "@common/components/UserProfile/ProfileSections/AboutSection";
import LanguageInformationSection from "@common/components/UserProfile/ProfileSections/LanguageInformationSection";
import GovernmentInformationSection from "@common/components/UserProfile/ProfileSections/GovernmentInformationSection";
import WorkLocationSection from "@common/components/UserProfile/ProfileSections/WorkLocationSection";
import WorkPreferencesSection from "@common/components/UserProfile/ProfileSections/WorkPreferencesSection";
import DiversityEquityInclusionSection from "@common/components/UserProfile/ProfileSections/DiversityEquityInclusionSection";
import type { Applicant } from "@common/api/generated";
import TALENTSEARCH_APP_DIR from "../../../talentSearchConstants";
import { useApplicantProfileRoutes } from "../../../applicantProfileRoutes";
import { useGetMeQuery, User, GetMeQuery } from "../../../api/generated";

import MyStatusApi from "../../myStatusForm/MyStatusForm";
import CandidatePoolsSection from "./CandidatePoolsSection";

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
  const { firstName, lastName, poolCandidates, experiences } = profileDataInput;

  const intl = useIntl();
  const paths = useApplicantProfileRoutes();

  const experienceEditPaths = {
    awardUrl: (id: string) => paths.editExperience("award", id),
    communityUrl: (id: string) => paths.editExperience("community", id),
    educationUrl: (id: string) => paths.editExperience("education", id),
    personalUrl: (id: string) => paths.editExperience("personal", id),
    workUrl: (id: string) => paths.editExperience("work", id),
  };

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
        <h1 data-h2-margin="b(top-bottom, l)">{`${firstName} ${lastName}`}</h1>
      </div>

      <UserProfile
        applicant={profileDataInput as Applicant}
        sections={{
          myStatus: { isVisible: true, override: <MyStatusApi /> },
          hiringPools: { isVisible: true },
          about: { isVisible: true },
          language: { isVisible: true },
          government: { isVisible: true },
          workLocation: { isVisible: true },
          workPreferences: { isVisible: true },
          employmentEquity: { isVisible: true },
          skillsExperience: {
            isVisible: true,
            override: (
              <ExperienceSection
                experiences={experiences?.filter(notEmpty)}
                experienceEditPaths={experienceEditPaths}
              />
            ),
          },
        }}
      />
    </>
  );
};

export const ProfilePage: React.FunctionComponent = () => {
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

  if (fetching) return <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>;
  if (error)
    return (
      <p>
        {intl.formatMessage(commonMessages.loadingError)}
        {error.message}
      </p>
    );

  if (userData) return <ProfileForm profileDataInput={userData} />;
  return (
    <p>
      {intl.formatMessage({
        defaultMessage: "No user data",
        description: "No user data was found",
      })}
    </p>
  );
};
