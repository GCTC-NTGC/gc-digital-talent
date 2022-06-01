import React from "react";
import { useIntl } from "react-intl";
import {
  ChatAlt2Icon,
  CurrencyDollarIcon,
  InformationCircleIcon,
  LightningBoltIcon,
  LocationMarkerIcon,
  ThumbUpIcon,
  UserIcon,
} from "@heroicons/react/outline";

import { LibraryIcon } from "@heroicons/react/solid";
import TableOfContents from "../TableOfContents";
import LanguageInformationSection from "./ProfileSections/LanguageInformationSection";
import GovernmentInformationSection from "./ProfileSections/GovernmentInformationSection";
import WorkLocationSection from "./ProfileSections/WorkLocationSection";
import WorkPreferencesSection from "./ProfileSections/WorkPreferencesSection";
import DiversityEquityInclusionSection from "./ProfileSections/DiversityEquityInclusionSection";
import RoleSalarySection from "./ProfileSections/RoleSalarySection";
import ExperienceSection from "./ExperienceSection";

import { notEmpty } from "../../helpers/util";
import { Applicant } from "../../api/generated";
import AboutSection from "./ProfileSections/AboutSection";
import AdminAboutSection from "./ProfileSections/AdminAboutSection";

interface SectionControl {
  isVisible: boolean;
  editUrl?: string;
}

export interface UserProfileProps {
  applicant: Applicant;
  sections: {
    about?: SectionControl;
    adminAbout?: SectionControl;
    employmentEquity?: SectionControl;
    government?: SectionControl;
    hiringPools?: SectionControl;
    language?: SectionControl;
    myStatus?: SectionControl;
    roleSalary?: SectionControl;
    skillsExperience?: SectionControl & {
      applicantPaths?: Record<string, string>;
    };
    workLocation?: SectionControl;
    workPreferences?: SectionControl;
  };
}

const UserProfile: React.FC<UserProfileProps> = ({ applicant, sections }) => {
  const intl = useIntl();
  const { experiences } = applicant;

  type SectionKeys = keyof UserProfileProps["sections"];

  const showSection = (key: SectionKeys): boolean | undefined => {
    return sections[key] && sections[key]?.isVisible;
  };

  return (
    <TableOfContents.Wrapper>
      <TableOfContents.Navigation>
        {showSection("myStatus") && (
          <TableOfContents.AnchorLink id="status-section">
            {intl.formatMessage({
              defaultMessage: "My Status",
              description: "Title of the My Status section",
            })}
          </TableOfContents.AnchorLink>
        )}
        {showSection("hiringPools") && (
          <TableOfContents.AnchorLink id="pools-section">
            {intl.formatMessage({
              defaultMessage: "My Hiring Pools",
              description: "Title of the My Hiring Pools section",
            })}
          </TableOfContents.AnchorLink>
        )}
        {showSection("about") && (
          <TableOfContents.AnchorLink id="about-section">
            {intl.formatMessage({
              defaultMessage: "About",
              description: "Title of the About link section",
            })}
          </TableOfContents.AnchorLink>
        )}
        {showSection("adminAbout") && (
          <TableOfContents.AnchorLink id="admin-about-section">
            {intl.formatMessage({
              defaultMessage: "About",
              description: "Title of the About link section",
            })}
          </TableOfContents.AnchorLink>
        )}
        {showSection("language") && (
          <TableOfContents.AnchorLink id="language-section">
            {intl.formatMessage({
              defaultMessage: "Language Information",
              description: "Title of the Language Information link section",
            })}
          </TableOfContents.AnchorLink>
        )}
        {showSection("government") && (
          <TableOfContents.AnchorLink id="government-section">
            {intl.formatMessage({
              defaultMessage: "Government Information",
              description: "Title of the Government Information link section",
            })}
          </TableOfContents.AnchorLink>
        )}
        {showSection("workLocation") && (
          <TableOfContents.AnchorLink id="work-location-section">
            {intl.formatMessage({
              defaultMessage: "Work Location",
              description: "Title of the Work Location link section",
            })}
          </TableOfContents.AnchorLink>
        )}
        {showSection("workPreferences") && (
          <TableOfContents.AnchorLink id="work-preferences-section">
            {intl.formatMessage({
              defaultMessage: "Work Preferences",
              description: "Title of the Work Preferences link section",
            })}
          </TableOfContents.AnchorLink>
        )}
        {showSection("employmentEquity") && (
          <TableOfContents.AnchorLink id="ee-information-section">
            {intl.formatMessage({
              defaultMessage: "Employment Equity Information",
              description:
                "Title of the Employment Equity Information link section",
            })}
          </TableOfContents.AnchorLink>
        )}
        {showSection("roleSalary") && (
          <TableOfContents.AnchorLink id="role-and-salary-section">
            {intl.formatMessage({
              defaultMessage: "Role and salary expectations",
              description:
                "Title of the Role and salary expectations link section",
            })}
          </TableOfContents.AnchorLink>
        )}
        {showSection("skillsExperience") && (
          <TableOfContents.AnchorLink id="skills-and-experience-section">
            {intl.formatMessage({
              defaultMessage: "My skills and experience",
              description: "Title of the My skills and experience link section",
            })}
          </TableOfContents.AnchorLink>
        )}
      </TableOfContents.Navigation>
      <TableOfContents.Content>
        {showSection("about") && (
          <TableOfContents.Section id="about-section">
            <TableOfContents.Heading icon={UserIcon} style={{ flex: "1 1 0%" }}>
              {intl.formatMessage({
                defaultMessage: "About",
                description: "Title of the about content section",
              })}
            </TableOfContents.Heading>
            <AboutSection
              applicant={applicant}
              editPath={sections.about?.editUrl}
            />
          </TableOfContents.Section>
        )}
        {showSection("adminAbout") && (
          <TableOfContents.Section id="admin-about-section">
            <TableOfContents.Heading icon={UserIcon} style={{ flex: "1 1 0%" }}>
              {intl.formatMessage({
                defaultMessage: "About",
                description: "Title of the about content section",
              })}
            </TableOfContents.Heading>
            <AdminAboutSection applicant={applicant} />
          </TableOfContents.Section>
        )}
        {showSection("language") && (
          <TableOfContents.Section id="language-section">
            <TableOfContents.Heading
              icon={ChatAlt2Icon}
              style={{ flex: "1 1 0%" }}
            >
              {intl.formatMessage({
                defaultMessage: "Language Information",
                description:
                  "Title of the Language Information content section",
              })}
            </TableOfContents.Heading>
            <LanguageInformationSection applicant={applicant} />
          </TableOfContents.Section>
        )}
        {showSection("government") && (
          <TableOfContents.Section id="government-section">
            <TableOfContents.Heading
              icon={LibraryIcon}
              style={{ flex: "1 1 0%" }}
            >
              {intl.formatMessage({
                defaultMessage: "Government Information",
                description:
                  "Title of the Government Information content section",
              })}
            </TableOfContents.Heading>
            <GovernmentInformationSection applicant={applicant} />
          </TableOfContents.Section>
        )}
        {showSection("workLocation") && (
          <TableOfContents.Section id="work-location-section">
            <TableOfContents.Heading
              icon={LocationMarkerIcon}
              style={{ flex: "1 1 0%" }}
            >
              {intl.formatMessage({
                defaultMessage: "Work Location",
                description: "Title of the Work Location content section",
              })}
            </TableOfContents.Heading>
            <WorkLocationSection applicant={applicant} />
          </TableOfContents.Section>
        )}
        {showSection("workPreferences") && (
          <TableOfContents.Section id="work-preferences-section">
            <TableOfContents.Heading
              icon={ThumbUpIcon}
              style={{ flex: "1 1 0%" }}
            >
              {intl.formatMessage({
                defaultMessage: "Work Preferences",
                description: "Title of the Work Preferences content section",
              })}
            </TableOfContents.Heading>
            <WorkPreferencesSection applicant={applicant} />
          </TableOfContents.Section>
        )}
        {showSection("employmentEquity") && (
          <TableOfContents.Section id="ee-information-section">
            <TableOfContents.Heading
              icon={InformationCircleIcon}
              style={{ flex: "1 1 0%" }}
            >
              {intl.formatMessage({
                defaultMessage: "Employment Equity Information",
                description:
                  "Title of the Employment Equity Information content section",
              })}
            </TableOfContents.Heading>
            <DiversityEquityInclusionSection applicant={applicant} />
          </TableOfContents.Section>
        )}
        {showSection("roleSalary") && (
          <TableOfContents.Section id="role-and-salary-section">
            <TableOfContents.Heading
              icon={CurrencyDollarIcon}
              style={{ flex: "1 1 0%" }}
            >
              {intl.formatMessage({
                defaultMessage: "Role and salary expectations",
                description:
                  "Title of the Role and salary expectations section",
              })}
            </TableOfContents.Heading>
            <RoleSalarySection applicant={applicant} />
          </TableOfContents.Section>
        )}
        {showSection("skillsExperience") && (
          <TableOfContents.Section id="skills-and-experience-section">
            <TableOfContents.Heading
              icon={LightningBoltIcon}
              style={{ flex: "1 1 0%" }}
            >
              {intl.formatMessage({
                defaultMessage: "My skills and experience",
                description:
                  "Title of the My skills and experience content section",
              })}
            </TableOfContents.Heading>
            <ExperienceSection experiences={experiences?.filter(notEmpty)} />
          </TableOfContents.Section>
        )}
      </TableOfContents.Content>
    </TableOfContents.Wrapper>
  );
};

export default UserProfile;
