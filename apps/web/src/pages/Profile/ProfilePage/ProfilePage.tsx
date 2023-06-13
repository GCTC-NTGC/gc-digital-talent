import React from "react";
import { useIntl } from "react-intl";

import { ThrowNotFound, Pending, Link } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import { useFeatureFlags } from "@gc-digital-talent/env";

import { getFullNameHtml } from "~/utils/nameUtils";
import Hero from "~/components/Hero/Hero";
import useRoutes from "~/hooks/useRoutes";
import profileMessages from "~/messages/profileMessages";
import { Applicant, useGetMeQuery, User, GetMeQuery } from "~/api/generated";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import UserProfile from "~/components/UserProfile";
import SEO from "~/components/SEO/SEO";
import LanguageInformationSection from "~/components/UserProfile/ProfileSections/LanguageInformationSection";
import ExperienceSection from "~/components/UserProfile/ExperienceSection";
import MyStatusApi from "./components/MyStatusForm/MyStatusForm";

export interface ProfilePageProps {
  profileDataInput: User;
}

export const ProfileForm = ({ profileDataInput }: ProfilePageProps) => {
  const { id: userId, experiences } = profileDataInput;
  const paths = useRoutes();

  const intl = useIntl();
  const featureFlags = useFeatureFlags();

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
          myStatus: {
            isVisible: !featureFlags.applicantDashboard,
            override: <MyStatusApi />,
          },
          about: { isVisible: true, editUrl: paths.aboutMe(userId) },
          language: {
            isVisible: true,
            editUrl: paths.languageInformation(userId),
            override: (
              <LanguageInformationSection
                applicant={profileDataInput as Applicant}
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
          resumeAndRecruitments: {
            isVisible: !featureFlags.applicantDashboard,
            editUrl: paths.resumeAndRecruitments(userId),
            override: (
              <ExperienceSection
                experiences={experiences?.filter(notEmpty)}
                nullMessage={
                  <>
                    <p data-h2-padding="base(0, 0, x1, 0)">
                      {intl.formatMessage({
                        defaultMessage:
                          "You haven't added any information here yet.",
                        id: "SCCX7B",
                        description:
                          "Message for when no data exists for the section",
                      })}
                    </p>
                    <p>
                      <Link
                        mode="inline"
                        href={paths.resumeAndRecruitments(userId)}
                      >
                        {intl.formatMessage({
                          defaultMessage: "Edit your experience options.",
                          id: "c39xT8",
                          description:
                            "Link text to edit experience information on profile.",
                        })}
                      </Link>
                    </p>
                  </>
                }
              />
            ),
          },
        }}
      />
    </>
  );
};

const ProfilePage = () => {
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
