import React from "react";
import { useIntl } from "react-intl";
import {
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  BuildingLibraryIcon,
  LightBulbIcon,
  BoltIcon,
  MapPinIcon,
  HandThumbUpIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";

import { notEmpty } from "@gc-digital-talent/helpers";
import { TableOfContents, HeadingRank, Link } from "@gc-digital-talent/ui";
import { useFeatureFlags } from "@gc-digital-talent/env";

import type { Applicant } from "~/api/generated";

import AboutSection, {
  hasEmptyRequiredFields as aboutSectionHasEmptyRequiredFields,
  hasEmptyOptionalFields as aboutSectionHasEmptyOptionalFields,
} from "~/components/UserProfile/ProfileSections/AboutSection";
import LanguageInformationSection, {
  hasEmptyRequiredFields as languageInformationSectionHasEmptyRequiredFields,
  hasEmptyOptionalFields as languageInformationSectionHasEmptyOptionalFields,
} from "~/components/UserProfile/ProfileSections/LanguageInformationSection";
import GovernmentInformationSection, {
  hasEmptyRequiredFields as governmentInformationSectionHasEmptyRequiredFields,
  hasEmptyOptionalFields as governmentInformationSectionHasEmptyOptionalFields,
} from "~/components/UserProfile/ProfileSections/GovernmentInformationSection";
import WorkLocationSection, {
  hasEmptyRequiredFields as workLocationSectionHasEmptyRequiredFields,
  hasEmptyOptionalFields as workLocationSectionHasEmptyOptionalFields,
} from "~/components/UserProfile/ProfileSections/WorkLocationSection";
import WorkPreferencesSection, {
  hasEmptyRequiredFields as workPreferencesSectionHasEmptyRequiredFields,
  hasEmptyOptionalFields as workPreferencesSectionHasEmptyOptionalFields,
} from "~/components/UserProfile/ProfileSections/WorkPreferencesSection";
import DiversityEquityInclusionSection, {
  hasEmptyRequiredFields as diversityEquityInclusionSectionHasEmptyRequiredFields,
  hasEmptyOptionalFields as diversityEquityInclusionSectionHasEmptyOptionalFields,
} from "~/components/UserProfile/ProfileSections/DiversityEquityInclusionSection";
import RoleSalarySection, {
  hasEmptyRequiredFields as roleSalarySectionHasEmptyRequiredFields,
  hasEmptyOptionalFields as roleSalarySectionHasEmptyOptionalFields,
} from "~/components/UserProfile/ProfileSections/RoleSalarySection";

import ExperienceSection from "./ExperienceSection";
import { StatusItem } from "../InfoItem";
import { Status } from "../InfoItem/StatusItem";

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
      type="button"
      color="secondary"
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
              {intl.formatMessage({
                defaultMessage: "My Status",
                id: "TLgbZm",
                description: "Title of the My Status section",
              })}
            </TableOfContents.AnchorLink>
          )}
          {showSection("about") && (
            <TableOfContents.AnchorLink id="about-section">
              <StatusItem
                title={intl.formatMessage({
                  defaultMessage: "About Me",
                  id: "4sJvia",
                  description: "Title of the About link section",
                })}
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
                title={intl.formatMessage({
                  defaultMessage: "Diversity, equity and inclusion",
                  id: "e2R6fy",
                  description:
                    "Title of the Diversity, equity and inclusion link section",
                })}
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
                title={intl.formatMessage({
                  defaultMessage: "Language Information",
                  id: "B9x0ZV",
                  description: "Title of the Language Information link section",
                })}
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
                title={intl.formatMessage({
                  defaultMessage: "Government Information",
                  id: "Nc4sjC",
                  description:
                    "Title of the Government Information link section",
                })}
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
                title={intl.formatMessage({
                  defaultMessage: "Work Location",
                  id: "9WxeNz",
                  description: "Title of the Work Location link section",
                })}
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
                title={intl.formatMessage({
                  defaultMessage: "Work Preferences",
                  id: "0DzlCc",
                  description: "Title of the Work Preferences link section",
                })}
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
                title={intl.formatMessage({
                  defaultMessage: "Role and salary expectations",
                  id: "95OYVk",
                  description:
                    "Title of the Role and salary expectations link section",
                })}
                status={sectionStatus(
                  roleSalarySectionHasEmptyRequiredFields,
                  roleSalarySectionHasEmptyOptionalFields,
                )}
              />
            </TableOfContents.AnchorLink>
          )}
          {showSection("skillsExperience") && (
            <TableOfContents.AnchorLink id="skills-and-experience-section">
              {intl.formatMessage({
                defaultMessage: "My skills and experience",
                id: "fqIEKE",
                description:
                  "Title of the My skills and experience link section",
              })}
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
                  {intl.formatMessage({
                    defaultMessage: "My Status",
                    id: "Cx3s+E",
                    description: "Title of the my status content section",
                  })}
                </TableOfContents.Heading>
              </div>
              {sections.myStatus?.editUrl && (
                <EditUrlLink
                  link={sections.myStatus.editUrl}
                  text={intl.formatMessage({
                    defaultMessage: "Edit My Status",
                    id: "om3i0o",
                    description: "Text on link to update a users status.",
                  })}
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
                  {intl.formatMessage({
                    defaultMessage: "About Me",
                    id: "CnB8IO",
                    description: "Title of the about content section",
                  })}
                </TableOfContents.Heading>
              </div>
              {sections.about?.editUrl && (
                <EditUrlLink
                  link={sections.about.editUrl}
                  text={intl.formatMessage({
                    defaultMessage: "Edit About Me",
                    id: "/+CmAn",
                    description:
                      "Text on link to update a users personal information.",
                  })}
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
                  {intl.formatMessage({
                    defaultMessage: "Diversity, equity and inclusion",
                    id: "inzzdo",
                    description:
                      "Title of the Diversity, equity and inclusion content section",
                  })}
                </TableOfContents.Heading>
              </div>
              {sections.employmentEquity?.editUrl && (
                <EditUrlLink
                  link={sections.employmentEquity.editUrl}
                  text={intl.formatMessage({
                    defaultMessage: "Edit Diversity, Equity and Inclusion",
                    id: "AF8g2I",
                    description:
                      "Text on link to update a users employment equity.",
                  })}
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
                  {intl.formatMessage({
                    defaultMessage: "Language Information",
                    id: "1pk/7X",
                    description:
                      "Title of the Language Information content section",
                  })}
                </TableOfContents.Heading>
              </div>
              {sections.language?.editUrl && (
                <EditUrlLink
                  link={sections.language.editUrl}
                  text={intl.formatMessage({
                    defaultMessage: "Edit Language Information",
                    id: "Vbw1ES",
                    description:
                      "Text on link to update a users language information.",
                  })}
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
                  {intl.formatMessage({
                    defaultMessage: "Government Information",
                    id: "l1cou8",
                    description:
                      "Title of the Government Information content section",
                  })}
                </TableOfContents.Heading>
              </div>
              {sections.government?.editUrl && (
                <EditUrlLink
                  link={sections.government.editUrl}
                  text={intl.formatMessage({
                    defaultMessage: "Edit Government Information",
                    id: "5APACq",
                    description:
                      "Text on link to update a users government information.",
                  })}
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
                  {intl.formatMessage({
                    defaultMessage: "Work Location",
                    id: "F9R74z",
                    description: "Title of the Work Location content section",
                  })}
                </TableOfContents.Heading>
              </div>
              {sections.workLocation?.editUrl && (
                <EditUrlLink
                  link={sections.workLocation.editUrl}
                  text={intl.formatMessage({
                    defaultMessage: "Edit Work Location",
                    id: "FF0ubO",
                    description:
                      "Text on link to update a users work location.",
                  })}
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
                  {intl.formatMessage({
                    defaultMessage: "Work Preferences",
                    id: "V89Ryn",
                    description:
                      "Title of the Work Preferences content section",
                  })}
                </TableOfContents.Heading>
              </div>
              {sections.workPreferences?.editUrl && (
                <EditUrlLink
                  link={sections.workPreferences.editUrl}
                  text={intl.formatMessage({
                    defaultMessage: "Edit Work Preferences",
                    id: "p8Gi1k",
                    description:
                      "Text on link to update a users work preferences.",
                  })}
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
                  {intl.formatMessage({
                    defaultMessage: "Role and salary expectations",
                    id: "uMzeiF",
                    description:
                      "Title of the Role and salary expectations section",
                  })}
                </TableOfContents.Heading>
              </div>
              {sections.roleSalary?.editUrl && (
                <EditUrlLink
                  link={sections.roleSalary.editUrl}
                  text={intl.formatMessage({
                    defaultMessage: "Edit Role and Salary",
                    id: "CEzDTC",
                    description:
                      "Text on link to update a users role and salary expectations.",
                  })}
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
                  {intl.formatMessage({
                    defaultMessage: "My skills and experience",
                    id: "Eui2Wf",
                    description:
                      "Title of the My skills and experience content section",
                  })}
                </TableOfContents.Heading>
              </div>
              {sections.skillsExperience?.editUrl && (
                <EditUrlLink
                  link={sections.skillsExperience.editUrl}
                  text={intl.formatMessage({
                    defaultMessage: "Edit Skills and Experience",
                    id: "XqFhIa",
                    description:
                      "Text on link to update a users skills and experiences.",
                  })}
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
