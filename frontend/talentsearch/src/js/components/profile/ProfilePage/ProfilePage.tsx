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
import AboutSection from "@common/components/UserProfile/ProfileSections/AboutSection";
import LanguageInformationSection from "@common/components/UserProfile/ProfileSections/LanguageInformationSection";
import GovernmentInformationSection from "@common/components/UserProfile/ProfileSections/GovernmentInformationSection";
import WorkLocationSection from "@common/components/UserProfile/ProfileSections/WorkLocationSection";
import WorkPreferencesSection from "@common/components/UserProfile/ProfileSections/WorkPreferencesSection";
import DiversityEquityInclusionSection from "@common/components/UserProfile/ProfileSections/DiversityEquityInclusionSection";
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
      <TableOfContents.Wrapper>
        <TableOfContents.Navigation>
          <TableOfContents.AnchorLink id="status-section">
            {intl.formatMessage({
              defaultMessage: "My Status",
              description: "Title of the My Status section",
            })}
          </TableOfContents.AnchorLink>
          <TableOfContents.AnchorLink id="pools-section">
            {intl.formatMessage({
              defaultMessage: "My Hiring Pools",
              description: "Title of the My Hiring Pools section",
            })}
          </TableOfContents.AnchorLink>
          <TableOfContents.AnchorLink id="about-me-section">
            {intl.formatMessage({
              defaultMessage: "About Me",
              description: "Title of the About Me section",
            })}
          </TableOfContents.AnchorLink>
          <TableOfContents.AnchorLink id="language-section">
            {intl.formatMessage({
              defaultMessage: "Language Information",
              description: "Title of the Language Information section",
            })}
          </TableOfContents.AnchorLink>
          <TableOfContents.AnchorLink id="gov-info-section">
            {intl.formatMessage({
              defaultMessage: "Government Information",
              description: "Title of the Government Information section",
            })}
          </TableOfContents.AnchorLink>
          <TableOfContents.AnchorLink id="work-location-section">
            {intl.formatMessage({
              defaultMessage: "Work Location",
              description: "Title of the Work Location section",
            })}
          </TableOfContents.AnchorLink>
          <TableOfContents.AnchorLink id="work-preferences-section">
            {intl.formatMessage({
              defaultMessage: "Work Preferences",
              description: "Title of the Work Preferences section",
            })}
          </TableOfContents.AnchorLink>
          <TableOfContents.AnchorLink id="diversity-section">
            {intl.formatMessage({
              defaultMessage: "Diversity, Equity and Inclusion",
              description:
                "Title of the Diversity, Equity and Inclusion section",
            })}
          </TableOfContents.AnchorLink>
          <TableOfContents.AnchorLink id="skills-section">
            {intl.formatMessage({
              defaultMessage: "My Skills and Experience",
              description: "Title of the My Skills and Experience section",
            })}
          </TableOfContents.AnchorLink>
        </TableOfContents.Navigation>
        <TableOfContents.Content>
          <TableOfContents.Section id="status-section">
            <TableOfContents.Heading icon={LightBulbIcon}>
              {intl.formatMessage({
                defaultMessage: "My status",
                description: "Title of the My status section",
              })}
            </TableOfContents.Heading>
            <MyStatusApi />
          </TableOfContents.Section>
          <TableOfContents.Section id="pools-section">
            <TableOfContents.Heading icon={UserGroupIcon}>
              {intl.formatMessage({
                defaultMessage: "My hiring pools",
                description: "Title of the My hiring pools section",
              })}
            </TableOfContents.Heading>
            <CandidatePoolsSection
              poolCandidates={unpackMaybes(poolCandidates)}
            />
          </TableOfContents.Section>
          <TableOfContents.Section id="about-me-section">
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <TableOfContents.Heading
                icon={UserIcon}
                style={{ flex: "1 1 0%" }}
              >
                {intl.formatMessage({
                  defaultMessage: "About me",
                  description: "Title of the About me section",
                })}
              </TableOfContents.Heading>
              <Link
                href={paths.aboutMe()}
                title=""
                {...{
                  "data-h2-font-color": "b(lightpurple)",
                }}
              >
                {intl.formatMessage({
                  defaultMessage: "Edit About Me",
                  description:
                    "Text on link to update a users personal information",
                })}
              </Link>
            </div>
            <AboutSection
              applicant={profileDataInput}
              editPath={paths.aboutMe()}
            />
          </TableOfContents.Section>
          <TableOfContents.Section id="language-section">
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <TableOfContents.Heading
                icon={ChatAlt2Icon}
                style={{ flex: "1 1 0%" }}
              >
                {intl.formatMessage({
                  defaultMessage: "Language information",
                  description: "Title of the Language information section",
                })}
              </TableOfContents.Heading>
              <Link
                href={paths.languageInformation()}
                title=""
                {...{
                  "data-h2-font-color": "b(lightpurple)",
                }}
              >
                {intl.formatMessage({
                  defaultMessage: "Edit Language Information",
                  description:
                    "Text on link to update a users language information",
                })}
              </Link>
            </div>
            <LanguageInformationSection
              applicant={profileDataInput}
              editPath={paths.languageInformation()}
            />
          </TableOfContents.Section>
          <TableOfContents.Section id="gov-info-section">
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <TableOfContents.Heading
                icon={LibraryIcon}
                style={{ flex: "1 1 0%" }}
              >
                {intl.formatMessage({
                  defaultMessage: "Government information",
                  description: "Title of the Government information section",
                })}
              </TableOfContents.Heading>
              <Link
                href={paths.governmentInformation()}
                title=""
                {...{
                  "data-h2-font-color": "b(lightpurple)",
                }}
              >
                {intl.formatMessage({
                  defaultMessage: "Edit Government Information",
                  description:
                    "Text on link to update a users government information",
                })}
              </Link>
            </div>
            <GovernmentInformationSection
              applicant={profileDataInput}
              editPath={paths.languageInformation()}
            />
          </TableOfContents.Section>
          <TableOfContents.Section id="work-location-section">
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <TableOfContents.Heading
                icon={BriefcaseIcon}
                style={{ flex: "1 1 0%" }}
              >
                {intl.formatMessage({
                  defaultMessage: "Work location",
                  description: "Title of the Work location section",
                })}
              </TableOfContents.Heading>
              <Link
                href={paths.workLocation()}
                title=""
                {...{
                  "data-h2-font-color": "b(lightpurple)",
                }}
              >
                {intl.formatMessage({
                  defaultMessage: "Edit Work Location",
                  description:
                    "Text on link to update a users work location info",
                })}
              </Link>
            </div>
            <WorkLocationSection
              applicant={profileDataInput}
              editPath={paths.workLocation()}
            />
          </TableOfContents.Section>
          <TableOfContents.Section id="work-preferences-section">
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <TableOfContents.Heading
                icon={ThumbUpIcon}
                style={{ flex: "1 1 0%" }}
              >
                {intl.formatMessage({
                  defaultMessage: "Work preferences",
                  description: "Title of the Work preferences section",
                })}
              </TableOfContents.Heading>
              <Link
                href={paths.workPreferences()}
                title=""
                {...{
                  "data-h2-font-color": "b(lightpurple)",
                }}
              >
                {intl.formatMessage({
                  defaultMessage: "Edit Work Preferences",
                  description:
                    "Text on link to update a users work preferences",
                })}
              </Link>
            </div>
            <WorkPreferencesSection
              applicant={profileDataInput}
              editPath={paths.workPreferences()}
            />
          </TableOfContents.Section>
          <TableOfContents.Section id="diversity-section">
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <TableOfContents.Heading
                icon={UserCircleIcon}
                style={{ flex: "1 1 0%" }}
              >
                {intl.formatMessage({
                  defaultMessage: "Diversity, equity and inclusion",
                  description:
                    "Title of the Diversity, equity and inclusion section",
                })}
              </TableOfContents.Heading>
              <Link
                href={paths.diversityEquityInclusion()}
                title=""
                {...{
                  "data-h2-font-color": "b(lightpurple)",
                }}
              >
                {intl.formatMessage({
                  defaultMessage: "Edit Diversity Equity and Inclusion",
                  description:
                    "Text on link to update a users diversity equity and inclusion information",
                })}
              </Link>
            </div>
            <DiversityEquityInclusionSection
              applicant={profileDataInput}
              editPath={paths.diversityEquityInclusion()}
            />
          </TableOfContents.Section>
          <TableOfContents.Section
            id="skills-section"
            data-h2-padding="b(bottom, xxl)"
          >
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <TableOfContents.Heading
                icon={LightningBoltIcon}
                style={{ flex: "1 1 0%" }}
              >
                {intl.formatMessage({
                  defaultMessage: "My skills and experience",
                  description: "Title of the My skills and experience section",
                })}
              </TableOfContents.Heading>
              <Link
                href={paths.skillsAndExperiences()}
                title=""
                {...{
                  "data-h2-font-color": "b(lightpurple)",
                }}
              >
                {intl.formatMessage({
                  defaultMessage: "Edit Skills and Experience",
                  description:
                    "Text on link to update a users skills and experience",
                })}
              </Link>
            </div>
            {!experiences || experiences?.length === 0 ? (
              <div
                data-h2-bg-color="b(lightgray)"
                data-h2-padding="b(all, m)"
                data-h2-radius="b(s)"
              >
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "You haven't added any information here yet.",
                    description:
                      "Message that the user hasn't filled out the section yet",
                  })}
                </p>
                <p>
                  {intl.formatMessage(
                    {
                      defaultMessage:
                        "There are <redText>required</redText> fields missing.",
                      description:
                        "Message that there are required fields missing. Please ignore things in <> tags.",
                    },
                    {
                      redText,
                    },
                  )}{" "}
                  <a href={paths.skillsAndExperiences()}>
                    {intl.formatMessage({
                      defaultMessage: "Click here to get started.",
                      description:
                        "Message to click on the words to begin something",
                    })}
                  </a>
                </p>
              </div>
            ) : (
              <div data-h2-padding="b(all, m)" data-h2-radius="b(s)">
                <ExperienceSection
                  experiences={experiences?.filter(notEmpty)}
                  experienceEditPaths={experienceEditPaths}
                />
              </div>
            )}
          </TableOfContents.Section>
        </TableOfContents.Content>
      </TableOfContents.Wrapper>
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
