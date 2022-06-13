import React from "react";
import { useIntl } from "react-intl";
import {
  ChatAlt2Icon,
  CurrencyDollarIcon,
  LibraryIcon,
  LightBulbIcon,
  LightningBoltIcon,
  LocationMarkerIcon,
  ThumbUpIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/outline";

import { UserCircleIcon } from "@heroicons/react/solid";

import TableOfContents from "../TableOfContents";
import AboutSection from "./ProfileSections/AboutSection";
import LanguageInformationSection from "./ProfileSections/LanguageInformationSection";
import GovernmentInformationSection from "./ProfileSections/GovernmentInformationSection";
import WorkLocationSection from "./ProfileSections/WorkLocationSection";
import WorkPreferencesSection from "./ProfileSections/WorkPreferencesSection";
import DiversityEquityInclusionSection from "./ProfileSections/DiversityEquityInclusionSection";
import RoleSalarySection from "./ProfileSections/RoleSalarySection";
import ExperienceSection from "./ExperienceSection";

import { notEmpty } from "../../helpers/util";
import type { Applicant } from "../../api/generated";
import CandidatePoolsSection from "./ProfileSections/CandidatePoolsSection";
import Link from "../Link";

interface SectionControl {
  isVisible: boolean;
  editUrl?: string;
  override?: React.ReactNode;
}

export interface UserProfileProps {
  applicant: Applicant;
  sections: {
    about?: SectionControl;
    employmentEquity?: SectionControl;
    government?: SectionControl;
    hiringPools?: SectionControl;
    language?: SectionControl;
    myStatus?: SectionControl;
    roleSalary?: SectionControl;
    skillsExperience?: SectionControl;
    workLocation?: SectionControl;
    workPreferences?: SectionControl;
  };
}

const HeadingWrapper: React.FC<{ show: boolean }> = ({ children, show }) => {
  if (!show && children) {
    return <div>{children}</div>;
  }

  return (
    <div style={{ display: "flex", alignItems: "baseline" }}>{children}</div>
  );
};

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
          <TableOfContents.AnchorLink id="diversity-equity-inclusion-section">
            {intl.formatMessage({
              defaultMessage: "Diversity, equity and inclusion",
              description:
                "Title of the Diversity, equity and inclusion link section",
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
        {showSection("myStatus") && (
          <TableOfContents.Section id="status-section">
            <HeadingWrapper show={!!sections.myStatus?.editUrl}>
              <TableOfContents.Heading
                icon={LightBulbIcon}
                style={{ flex: "1 1 0%" }}
              >
                {intl.formatMessage({
                  defaultMessage: "My Status",
                  description: "Title of the my status content section",
                })}
              </TableOfContents.Heading>
              {sections.myStatus?.editUrl && (
                <Link
                  href={sections.myStatus.editUrl}
                  data-h2-font-color="b(lightpurple)"
                >
                  {intl.formatMessage({
                    defaultMessage: "Edit My Status",
                    description: "Text on link to update a users status.",
                  })}
                </Link>
              )}
            </HeadingWrapper>
            {sections.myStatus?.override ? sections.myStatus.override : null}
          </TableOfContents.Section>
        )}
        {showSection("hiringPools") && (
          <TableOfContents.Section id="pools-section">
            <HeadingWrapper show={!!sections.hiringPools?.editUrl}>
              <TableOfContents.Heading
                icon={UserGroupIcon}
                style={{ flex: "1 1 0%" }}
              >
                {intl.formatMessage({
                  defaultMessage: "My hiring pools",
                  description: "Title of the my hiring pools content section",
                })}
              </TableOfContents.Heading>
              {sections.hiringPools?.editUrl && (
                <Link
                  href={sections.hiringPools.editUrl}
                  data-h2-font-color="b(lightpurple)"
                >
                  {intl.formatMessage({
                    defaultMessage: "Edit My Hiring Pools",
                    description: "Text on link to update a users hiring pools.",
                  })}
                </Link>
              )}
            </HeadingWrapper>
            {sections.hiringPools?.override ? (
              sections.hiringPools.override
            ) : (
              <CandidatePoolsSection applicant={applicant} />
            )}
          </TableOfContents.Section>
        )}
        {showSection("about") && (
          <TableOfContents.Section id="about-section">
            <HeadingWrapper show={!!sections.about?.editUrl}>
              <TableOfContents.Heading
                icon={UserIcon}
                style={{ flex: "1 1 0%" }}
              >
                {intl.formatMessage({
                  defaultMessage: "About",
                  description: "Title of the about content section",
                })}
              </TableOfContents.Heading>
              {sections.about?.editUrl && (
                <Link
                  href={sections.about.editUrl}
                  data-h2-font-color="b(lightpurple)"
                >
                  {intl.formatMessage({
                    defaultMessage: "Edit About Me",
                    description:
                      "Text on link to update a users personal information.",
                  })}
                </Link>
              )}
            </HeadingWrapper>
            {sections.about?.override ? (
              sections.about.override
            ) : (
              <AboutSection
                applicant={applicant}
                editPath={sections.about?.editUrl}
              />
            )}
          </TableOfContents.Section>
        )}
        {showSection("language") && (
          <TableOfContents.Section id="language-section">
            <HeadingWrapper show={!!sections.language?.editUrl}>
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
              {sections.language?.editUrl && (
                <Link
                  href={sections.language.editUrl}
                  data-h2-font-color="b(lightpurple)"
                >
                  {intl.formatMessage({
                    defaultMessage: "Edit Language Information",
                    description:
                      "Text on link to update a users language information.",
                  })}
                </Link>
              )}
            </HeadingWrapper>
            {sections.language?.override ? (
              sections.language.override
            ) : (
              <LanguageInformationSection applicant={applicant} />
            )}
          </TableOfContents.Section>
        )}
        {showSection("government") && (
          <TableOfContents.Section id="government-section">
            <HeadingWrapper show={!!sections.government?.editUrl}>
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
              {sections.government?.editUrl && (
                <Link
                  href={sections.government.editUrl}
                  data-h2-font-color="b(lightpurple)"
                >
                  {intl.formatMessage({
                    defaultMessage: "Edit Government Information",
                    description:
                      "Text on link to update a users government information.",
                  })}
                </Link>
              )}
            </HeadingWrapper>
            {sections.government?.override ? (
              sections.government.override
            ) : (
              <GovernmentInformationSection applicant={applicant} />
            )}
          </TableOfContents.Section>
        )}
        {showSection("workLocation") && (
          <TableOfContents.Section id="work-location-section">
            <HeadingWrapper show={!!sections.workLocation?.editUrl}>
              <TableOfContents.Heading
                icon={LocationMarkerIcon}
                style={{ flex: "1 1 0%" }}
              >
                {intl.formatMessage({
                  defaultMessage: "Work Location",
                  description: "Title of the Work Location content section",
                })}
              </TableOfContents.Heading>
              {sections.workLocation?.editUrl && (
                <Link
                  href={sections.workLocation.editUrl}
                  data-h2-font-color="b(lightpurple)"
                >
                  {intl.formatMessage({
                    defaultMessage: "Edit Work Location",
                    description:
                      "Text on link to update a users work location.",
                  })}
                </Link>
              )}
            </HeadingWrapper>
            {sections.workLocation?.override ? (
              sections.workLocation.override
            ) : (
              <WorkLocationSection applicant={applicant} />
            )}
          </TableOfContents.Section>
        )}
        {showSection("workPreferences") && (
          <TableOfContents.Section id="work-preferences-section">
            <HeadingWrapper show={!!sections.workPreferences?.editUrl}>
              <TableOfContents.Heading
                icon={ThumbUpIcon}
                style={{ flex: "1 1 0%" }}
              >
                {intl.formatMessage({
                  defaultMessage: "Work Preferences",
                  description: "Title of the Work Preferences content section",
                })}
              </TableOfContents.Heading>
              {sections.workPreferences?.editUrl && (
                <Link
                  href={sections.workPreferences.editUrl}
                  data-h2-font-color="b(lightpurple)"
                >
                  {intl.formatMessage({
                    defaultMessage: "Edit Work Preferences",
                    description:
                      "Text on link to update a users work preferences.",
                  })}
                </Link>
              )}
            </HeadingWrapper>
            {sections.workPreferences?.override ? (
              sections.workPreferences.override
            ) : (
              <WorkPreferencesSection applicant={applicant} />
            )}
          </TableOfContents.Section>
        )}
        {showSection("employmentEquity") && (
          <TableOfContents.Section id="diversity-equity-inclusion-section">
            <HeadingWrapper show={!!sections.employmentEquity?.editUrl}>
              <TableOfContents.Heading
                icon={UserCircleIcon}
                style={{ flex: "1 1 0%" }}
              >
                {intl.formatMessage({
                  defaultMessage: "Diversity, equity and inclusion",
                  description:
                    "Title of the Diversity, equity and inclusion content section",
                })}
              </TableOfContents.Heading>
              {sections.employmentEquity?.editUrl && (
                <Link
                  href={sections.employmentEquity.editUrl}
                  data-h2-font-color="b(lightpurple)"
                >
                  {intl.formatMessage({
                    defaultMessage: "Edit Diversity, Equity and Inclusion",
                    description:
                      "Text on link to update a users employment equity.",
                  })}
                </Link>
              )}
            </HeadingWrapper>
            {sections.employmentEquity?.override ? (
              sections.employmentEquity.override
            ) : (
              <DiversityEquityInclusionSection applicant={applicant} />
            )}
          </TableOfContents.Section>
        )}
        {showSection("roleSalary") && (
          <TableOfContents.Section id="role-and-salary-section">
            <HeadingWrapper show={!!sections.roleSalary?.editUrl}>
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
              {sections.roleSalary?.editUrl && (
                <Link
                  href={sections.roleSalary.editUrl}
                  data-h2-font-color="b(lightpurple)"
                >
                  {intl.formatMessage({
                    defaultMessage: "Edit Role and Salary",
                    description:
                      "Text on link to update a users role and salary expectations.",
                  })}
                </Link>
              )}
            </HeadingWrapper>
            {sections.roleSalary?.override ? (
              sections.roleSalary.override
            ) : (
              <RoleSalarySection
                applicant={applicant}
                editPath={sections.roleSalary?.editUrl}
              />
            )}
          </TableOfContents.Section>
        )}
        {showSection("skillsExperience") && (
          <TableOfContents.Section id="skills-and-experience-section">
            <HeadingWrapper show={!!sections.skillsExperience?.editUrl}>
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
              {sections.skillsExperience?.editUrl && (
                <Link
                  href={sections.skillsExperience.editUrl}
                  data-h2-font-color="b(lightpurple)"
                >
                  {intl.formatMessage({
                    defaultMessage: "Edit Skills and Experience",
                    description:
                      "Text on link to update a users skills and experiences.",
                  })}
                </Link>
              )}
            </HeadingWrapper>
            {sections.skillsExperience?.override ? (
              sections.skillsExperience.override
            ) : (
              <ExperienceSection experiences={experiences?.filter(notEmpty)} />
            )}
          </TableOfContents.Section>
        )}
      </TableOfContents.Content>
    </TableOfContents.Wrapper>
  );
};

export default UserProfile;
