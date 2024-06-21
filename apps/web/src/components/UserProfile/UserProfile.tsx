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
  incrementHeadingRank,
} from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";
import type { User } from "@gc-digital-talent/graphql";

import { PAGE_SECTION_ID } from "~/constants/sections/userProfile";

import ExperienceSection from "./ExperienceSection";
import AboutSection from "./ProfileSections/AboutSection";
import DiversityEquityInclusionSection from "./ProfileSections/DiversityEquityInclusionSection";
import GovernmentInformationSection from "./ProfileSections/GovernmentInformationSection";
import LanguageInformationSection from "./ProfileSections/LanguageInformationSection";
import WorkLocationSection from "./ProfileSections/WorkLocationSection";
import WorkPreferencesSection from "./ProfileSections/WorkPreferencesSection";
import SkillShowcaseSection from "./SkillShowcaseSection";

interface UserProfileProps {
  user: User;
  headingLevel?: HeadingRank;
}

const UserProfile = ({ user, headingLevel = "h2" }: UserProfileProps) => {
  const intl = useIntl();
  const {
    experiences,
    topBehaviouralSkillsRanking,
    topTechnicalSkillsRanking,
    improveBehaviouralSkillsRanking,
    improveTechnicalSkillsRanking,
  } = user;
  const contentHeadingLevel = incrementHeadingRank(headingLevel);

  return (
    <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
      <TableOfContents.Wrapper data-h2-margin-top="base(x3)">
        <TableOfContents.Navigation>
          <TableOfContents.List>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={PAGE_SECTION_ID.ABOUT}>
                {intl.formatMessage(navigationMessages.aboutMe)}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={PAGE_SECTION_ID.DEI}>
                {intl.formatMessage(
                  navigationMessages.diversityEquityInclusion,
                )}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>

            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={PAGE_SECTION_ID.LANGUAGE}>
                {intl.formatMessage(navigationMessages.languageInformation)}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>

            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={PAGE_SECTION_ID.GOVERNMENT}>
                {intl.formatMessage(navigationMessages.governmentInformation)}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>

            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={PAGE_SECTION_ID.WORK_LOCATION}>
                {intl.formatMessage(navigationMessages.workLocation)}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={PAGE_SECTION_ID.WORK_PREFERENCES}>
                {intl.formatMessage(navigationMessages.workPreferences)}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink
                id={PAGE_SECTION_ID.CAREER_TIMELINE_AND_RECRUITMENT}
              >
                {intl.formatMessage(
                  navigationMessages.careerTimelineAndRecruitment,
                )}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id={PAGE_SECTION_ID.SKILL_SHOWCASE}>
                {intl.formatMessage(navigationMessages.skillShowcase)}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>
          </TableOfContents.List>
        </TableOfContents.Navigation>
        <TableOfContents.Content>
          <TableOfContents.Section id={PAGE_SECTION_ID.ABOUT}>
            <div data-h2-padding="base(x2, 0, x1, 0)">
              <div data-h2-flex-grid="base(center, x2, x1)">
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
              </div>
            </div>
            <AboutSection user={user} />
          </TableOfContents.Section>
          <TableOfContents.Section id={PAGE_SECTION_ID.DEI}>
            <div data-h2-padding="base(x2, 0, x1, 0)">
              <div data-h2-flex-grid="base(center, x2, x1)">
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
              </div>
            </div>
            <DiversityEquityInclusionSection user={user} />
          </TableOfContents.Section>
          <TableOfContents.Section id={PAGE_SECTION_ID.LANGUAGE}>
            <div data-h2-padding="base(x2, 0, x1, 0)">
              <div data-h2-flex-grid="base(center, x2, x1)">
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
              </div>
            </div>
            <LanguageInformationSection user={user} />
          </TableOfContents.Section>
          <TableOfContents.Section id={PAGE_SECTION_ID.GOVERNMENT}>
            <div data-h2-padding="base(x2, 0, x1, 0)">
              <div data-h2-flex-grid="base(center, x2, x1)">
                <div
                  data-h2-flex-item="base(1of1) p-tablet(fill)"
                  data-h2-text-align="base(center) p-tablet(left)"
                >
                  <TableOfContents.Heading
                    as={headingLevel}
                    icon={BuildingLibraryIcon}
                  >
                    {intl.formatMessage(
                      navigationMessages.governmentInformation,
                    )}
                  </TableOfContents.Heading>
                </div>
              </div>
            </div>
            <GovernmentInformationSection user={user} />
          </TableOfContents.Section>
          <TableOfContents.Section id={PAGE_SECTION_ID.WORK_LOCATION}>
            <div data-h2-padding="base(x2, 0, x1, 0)">
              <div data-h2-flex-grid="base(center, x2, x1)">
                <div
                  data-h2-flex-item="base(1of1) p-tablet(fill)"
                  data-h2-text-align="base(center) p-tablet(left)"
                >
                  <TableOfContents.Heading as={headingLevel} icon={MapPinIcon}>
                    {intl.formatMessage(navigationMessages.workLocation)}
                  </TableOfContents.Heading>
                </div>
              </div>
            </div>
            <WorkLocationSection user={user} />
          </TableOfContents.Section>
          <TableOfContents.Section id={PAGE_SECTION_ID.WORK_PREFERENCES}>
            <div data-h2-padding="base(x2, 0, x1, 0)">
              <div data-h2-flex-grid="base(center, x2, x1)">
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
              </div>
            </div>
            <WorkPreferencesSection user={user} />
          </TableOfContents.Section>
          <TableOfContents.Section
            id={PAGE_SECTION_ID.CAREER_TIMELINE_AND_RECRUITMENT}
          >
            <div data-h2-padding="base(x2, 0, x1, 0)">
              <div data-h2-flex-grid="base(center, x2, x1)">
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
              </div>
            </div>
            <ExperienceSection
              headingLevel={contentHeadingLevel}
              experiences={experiences?.filter(notEmpty)}
            />
          </TableOfContents.Section>
          <TableOfContents.Section id={PAGE_SECTION_ID.SKILL_SHOWCASE}>
            <div data-h2-padding="base(x2, 0, x1, 0)">
              <div data-h2-flex-grid="base(center, x2, x1)">
                <div
                  data-h2-flex-item="base(1of1) p-tablet(fill)"
                  data-h2-text-align="base(center) p-tablet(left)"
                >
                  <TableOfContents.Heading as={headingLevel} icon={BoltIcon}>
                    {intl.formatMessage(navigationMessages.skillShowcase)}
                  </TableOfContents.Heading>
                </div>
              </div>
            </div>
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
          </TableOfContents.Section>
        </TableOfContents.Content>
      </TableOfContents.Wrapper>
    </div>
  );
};

export default UserProfile;
