import React from "react";
import { useIntl } from "react-intl";
import ChatBubbleLeftRightIcon from "@heroicons/react/24/outline/ChatBubbleLeftRightIcon";
import CurrencyDollarIcon from "@heroicons/react/24/outline/CurrencyDollarIcon";
import BuildingLibraryIcon from "@heroicons/react/24/outline/BuildingLibraryIcon";
import LightBulbIcon from "@heroicons/react/24/outline/LightBulbIcon";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";
import MapPinIcon from "@heroicons/react/24/outline/MapPinIcon";
import HandThumbUpIcon from "@heroicons/react/24/outline/HandThumbUpIcon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import UserCircleIcon from "@heroicons/react/24/solid/UserCircleIcon";

import { notEmpty } from "@gc-digital-talent/helpers";
import { TableOfContents, HeadingRank, Link } from "@gc-digital-talent/ui";
import { useFeatureFlags } from "@gc-digital-talent/env";

import type { Applicant } from "~/api/generated";

import {
  aboutSectionHasEmptyRequiredFields,
  aboutSectionHasEmptyOptionalFields,
  diversityEquityInclusionSectionHasEmptyRequiredFields,
  diversityEquityInclusionSectionHasEmptyOptionalFields,
  governmentInformationSectionHasEmptyRequiredFields,
  governmentInformationSectionHasEmptyOptionalFields,
  languageInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasEmptyOptionalFields,
  roleSalarySectionHasEmptyRequiredFields,
  roleSalarySectionHasEmptyOptionalFields,
  workLocationSectionHasEmptyRequiredFields,
  workLocationSectionHasEmptyOptionalFields,
  workPreferencesSectionHasEmptyRequiredFields,
  workPreferencesSectionHasEmptyOptionalFields,
} from "~/validators/profile";

import { navigationMessages } from "@gc-digital-talent/i18n";
import ExperienceSection from "./ExperienceSection";
import { StatusItem } from "../InfoItem";
import { Status } from "../InfoItem/StatusItem";
import AboutSection from "./ProfileSections/AboutSection";
import DiversityEquityInclusionSection from "./ProfileSections/DiversityEquityInclusionSection";
import GovernmentInformationSection from "./ProfileSections/GovernmentInformationSection";
import LanguageInformationSection from "./ProfileSections/LanguageInformationSection";
import RoleSalarySection from "./ProfileSections/RoleSalarySection";
import WorkLocationSection from "./ProfileSections/WorkLocationSection";
import WorkPreferencesSection from "./ProfileSections/WorkPreferencesSection";

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
  isNavigationVisible?: boolean;
  subTitle?: React.ReactNode;
  headingLevel?: HeadingRank;
}

const HeadingWrapper = ({
  children,
  show,
}: {
  children?: React.ReactNode;
  show: boolean;
}) => {
  if (!show && children) {
    return (
      <div data-h2-padding="base(x1, 0, x1, 0)">
        <div data-h2-flex-grid="base(center, x2, x1)">{children}</div>
      </div>
    );
  }

  return (
    <div data-h2-padding="base(x2, 0, x1, 0)">
      <div data-h2-flex-grid="base(center, x2, x1)">{children}</div>
    </div>
  );
};

const EditUrlLink = ({ link, text }: { link: string; text: string }) => (
  <div
    data-h2-flex-item="base(1of1) p-tablet(content)"
    data-h2-text-align="base(center) p-tablet(right)"
  >
    <Link
      href={link}
      mode="inline"
      data-h2-margin="p-tablet(x1.5, 0, x.25, 0)"
      data-h2-display="base(block)"
    >
      {text}
    </Link>
  </div>
);

const Container = ({
  children,
  show,
}: {
  children: React.ReactNode;
  show: boolean;
}) => {
  if (!show) {
    // Note: We need a fragment to satisfy types
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  return (
    <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
      <TableOfContents.Wrapper>{children}</TableOfContents.Wrapper>
    </div>
  );
};

const UserProfile = ({
  applicant,
  sections,
  subTitle,
  headingLevel = "h2",
  isNavigationVisible = true,
}: UserProfileProps) => {
  const intl = useIntl();
  const { experiences } = applicant;
  const featureFlags = useFeatureFlags();

  type SectionKeys = keyof UserProfileProps["sections"];

  const showSection = (key: SectionKeys): boolean | undefined => {
    return sections[key] && sections[key]?.isVisible;
  };

  const sectionStatus = (
    hasEmptyRequiredFields: (applicant: Applicant) => boolean,
    hasEmptyOptionalFields: (applicant: Applicant) => boolean,
  ): Status | undefined => {
    if (!featureFlags.applicantDashboard) return undefined;
    if (hasEmptyRequiredFields(applicant)) return "error";
    if (hasEmptyOptionalFields(applicant)) return "partial";
    return "success";
  };

  return (
    <Container show={isNavigationVisible}>
      {isNavigationVisible && (
        <TableOfContents.Navigation>
          {showSection("myStatus") && (
            <TableOfContents.AnchorLink id="status-section">
              {intl.formatMessage(navigationMessages.myStatus)}
            </TableOfContents.AnchorLink>
          )}
          {showSection("about") && (
            <TableOfContents.AnchorLink id="about-section">
              <StatusItem
                asListItem={false}
                title={intl.formatMessage(navigationMessages.aboutMe)}
                status={sectionStatus(
                  aboutSectionHasEmptyRequiredFields,
                  aboutSectionHasEmptyOptionalFields,
                )}
              />
            </TableOfContents.AnchorLink>
          )}
          {showSection("employmentEquity") && (
            <TableOfContents.AnchorLink id="diversity-equity-inclusion-section">
              <StatusItem
                asListItem={false}
                title={intl.formatMessage(
                  navigationMessages.diversityEquityInclusion,
                )}
                status={sectionStatus(
                  diversityEquityInclusionSectionHasEmptyRequiredFields,
                  diversityEquityInclusionSectionHasEmptyOptionalFields,
                )}
              />
            </TableOfContents.AnchorLink>
          )}
          {showSection("language") && (
            <TableOfContents.AnchorLink id="language-section">
              <StatusItem
                asListItem={false}
                title={intl.formatMessage(
                  navigationMessages.languageInformation,
                )}
                status={sectionStatus(
                  languageInformationSectionHasEmptyRequiredFields,
                  languageInformationSectionHasEmptyOptionalFields,
                )}
              />
            </TableOfContents.AnchorLink>
          )}
          {showSection("government") && (
            <TableOfContents.AnchorLink id="government-section">
              <StatusItem
                asListItem={false}
                title={intl.formatMessage(
                  navigationMessages.governmentInformation,
                )}
                status={sectionStatus(
                  governmentInformationSectionHasEmptyRequiredFields,
                  governmentInformationSectionHasEmptyOptionalFields,
                )}
              />
            </TableOfContents.AnchorLink>
          )}
          {showSection("workLocation") && (
            <TableOfContents.AnchorLink id="work-location-section">
              <StatusItem
                asListItem={false}
                title={intl.formatMessage(navigationMessages.workLocation)}
                status={sectionStatus(
                  workLocationSectionHasEmptyRequiredFields,
                  workLocationSectionHasEmptyOptionalFields,
                )}
              />
            </TableOfContents.AnchorLink>
          )}
          {showSection("workPreferences") && (
            <TableOfContents.AnchorLink id="work-preferences-section">
              <StatusItem
                asListItem={false}
                title={intl.formatMessage(navigationMessages.workPreferences)}
                status={sectionStatus(
                  workPreferencesSectionHasEmptyRequiredFields,
                  workPreferencesSectionHasEmptyOptionalFields,
                )}
              />
            </TableOfContents.AnchorLink>
          )}
          {showSection("roleSalary") && (
            <TableOfContents.AnchorLink id="role-and-salary-section">
              <StatusItem
                asListItem={false}
                title={intl.formatMessage(
                  navigationMessages.roleSalaryExpectations,
                )}
                status={sectionStatus(
                  roleSalarySectionHasEmptyRequiredFields,
                  roleSalarySectionHasEmptyOptionalFields,
                )}
              />
            </TableOfContents.AnchorLink>
          )}
          {showSection("skillsExperience") && (
            <TableOfContents.AnchorLink id="skills-and-experience-section">
              {intl.formatMessage(navigationMessages.mySkillsExperience)}
            </TableOfContents.AnchorLink>
          )}
        </TableOfContents.Navigation>
      )}
      <TableOfContents.Content>
        {subTitle}
        {showSection("myStatus") && (
          <TableOfContents.Section id="status-section">
            <HeadingWrapper show={!!sections.myStatus?.editUrl}>
              <div
                data-h2-flex-item="base(1of1) p-tablet(fill)"
                data-h2-text-align="base(center) p-tablet(left)"
              >
                <TableOfContents.Heading as={headingLevel} icon={LightBulbIcon}>
                  {intl.formatMessage(navigationMessages.myStatus)}
                </TableOfContents.Heading>
              </div>
              {sections.myStatus?.editUrl && (
                <EditUrlLink
                  link={sections.myStatus.editUrl}
                  text={intl.formatMessage(
                    {
                      defaultMessage: "Edit {title}",
                      id: "3R3jKp",
                      description: "Link to edit object",
                    },
                    {
                      title: intl.formatMessage(navigationMessages.myStatus),
                    },
                  )}
                />
              )}
            </HeadingWrapper>
            {sections.myStatus?.override ? sections.myStatus.override : null}
          </TableOfContents.Section>
        )}
        {showSection("about") && (
          <TableOfContents.Section id="about-section">
            <HeadingWrapper show={!!sections.about?.editUrl}>
              <div
                data-h2-flex-item="base(1of1) p-tablet(fill)"
                data-h2-text-align="base(center) p-tablet(left)"
              >
                <TableOfContents.Heading as={headingLevel} icon={UserIcon}>
                  {intl.formatMessage(navigationMessages.aboutMe)}
                </TableOfContents.Heading>
              </div>
              {sections.about?.editUrl && (
                <EditUrlLink
                  link={sections.about.editUrl}
                  text={intl.formatMessage(
                    {
                      defaultMessage: "Edit {title}",
                      id: "3R3jKp",
                      description: "Link to edit object",
                    },
                    {
                      title: intl.formatMessage(navigationMessages.aboutMe),
                    },
                  )}
                />
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
        {showSection("employmentEquity") && (
          <TableOfContents.Section id="diversity-equity-inclusion-section">
            <HeadingWrapper show={!!sections.employmentEquity?.editUrl}>
              <div
                data-h2-flex-item="base(1of1) p-tablet(fill)"
                data-h2-text-align="base(center) p-tablet(left)"
              >
                <TableOfContents.Heading
                  as={headingLevel}
                  icon={UserCircleIcon}
                >
                  {intl.formatMessage(
                    navigationMessages.diversityEquityInclusion,
                  )}
                </TableOfContents.Heading>
              </div>
              {sections.employmentEquity?.editUrl && (
                <EditUrlLink
                  link={sections.employmentEquity.editUrl}
                  text={intl.formatMessage(
                    {
                      defaultMessage: "Edit {title}",
                      id: "3R3jKp",
                      description: "Link to edit object",
                    },
                    {
                      title: intl.formatMessage(
                        navigationMessages.diversityEquityInclusion,
                      ),
                    },
                  )}
                />
              )}
            </HeadingWrapper>
            {sections.employmentEquity?.override ? (
              sections.employmentEquity.override
            ) : (
              <DiversityEquityInclusionSection
                applicant={applicant}
                editPath={sections.employmentEquity?.editUrl}
              />
            )}
          </TableOfContents.Section>
        )}
        {showSection("language") && (
          <TableOfContents.Section id="language-section">
            <HeadingWrapper show={!!sections.language?.editUrl}>
              <div
                data-h2-flex-item="base(1of1) p-tablet(fill)"
                data-h2-text-align="base(center) p-tablet(left)"
              >
                <TableOfContents.Heading
                  as={headingLevel}
                  icon={ChatBubbleLeftRightIcon}
                >
                  {intl.formatMessage(navigationMessages.languageInformation)}
                </TableOfContents.Heading>
              </div>
              {sections.language?.editUrl && (
                <EditUrlLink
                  link={sections.language.editUrl}
                  text={intl.formatMessage(
                    {
                      defaultMessage: "Edit {title}",
                      id: "3R3jKp",
                      description: "Link to edit object",
                    },
                    {
                      title: intl.formatMessage(
                        navigationMessages.languageInformation,
                      ),
                    },
                  )}
                />
              )}
            </HeadingWrapper>
            {sections.language?.override ? (
              sections.language.override
            ) : (
              <LanguageInformationSection
                applicant={applicant}
                editPath={sections.language?.editUrl}
              />
            )}
          </TableOfContents.Section>
        )}
        {showSection("government") && (
          <TableOfContents.Section id="government-section">
            <HeadingWrapper show={!!sections.government?.editUrl}>
              <div
                data-h2-flex-item="base(1of1) p-tablet(fill)"
                data-h2-text-align="base(center) p-tablet(left)"
              >
                <TableOfContents.Heading
                  as={headingLevel}
                  icon={BuildingLibraryIcon}
                >
                  {intl.formatMessage(navigationMessages.governmentInformation)}
                </TableOfContents.Heading>
              </div>
              {sections.government?.editUrl && (
                <EditUrlLink
                  link={sections.government.editUrl}
                  text={intl.formatMessage(
                    {
                      defaultMessage: "Edit {title}",
                      id: "3R3jKp",
                      description: "Link to edit object",
                    },
                    {
                      title: intl.formatMessage(
                        navigationMessages.governmentInformation,
                      ),
                    },
                  )}
                />
              )}
            </HeadingWrapper>
            {sections.government?.override ? (
              sections.government.override
            ) : (
              <GovernmentInformationSection
                applicant={applicant}
                editPath={sections.government?.editUrl}
              />
            )}
          </TableOfContents.Section>
        )}
        {showSection("workLocation") && (
          <TableOfContents.Section id="work-location-section">
            <HeadingWrapper show={!!sections.workLocation?.editUrl}>
              <div
                data-h2-flex-item="base(1of1) p-tablet(fill)"
                data-h2-text-align="base(center) p-tablet(left)"
              >
                <TableOfContents.Heading as={headingLevel} icon={MapPinIcon}>
                  {intl.formatMessage(navigationMessages.workLocation)}
                </TableOfContents.Heading>
              </div>
              {sections.workLocation?.editUrl && (
                <EditUrlLink
                  link={sections.workLocation.editUrl}
                  text={intl.formatMessage(
                    {
                      defaultMessage: "Edit {title}",
                      id: "3R3jKp",
                      description: "Link to edit object",
                    },
                    {
                      title: intl.formatMessage(
                        navigationMessages.workLocation,
                      ),
                    },
                  )}
                />
              )}
            </HeadingWrapper>
            {sections.workLocation?.override ? (
              sections.workLocation.override
            ) : (
              <WorkLocationSection
                applicant={applicant}
                editPath={sections.workLocation?.editUrl}
              />
            )}
          </TableOfContents.Section>
        )}
        {showSection("workPreferences") && (
          <TableOfContents.Section id="work-preferences-section">
            <HeadingWrapper show={!!sections.workPreferences?.editUrl}>
              <div
                data-h2-flex-item="base(1of1) p-tablet(fill)"
                data-h2-text-align="base(center) p-tablet(left)"
              >
                <TableOfContents.Heading
                  as={headingLevel}
                  icon={HandThumbUpIcon}
                >
                  {intl.formatMessage(navigationMessages.workPreferences)}
                </TableOfContents.Heading>
              </div>
              {sections.workPreferences?.editUrl && (
                <EditUrlLink
                  link={sections.workPreferences.editUrl}
                  text={intl.formatMessage(
                    {
                      defaultMessage: "Edit {title}",
                      id: "3R3jKp",
                      description: "Link to edit object",
                    },
                    {
                      title: intl.formatMessage(
                        navigationMessages.workPreferences,
                      ),
                    },
                  )}
                />
              )}
            </HeadingWrapper>
            {sections.workPreferences?.override ? (
              sections.workPreferences.override
            ) : (
              <WorkPreferencesSection
                applicant={applicant}
                editPath={sections.workPreferences?.editUrl}
              />
            )}
          </TableOfContents.Section>
        )}
        {showSection("roleSalary") && (
          <TableOfContents.Section id="role-and-salary-section">
            <HeadingWrapper show={!!sections.roleSalary?.editUrl}>
              <div
                data-h2-flex-item="base(1of1) p-tablet(fill)"
                data-h2-text-align="base(center) p-tablet(left)"
              >
                <TableOfContents.Heading
                  as={headingLevel}
                  icon={CurrencyDollarIcon}
                >
                  {intl.formatMessage(
                    navigationMessages.roleSalaryExpectations,
                  )}
                </TableOfContents.Heading>
              </div>
              {sections.roleSalary?.editUrl && (
                <EditUrlLink
                  link={sections.roleSalary.editUrl}
                  text={intl.formatMessage(
                    {
                      defaultMessage: "Edit {title}",
                      id: "3R3jKp",
                      description: "Link to edit object",
                    },
                    {
                      title: intl.formatMessage(
                        navigationMessages.roleSalaryExpectations,
                      ),
                    },
                  )}
                />
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
              <div
                data-h2-flex-item="base(1of1) p-tablet(fill)"
                data-h2-text-align="base(center) p-tablet(left)"
              >
                <TableOfContents.Heading as={headingLevel} icon={BoltIcon}>
                  {intl.formatMessage(navigationMessages.mySkillsExperience)}
                </TableOfContents.Heading>
              </div>
              {sections.skillsExperience?.editUrl && (
                <EditUrlLink
                  link={sections.skillsExperience.editUrl}
                  text={intl.formatMessage(
                    {
                      defaultMessage: "Edit {title}",
                      id: "3R3jKp",
                      description: "Link to edit object",
                    },
                    {
                      title: intl.formatMessage(
                        navigationMessages.mySkillsExperience,
                      ),
                    },
                  )}
                />
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
    </Container>
  );
};

export default UserProfile;
