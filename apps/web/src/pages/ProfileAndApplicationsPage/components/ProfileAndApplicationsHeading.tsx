import { useIntl } from "react-intl";
import { useSearchParams } from "react-router";
import BriefcaseIcon from "@heroicons/react/20/solid/BriefcaseIcon";
import BookOpenIcon from "@heroicons/react/20/solid/BookOpenIcon";
import UsersIcon from "@heroicons/react/20/solid/UsersIcon";
import LightBulbIcon from "@heroicons/react/20/solid/LightBulbIcon";
import StarIcon from "@heroicons/react/20/solid/StarIcon";
import UserGroupIcon from "@heroicons/react/20/solid/UserGroupIcon";
import LockClosedIcon from "@heroicons/react/20/solid/LockClosedIcon";
import ShieldCheckIcon from "@heroicons/react/20/solid/ShieldCheckIcon";
import { ReactNode, ReactElement } from "react";

import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  Alert,
  Link,
  LinkProps,
  ScrollToLink,
  ScrollToLinkProps,
} from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import Hero from "~/components/Hero";
import useRoutes, {
  FromIapDraftQueryKey,
  FromIapSuccessQueryKey,
} from "~/hooks/useRoutes";
import {
  aboutSectionHasEmptyRequiredFields,
  governmentInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasEmptyRequiredFields,
  workPreferencesSectionHasEmptyRequiredFields,
} from "~/validators/profile";
import {
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "~/utils/experienceUtils";
import StatusItem from "~/components/StatusItem/StatusItem";
import HeroCard from "~/components/HeroCard/HeroCard";
import { PAGE_SECTION_ID as PROFILE_PAGE_SECTION_ID } from "~/constants/sections/userProfile";
import { PAGE_SECTION_ID as CAREER_TIMELINE_AND_RECRUITMENTS_PAGE_SECTION_ID } from "~/constants/sections/careerTimeline";
import experienceMessages from "~/messages/experienceMessages";
import { isQualifiedStatus } from "~/utils/poolCandidate";

function buildLink(
  href: string,
  chunks: ReactNode,
  color?: LinkProps["color"],
): ReactElement {
  return (
    <Link href={href} fontSize="h5" mode="text" color={color}>
      {chunks}
    </Link>
  );
}
function buildScrollToLink(
  to: string,
  chunks: ReactNode,
  color?: ScrollToLinkProps["color"],
  fontSize?: ScrollToLinkProps["fontSize"],
): ReactElement {
  return (
    <ScrollToLink to={to} mode="text" color={color} fontSize={fontSize}>
      {chunks}
    </ScrollToLink>
  );
}

export const DashboardHeadingUser_Fragment = graphql(/* GraphQL */ `
  fragment DashboardHeadingUser on User {
    id
    firstName
    lastName
    email
    telephone
    preferredLang {
      value
      label {
        en
        fr
      }
    }
    preferredLanguageForInterview {
      value
      label {
        en
        fr
      }
    }
    preferredLanguageForExam {
      value
      label {
        en
        fr
      }
    }
    currentCity
    currentProvince {
      value
      label {
        en
        fr
      }
    }
    citizenship {
      value
      label {
        en
        fr
      }
    }
    armedForcesStatus {
      value
      label {
        en
        fr
      }
    }
    locationPreferences {
      value
      label {
        en
        fr
      }
    }
    positionDuration
    isGovEmployee
    hasPriorityEntitlement
    priorityNumber
    lookingForEnglish
    lookingForFrench
    lookingForBilingual
    firstOfficialLanguage {
      value
      label {
        en
        fr
      }
    }
    estimatedLanguageAbility {
      value
      label {
        en
        fr
      }
    }
    secondLanguageExamCompleted
    secondLanguageExamValidity
    writtenLevel {
      value
      label {
        en
        fr
      }
    }
    comprehensionLevel {
      value
      label {
        en
        fr
      }
    }
    verbalLevel {
      value
      label {
        en
        fr
      }
    }
    experiences {
      id
    }
    poolCandidates {
      id
      status {
        value
        label {
          en
          fr
        }
      }
    }
    userSkills {
      id
    }
    topBehaviouralSkillsRanking {
      id
    }
    topTechnicalSkillsRanking {
      id
    }
    improveBehaviouralSkillsRanking {
      id
    }
    improveTechnicalSkillsRanking {
      id
    }
  }
`);

interface DashboardHeadingProps {
  userQuery: FragmentType<typeof DashboardHeadingUser_Fragment>;
}

const DashboardHeading = ({ userQuery }: DashboardHeadingProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const [searchParams, setSearchParams] = useSearchParams();
  const user = getFragment(DashboardHeadingUser_Fragment, userQuery);

  const notEmptyExperiences = unpackMaybes(user.experiences);
  const notEmptyApplications = unpackMaybes(user.poolCandidates);

  const awardExperiences = notEmptyExperiences?.filter(isAwardExperience) || [];
  const communityExperiences =
    notEmptyExperiences?.filter(isCommunityExperience) || [];
  const educationExperiences =
    notEmptyExperiences?.filter(isEducationExperience) || [];
  const personalExperiences =
    notEmptyExperiences?.filter(isPersonalExperience) || [];
  const workExperiences = notEmptyExperiences?.filter(isWorkExperience) || [];

  const skillShowcaseUrl = paths.skillShowcase();
  const skillPortfolioUrl = paths.skillPortfolio();

  const hasTopSkills =
    user.topBehaviouralSkillsRanking?.length &&
    user.topTechnicalSkillsRanking?.length;
  const hasSkillsToImprove =
    user.improveBehaviouralSkillsRanking?.length &&
    user.improveTechnicalSkillsRanking?.length;

  const skillPortfolioCount = user.userSkills?.length ?? 0;

  // The completion states are determined by the following rules:
  //   The skill library items need to have at least 1 skill
  //   The showcase items need to have at least 1 skill added to each of the 4 showcases
  const skillPortfolioStatus = skillPortfolioCount ? "success" : "error";
  const topSkillsStatus = hasTopSkills ? "success" : "error";
  const skillsToImproveStatus = hasSkillsToImprove ? "success" : "error";

  return (
    <Hero
      title={intl.formatMessage(
        {
          defaultMessage:
            "Welcome back<hidden> to your applicant dashboard</hidden>, {name}",
          id: "bw4CAS",
          description:
            "Title for applicant dashboard on the talent cloud admin portal.",
        },
        {
          name: user.firstName,
        },
      )}
      subtitle={intl.formatMessage(
        {
          defaultMessage:
            "Manage your <a1>personal information</a1>, <a2>career timeline</a2>, <a3>skills</a3>, and <a4>track applications</a4>.",
          id: "KCaMch",
          description: "Subtitle for profile and applications hero",
        },
        {
          a1: (chunks: ReactNode) =>
            buildLink(paths.profile(), chunks, "whiteFixed"),
          a2: (chunks: ReactNode) =>
            buildLink(
              paths.careerTimelineAndRecruitment(),
              chunks,
              "whiteFixed",
            ),
          a3: (chunks: ReactNode) =>
            buildLink(paths.skillPortfolio(), chunks, "whiteFixed"),
          a4: (chunks: ReactNode) =>
            buildScrollToLink(
              "track-applications-section",
              chunks,
              "whiteFixed",
              "h5",
            ),
        },
      )}
      overlap
      centered
    >
      {searchParams.get(FromIapDraftQueryKey) === "true" && (
        <Alert.Root
          type="info"
          dismissible
          live={false}
          onDismiss={() => {
            searchParams.delete(FromIapDraftQueryKey);
            setSearchParams(searchParams, { replace: true });
          }}
        >
          <Alert.Title>
            {intl.formatMessage({
              defaultMessage:
                "Welcome to your Digital Talent Profile and applications page",
              id: "d03yTk",
              description:
                "Title for notification that a draft IAP application was saved",
            })}
          </Alert.Title>
          <p data-h2-margin-bottom="base(x0.5)">
            {intl.formatMessage({
              defaultMessage:
                "Are you looking for your application to the IT Apprenticeship Program for Indigenous Peoples?",
              id: "G5Joq7",
              description:
                "First paragraph for profile and applications notification welcoming an IAP user",
            })}
          </p>
          <p data-h2-margin-bottom="base(x0.5)">
            {intl.formatMessage({
              defaultMessage:
                "The apprenticeship program is a part of a larger digital talent initiative in the Government of Canada that aspires to recruit awesome digital talent like yourself. This profile provides access to other digital opportunities and recruitments beyond the apprenticeship program, if you choose to apply. If you’d prefer to stick to the apprenticeship program exclusively, that’s okay too!",
              id: "aMhznA",
              description:
                "Second paragraph for profile and applications notification welcoming an IAP user",
            })}
          </p>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "When you sign in to your account, you'll start on this page from now on. You can use the <strong><a>Track your applications</a></strong> section on this page to review your application to the IT Apprenticeship Program for Indigenous Peoples and track your position in the program.",
                id: "GQsJAi",
                description:
                  "Third paragraph for profile and applications notification welcoming an IAP user",
              },
              {
                a: (chunks: ReactNode) =>
                  buildScrollToLink("track-applications-section", chunks),
              },
            )}
          </p>
        </Alert.Root>
      )}
      {searchParams.get(FromIapSuccessQueryKey) === "true" && (
        <Alert.Root
          type="info"
          dismissible
          live={false}
          onDismiss={() => {
            searchParams.delete(FromIapSuccessQueryKey);
            setSearchParams(searchParams, { replace: true });
          }}
        >
          <Alert.Title>
            {intl.formatMessage({
              defaultMessage:
                "Thanks for applying to the IT Apprenticeship Program for Indigenous Peoples!",
              id: "vB1p56",
              description:
                "Title for notification that a an IAP application was submitted",
            })}
          </Alert.Title>
          <p data-h2-margin-bottom="base(x0.5)">
            {intl.formatMessage({
              defaultMessage:
                "You've now landed on your Digital Talent profile page.",
              id: "y+Pq1f",
              description:
                "First paragraph for profile and applications notification welcoming an IAP user",
            })}
          </p>
          <p data-h2-margin-bottom="base(x0.5)">
            {intl.formatMessage({
              defaultMessage:
                "The apprenticeship program is a part of a larger digital talent initiative in the Government of Canada that aspires to recruit awesome digital talent like yourself. This profile provides access to other digital opportunities and recruitments beyond the apprenticeship program, if you choose to apply. If you’d prefer to stick to the apprenticeship program exclusively, that’s okay too!",
              id: "aMhznA",
              description:
                "Second paragraph for profile and applications notification welcoming an IAP user",
            })}
          </p>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "When you sign in to your account, you'll start on this page from now on. You can use the <strong><a>Track your applications</a></strong> section on this page to review your application to the IT Apprenticeship Program for Indigenous Peoples and track your status in the program.",
                id: "Hf3x3E",
                description:
                  "Third paragraph for profile and applications notification welcoming an IAP user",
              },
              {
                a: (chunks: ReactNode) =>
                  buildScrollToLink("track-applications-section", chunks),
              },
            )}
          </p>
        </Alert.Root>
      )}
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        data-h2-grid-template-columns="base(100%) l-tablet(repeat(3, minmax(0, 1fr)))"
      >
        <HeroCard
          asNav
          color="secondary"
          title={intl.formatMessage({
            defaultMessage: "Personal information",
            id: "cA0iH+",
            description: "Profile and applications card title for profile card",
          })}
          href={paths.profile()}
        >
          <StatusItem
            asListItem
            layout="hero"
            title={intl.formatMessage({
              defaultMessage: "Personal and contact info",
              id: "b0fN+P",
              description: "Title of the About link section",
            })}
            status={
              aboutSectionHasEmptyRequiredFields(user) ? "error" : "success"
            }
            href={paths.profile(PROFILE_PAGE_SECTION_ID.ABOUT)}
          />

          <StatusItem
            asListItem
            layout="hero"
            title={intl.formatMessage(navigationMessages.workPreferences)}
            status={
              workPreferencesSectionHasEmptyRequiredFields(user)
                ? "error"
                : "success"
            }
            href={paths.profile(PROFILE_PAGE_SECTION_ID.WORK_PREFERENCES)}
          />

          <StatusItem
            asListItem
            layout="hero"
            title={intl.formatMessage(
              navigationMessages.diversityEquityInclusion,
            )}
            href={paths.profile(PROFILE_PAGE_SECTION_ID.DEI)}
            icon={UserGroupIcon}
          />
          <StatusItem
            asListItem
            layout="hero"
            title={intl.formatMessage({
              defaultMessage: "Government employee info",
              id: "ZsevjY",
              description: "Title of the Government Information link section",
            })}
            status={
              governmentInformationSectionHasEmptyRequiredFields(user)
                ? "error"
                : "success"
            }
            href={paths.profile(PROFILE_PAGE_SECTION_ID.GOVERNMENT)}
          />

          <StatusItem
            asListItem
            layout="hero"
            title={intl.formatMessage({
              defaultMessage: "Language profile",
              id: "Ji2C9w",
              description: "Title of the Language Information link section",
            })}
            status={
              languageInformationSectionHasEmptyRequiredFields(user)
                ? "error"
                : "success"
            }
            href={paths.profile(PROFILE_PAGE_SECTION_ID.LANGUAGE)}
          />
          <StatusItem
            asListItem
            layout="hero"
            title={intl.formatMessage({
              defaultMessage: "Account and privacy settings",
              id: "O+Lj1u",
              description:
                "Title of the Account and privacy settings link section",
            })}
            href={paths.accountSettings()}
            icon={LockClosedIcon}
          />
        </HeroCard>
        <HeroCard
          color="tertiary"
          title={intl.formatMessage({
            defaultMessage: "Career timeline",
            id: "sdvCNP",
            description:
              "Profile and applications card title for career timeline card",
          })}
          href={paths.careerTimelineAndRecruitment()}
        >
          <StatusItem
            layout="hero"
            title={intl.formatMessage({
              defaultMessage: "Work experiences",
              id: "QvyQc3",
              description: "Heading for work experiences",
            })}
            itemCount={workExperiences?.length}
            icon={BriefcaseIcon}
          />
          <StatusItem
            layout="hero"
            title={intl.formatMessage(experienceMessages.education)}
            itemCount={educationExperiences?.length}
            icon={BookOpenIcon}
          />
          <StatusItem
            layout="hero"
            title={intl.formatMessage(experienceMessages.community)}
            itemCount={communityExperiences?.length}
            icon={UsersIcon}
          />
          <StatusItem
            layout="hero"
            title={intl.formatMessage(experienceMessages.personal)}
            itemCount={personalExperiences?.length}
            icon={LightBulbIcon}
          />
          <StatusItem
            layout="hero"
            title={intl.formatMessage(experienceMessages.award)}
            itemCount={awardExperiences?.length}
            icon={StarIcon}
          />
          <StatusItem
            layout="hero"
            title={intl.formatMessage({
              defaultMessage: "Qualified recruitments",
              id: "2dpDPq",
              description: "Title for qualified recruitments section",
            })}
            itemCount={
              notEmptyApplications.filter((application) =>
                isQualifiedStatus(application.status?.value),
              ).length
            }
            icon={ShieldCheckIcon}
            href={paths.careerTimelineAndRecruitment({
              section:
                CAREER_TIMELINE_AND_RECRUITMENTS_PAGE_SECTION_ID.QUALIFIED_RECRUITMENT_PROCESSES,
            })}
          />
        </HeroCard>
        <HeroCard
          color="quaternary"
          title={intl.formatMessage(navigationMessages.skillPortfolio)}
          href={`${skillPortfolioUrl}#manage`}
        >
          <StatusItem
            layout="hero"
            title={intl.formatMessage(navigationMessages.skillPortfolio)}
            itemCount={skillPortfolioCount}
            status={skillPortfolioStatus}
            href={`${skillPortfolioUrl}#manage`}
          />
          <StatusItem
            layout="hero"
            title={intl.formatMessage({
              defaultMessage: "Top skills",
              id: "deiylo",
              description: "Title for top skills showcase section",
            })}
            status={topSkillsStatus}
            href={`${skillShowcaseUrl}#top-skills`}
          />
          <StatusItem
            layout="hero"
            title={intl.formatMessage({
              defaultMessage: "Skills to improve",
              id: "FvbONe",
              description: "Title for skills to improve showcase section",
            })}
            status={skillsToImproveStatus}
            href={`${skillShowcaseUrl}#skills-to-improve`}
          />
        </HeroCard>
      </div>
    </Hero>
  );
};

export default DashboardHeading;
