import { useIntl } from "react-intl";
import ChatBubbleLeftRightIcon from "@heroicons/react/24/outline/ChatBubbleLeftRightIcon";
import BuildingLibraryIcon from "@heroicons/react/24/outline/BuildingLibraryIcon";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";
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
import type { AdminUserProfileUserFragment } from "@gc-digital-talent/graphql";

import { PAGE_SECTION_ID } from "~/constants/sections/userProfile";

import ExperienceSection from "./ExperienceSection";
import AboutSection from "./ProfileSections/AboutSection";
import DiversityEquityInclusionSection from "./ProfileSections/DiversityEquityInclusionSection";
import GovernmentInformationSection from "./ProfileSections/GovernmentInformationSection";
import LanguageInformationSection from "./ProfileSections/LanguageInformationSection";
import WorkPreferencesSection from "./ProfileSections/WorkPreferencesSection";
import SkillShowcaseSection from "./SkillShowcaseSection";

interface UserProfileProps {
  user: AdminUserProfileUserFragment;
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
    <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
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
              <TableOfContents.AnchorLink id={PAGE_SECTION_ID.WORK_PREFERENCES}>
                {intl.formatMessage(navigationMessages.workPreferences)}
              </TableOfContents.AnchorLink>
            </TableOfContents.ListItem>

            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink
                id={PAGE_SECTION_ID.CAREER_TIMELINE_AND_RECRUITMENT}
              >
                {intl.formatMessage(navigationMessages.careerTimeline)}
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
            <TableOfContents.Heading
              as={headingLevel}
              icon={UserIcon}
              data-h2-margin="base(0 0 x1 0)"
            >
              {intl.formatMessage(navigationMessages.aboutMe)}
            </TableOfContents.Heading>
            <AboutSection user={user} />
          </TableOfContents.Section>
          <TableOfContents.Section id={PAGE_SECTION_ID.DEI}>
            <TableOfContents.Heading
              as={headingLevel}
              icon={UserCircleIcon}
              data-h2-margin="base(x1.5 0 x1 0)"
            >
              {intl.formatMessage(navigationMessages.diversityEquityInclusion)}
            </TableOfContents.Heading>
            <DiversityEquityInclusionSection user={user} />
          </TableOfContents.Section>
          <TableOfContents.Section id={PAGE_SECTION_ID.LANGUAGE}>
            <TableOfContents.Heading
              as={headingLevel}
              icon={ChatBubbleLeftRightIcon}
              data-h2-margin="base(x1.5 0 x1 0)"
            >
              {intl.formatMessage(navigationMessages.languageInformation)}
            </TableOfContents.Heading>
            <LanguageInformationSection user={user} />
          </TableOfContents.Section>
          <TableOfContents.Section id={PAGE_SECTION_ID.GOVERNMENT}>
            <TableOfContents.Heading
              as={headingLevel}
              icon={BuildingLibraryIcon}
              data-h2-margin="base(x1.5 0 x1 0)"
            >
              {intl.formatMessage(navigationMessages.governmentInformation)}
            </TableOfContents.Heading>
            <GovernmentInformationSection user={user} />
          </TableOfContents.Section>
          <TableOfContents.Section id={PAGE_SECTION_ID.WORK_PREFERENCES}>
            <TableOfContents.Heading
              as={headingLevel}
              icon={HandThumbUpIcon}
              data-h2-margin="base(x1.5 0 x1 0)"
            >
              {intl.formatMessage(navigationMessages.workPreferences)}
            </TableOfContents.Heading>
            <WorkPreferencesSection user={user} />
          </TableOfContents.Section>
          <TableOfContents.Section
            id={PAGE_SECTION_ID.CAREER_TIMELINE_AND_RECRUITMENT}
          >
            <TableOfContents.Heading
              as={headingLevel}
              icon={BoltIcon}
              data-h2-margin="base(x1.5 0 x1 0)"
            >
              {intl.formatMessage(navigationMessages.careerTimeline)}
            </TableOfContents.Heading>
            <ExperienceSection
              headingLevel={contentHeadingLevel}
              experiences={experiences?.filter(notEmpty)}
            />
          </TableOfContents.Section>
          <TableOfContents.Section id={PAGE_SECTION_ID.SKILL_SHOWCASE}>
            <TableOfContents.Heading
              as={headingLevel}
              icon={BoltIcon}
              data-h2-margin="base(x1.5 0 x1 0)"
            >
              {intl.formatMessage(navigationMessages.skillShowcase)}
            </TableOfContents.Heading>
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
