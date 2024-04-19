import React from "react";
import { useIntl } from "react-intl";
import ChatBubbleLeftRightIcon from "@heroicons/react/24/outline/ChatBubbleLeftRightIcon";
import BuildingLibraryIcon from "@heroicons/react/24/outline/BuildingLibraryIcon";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";
import MapPinIcon from "@heroicons/react/24/outline/MapPinIcon";
import HandThumbUpIcon from "@heroicons/react/24/outline/HandThumbUpIcon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import UserCircleIcon from "@heroicons/react/24/solid/UserCircleIcon";

import { notEmpty } from "@gc-digital-talent/helpers";
import {
  TableOfContents,
  HeadingRank,
  Link,
  incrementHeadingRank,
} from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";
import type { User } from "@gc-digital-talent/graphql";

import ExperienceSection from "./ExperienceSection";
import AboutSection from "./ProfileSections/AboutSection";
import DiversityEquityInclusionSection from "./ProfileSections/DiversityEquityInclusionSection";
import GovernmentInformationSection from "./ProfileSections/GovernmentInformationSection";
import LanguageInformationSection from "./ProfileSections/LanguageInformationSection";
import WorkLocationSection from "./ProfileSections/WorkLocationSection";
import WorkPreferencesSection from "./ProfileSections/WorkPreferencesSection";
import SkillShowcaseSection from "./SkillShowcaseSection";
import { PAGE_SECTION_ID } from "./constants";

interface SectionControl {
  isVisible: boolean;
  editUrl?: string;
  override?: React.ReactNode;
}

interface UserProfileProps {
  user: User;
  sections: {
    about?: SectionControl;
    employmentEquity?: SectionControl;
    government?: SectionControl;
    hiringPools?: SectionControl;
    language?: SectionControl;
    careerTimelineAndRecruitment?: SectionControl;
    workLocation?: SectionControl;
    workPreferences?: SectionControl;
    skillShowcase?: SectionControl;
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
      className="block"
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
      <TableOfContents.Wrapper data-h2-margin-top="base(x3)">
        {children}
      </TableOfContents.Wrapper>
    </div>
  );
};

const UserProfile = ({
  user,
  sections,
  subTitle,
  headingLevel = "h2",
  isNavigationVisible = true,
}: UserProfileProps) => {
  const intl = useIntl();
  const {
    experiences,
    topBehaviouralSkillsRanking,
    topTechnicalSkillsRanking,
    improveBehaviouralSkillsRanking,
    improveTechnicalSkillsRanking,
  } = user;
  const contentHeadingLevel = incrementHeadingRank(headingLevel);

  type SectionKeys = keyof UserProfileProps["sections"];

  const showSection = (key: SectionKeys): boolean | undefined => {
    return sections[key] && sections[key]?.isVisible;
  };

  return (
    <Container show={isNavigationVisible}>
      {isNavigationVisible && (
        <TableOfContents.Navigation>
          <TableOfContents.List>
            {showSection("about") && (
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={PAGE_SECTION_ID.ABOUT}>
                  {intl.formatMessage(navigationMessages.aboutMe)}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
            )}
            {showSection("employmentEquity") && (
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={PAGE_SECTION_ID.DEI}>
                  {intl.formatMessage(
                    navigationMessages.diversityEquityInclusion,
                  )}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
            )}
            {showSection("language") && (
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={PAGE_SECTION_ID.LANGUAGE}>
                  {intl.formatMessage(navigationMessages.languageInformation)}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
            )}
            {showSection("government") && (
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={PAGE_SECTION_ID.GOVERNMENT}>
                  {intl.formatMessage(navigationMessages.governmentInformation)}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
            )}
            {showSection("workLocation") && (
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={PAGE_SECTION_ID.WORK_LOCATION}>
                  {intl.formatMessage(navigationMessages.workLocation)}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
            )}
            {showSection("workPreferences") && (
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink
                  id={PAGE_SECTION_ID.WORK_PREFERENCES}
                >
                  {intl.formatMessage(navigationMessages.workPreferences)}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
            )}
            {showSection("careerTimelineAndRecruitment") && (
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink
                  id={PAGE_SECTION_ID.CAREER_TIMELINE_AND_RECRUITMENT}
                >
                  {intl.formatMessage(
                    navigationMessages.careerTimelineAndRecruitment,
                  )}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
            )}
            {showSection("skillShowcase") && (
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={PAGE_SECTION_ID.SKILL_SHOWCASE}>
                  {intl.formatMessage(navigationMessages.skillShowcase)}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
            )}
            {/* {showSection("accountAndPrivacy") && (
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink
                  id={PAGE_SECTION_ID.ACCOUNT_AND_PRIVACY}
                >
                  {intl.formatMessage({
                    defaultMessage: "Account and privacy settings",
                    id: "",
                    description:
                      "Title of the Account and privacy settings link section",
                  })}
                </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
          )} */}
          </TableOfContents.List>
        </TableOfContents.Navigation>
      )}
      <TableOfContents.Content>
        {subTitle}
        {showSection("about") && (
          <TableOfContents.Section id={PAGE_SECTION_ID.ABOUT}>
            <HeadingWrapper show={!!sections.about?.editUrl}>
              <div
                data-h2-flex-item="base(1of1) p-tablet(fill)"
                data-h2-text-align="base(center) p-tablet(left)"
              >
                <TableOfContents.Heading
                  as={headingLevel}
                  icon={UserIcon}
                  data-h2-margin-top="base(0)"
                >
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
              <AboutSection user={user} editPath={sections.about?.editUrl} />
            )}
          </TableOfContents.Section>
        )}
        {showSection("employmentEquity") && (
          <TableOfContents.Section id={PAGE_SECTION_ID.DEI}>
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
                user={user}
                editPath={sections.employmentEquity?.editUrl}
              />
            )}
          </TableOfContents.Section>
        )}
        {showSection("language") && (
          <TableOfContents.Section id={PAGE_SECTION_ID.LANGUAGE}>
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
                user={user}
                editPath={sections.language?.editUrl}
              />
            )}
          </TableOfContents.Section>
        )}
        {showSection("government") && (
          <TableOfContents.Section id={PAGE_SECTION_ID.GOVERNMENT}>
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
                user={user}
                editPath={sections.government?.editUrl}
              />
            )}
          </TableOfContents.Section>
        )}
        {showSection("workLocation") && (
          <TableOfContents.Section id={PAGE_SECTION_ID.WORK_LOCATION}>
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
                user={user}
                editPath={sections.workLocation?.editUrl}
              />
            )}
          </TableOfContents.Section>
        )}
        {showSection("workPreferences") && (
          <TableOfContents.Section id={PAGE_SECTION_ID.WORK_PREFERENCES}>
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
                user={user}
                editPath={sections.workPreferences?.editUrl}
              />
            )}
          </TableOfContents.Section>
        )}
        {showSection("careerTimelineAndRecruitment") && (
          <TableOfContents.Section
            id={PAGE_SECTION_ID.CAREER_TIMELINE_AND_RECRUITMENT}
          >
            <HeadingWrapper
              show={!!sections.careerTimelineAndRecruitment?.editUrl}
            >
              <div
                data-h2-flex-item="base(1of1) p-tablet(fill)"
                data-h2-text-align="base(center) p-tablet(left)"
              >
                <TableOfContents.Heading as={headingLevel} icon={BoltIcon}>
                  {intl.formatMessage(
                    navigationMessages.careerTimelineAndRecruitment,
                  )}
                </TableOfContents.Heading>
              </div>
              {sections.careerTimelineAndRecruitment?.editUrl && (
                <EditUrlLink
                  link={sections.careerTimelineAndRecruitment.editUrl}
                  text={intl.formatMessage(
                    {
                      defaultMessage: "Edit {title}",
                      id: "3R3jKp",
                      description: "Link to edit object",
                    },
                    {
                      title: intl.formatMessage(
                        navigationMessages.careerTimelineAndRecruitment,
                      ),
                    },
                  )}
                />
              )}
            </HeadingWrapper>
            {sections.careerTimelineAndRecruitment?.override ? (
              sections.careerTimelineAndRecruitment.override
            ) : (
              <ExperienceSection
                headingLevel={contentHeadingLevel}
                experiences={experiences?.filter(notEmpty)}
              />
            )}
          </TableOfContents.Section>
        )}
        {showSection("skillShowcase") && (
          <TableOfContents.Section id={PAGE_SECTION_ID.SKILL_SHOWCASE}>
            <HeadingWrapper show={!!sections.skillShowcase?.editUrl}>
              <div
                data-h2-flex-item="base(1of1) p-tablet(fill)"
                data-h2-text-align="base(center) p-tablet(left)"
              >
                <TableOfContents.Heading as={headingLevel} icon={BoltIcon}>
                  {intl.formatMessage(navigationMessages.skillShowcase)}
                </TableOfContents.Heading>
              </div>
            </HeadingWrapper>
            {sections.skillShowcase?.override ? (
              sections.skillShowcase.override
            ) : (
              <SkillShowcaseSection
                headingLevel={contentHeadingLevel}
                topTechnicalSkillsRanking={
                  topTechnicalSkillsRanking?.filter(notEmpty) ?? []
                }
                topBehaviouralSkillsRanking={
                  topBehaviouralSkillsRanking?.filter(notEmpty) ?? []
                }
                improveTechnicalSkillsRanking={
                  improveTechnicalSkillsRanking?.filter(notEmpty) ?? []
                }
                improveBehaviouralSkillsRanking={
                  improveBehaviouralSkillsRanking?.filter(notEmpty) ?? []
                }
              />
            )}
          </TableOfContents.Section>
        )}
      </TableOfContents.Content>
    </Container>
  );
};

export default UserProfile;
