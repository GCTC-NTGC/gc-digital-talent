import * as React from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";

import BriefcaseIcon from "@heroicons/react/20/solid/BriefcaseIcon";
import BookOpenIcon from "@heroicons/react/20/solid/BookOpenIcon";
import UsersIcon from "@heroicons/react/20/solid/UsersIcon";
import LightBulbIcon from "@heroicons/react/20/solid/LightBulbIcon";
import StarIcon from "@heroicons/react/20/solid/StarIcon";
import UserGroupIcon from "@heroicons/react/20/solid/UserGroupIcon";
import LockClosedIcon from "@heroicons/react/20/solid/LockClosedIcon";
import ShieldCheckIcon from "@heroicons/react/20/solid/ShieldCheckIcon";
import BeakerIcon from "@heroicons/react/20/solid/BeakerIcon";

import { notEmpty } from "@gc-digital-talent/helpers";
import {
  Alert,
  Link,
  LinkProps,
  ScrollToLink,
  ScrollToLinkProps,
} from "@gc-digital-talent/ui";
import { useFeatureFlags } from "@gc-digital-talent/env";

import Hero from "~/components/Hero/Hero";
import useRoutes, {
  FromIapDraftQueryKey,
  FromIapSuccessQueryKey,
} from "~/hooks/useRoutes";
import {
  aboutSectionHasEmptyRequiredFields,
  governmentInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasEmptyRequiredFields,
  workLocationSectionHasEmptyRequiredFields,
  workPreferencesSectionHasEmptyRequiredFields,
} from "~/validators/profile";
import {
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "~/utils/experienceUtils";
import { AwardExperience } from "~/api/generated";
import { StatusItem } from "~/components/StatusItem/StatusItem";
import { HeroCard } from "~/components/HeroCard/HeroCard";
import { PAGE_SECTION_ID as PROFILE_PAGE_SECTION_ID } from "~/components/UserProfile/constants";
import { isApplicationQualifiedRecruitment } from "~/utils/applicationUtils";
import { PAGE_SECTION_ID as RESUME_AND_RECRUITMENTS_PAGE_SECTION_ID } from "~/pages/Profile/ResumeAndRecruitmentPage/constants";
import { PartialUser } from "../types";

function buildLink(
  href: string,
  chunks: React.ReactNode,
  color?: LinkProps["color"],
): React.ReactElement {
  return (
    <Link href={href} color={color}>
      {chunks}
    </Link>
  );
}
function buildScrollToLink(
  to: string,
  chunks: React.ReactNode,
  color?: ScrollToLinkProps["color"],
): React.ReactElement {
  return (
    <ScrollToLink to={to} color={color}>
      {chunks}
    </ScrollToLink>
  );
}
export interface DashboardHeadingProps {
  user: PartialUser;
}

const DashboardHeading = ({ user }: DashboardHeadingProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const [searchParams, setSearchParams] = useSearchParams();
  const { skillLibrary: skillLibraryFlag } = useFeatureFlags();

  const notEmptyExperiences = user.experiences?.filter(notEmpty) ?? [];
  const notEmptyApplications = user.poolCandidates?.filter(notEmpty) ?? [];

  const awardExperiences =
    notEmptyExperiences?.filter(isAwardExperience).map(
      (award: AwardExperience) =>
        ({
          ...award,
          startDate: award.awardedDate,
          endDate: award.awardedDate,
        } as AwardExperience & { startDate: string; endDate: string }),
    ) || [];
  const communityExperiences =
    notEmptyExperiences?.filter(isCommunityExperience) || [];
  const educationExperiences =
    notEmptyExperiences?.filter(isEducationExperience) || [];
  const personalExperiences =
    notEmptyExperiences?.filter(isPersonalExperience) || [];
  const workExperiences = notEmptyExperiences?.filter(isWorkExperience) || [];

  // TODO - complete these
  const skillShowcaseUrl = "#";
  const behaviouralSkillLibraryUrl = "#"; // Behavioural skill library links to the page_with_curl Create the "Skill library" page #6936 and scrolls the user to the relevant page section title
  const technicalSkillLibraryUrl = "#"; // Technical skill library links to the page_with_curl Create the "Skill library" page #6936 and scrolls the user to the relevant page section title
  const behaviouralSkillShowcaseUrl = "#"; // Behavioural skill showcase links to the eventual Skill showcase page and scrolls the user to the relevant page section title
  const technicalSkillShowcaseUrl = "#"; // Technical skill showcase links to the eventual Skill showcase page and scrolls the user to the relevant page section title
  const typesOfWorkInterestUrl = "#"; // Types of work of interest links to the eventual Skill showcase page and scrolls the user to the relevant page section title
  const skillCredentialsUrl = "#"; // Skill credentials links to the eventual Skill showcase page and scrolls the user to the relevant page section title
  const behaviouralSkillLibraryCount = 0;
  const technicalSkillLibraryCount = 0;
  const typesOfWorkInterestCount = 0;
  const skillCredentialsCount = 0;
  // The completion states are determined by the following rules:
  //   The skill library items need to have at least 1 skill
  //   The showcase items need to have at least 1 skill added to each of the 4 showcases
  const behaviouralSkillLibraryStatus = "success";
  const technicalSkillLibraryStatus = "success";
  const behaviouralSkillShowcaseStatus = "success";
  const technicalSkillShowcaseStatus = "success";

  return (
    <Hero
      centered
      title={intl.formatMessage(
        {
          defaultMessage: "Welcome back, {firstName}",
          id: "Q/f5AF",
          description:
            "Title displayed in the hero section of the Search page.",
        },
        {
          firstName: user.firstName,
        },
      )}
      subtitle={intl.formatMessage(
        {
          defaultMessage:
            // TODO: split résumé and skills into two separate links when the sections exist
            "Manage your <a1>profile</a1>, <a2>résumé, skills</a2>, and <a3>track applications</a3>.",
          id: "zJHMt9",
          description: "Subtitle for profile and applications hero",
        },
        {
          a1: (chunks: React.ReactNode) =>
            buildLink(paths.profile(user.id), chunks, "white"),
          a2: (chunks: React.ReactNode) =>
            buildLink(paths.resumeAndRecruitment(user.id), chunks, "white"),
          a3: (chunks: React.ReactNode) =>
            buildScrollToLink("track-applications-section", chunks, "white"),
        },
      )}
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
                  "When you log into your account, you'll start on this page from now on. You can use the <strong><a>Track your applications</a></strong> section on this page to review your application to the IT Apprenticeship Program for Indigenous Peoples and track your position in the program.",
                id: "Z9wBwT",
                description:
                  "Third paragraph for profile and applications notification welcoming an IAP user",
              },
              {
                a: (chunks: React.ReactNode) =>
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
                  "When you log into your account, you'll start on this page from now on. You can use the <strong><a>Track your applications</a></strong> section on this page to review your application to the IT Apprenticeship Program for Indigenous Peoples and track your status in the program.",
                id: "vYvmxq",
                description:
                  "Third paragraph for profile and applications notification welcoming an IAP user",
              },
              {
                a: (chunks: React.ReactNode) =>
                  buildScrollToLink("track-applications-section", chunks),
              },
            )}
          </p>
        </Alert.Root>
      )}
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        {...(skillLibraryFlag
          ? {
              "data-h2-grid-template-columns":
                "base(100%) l-tablet(repeat(3, minmax(0, 1fr)))",
            }
          : {
              "data-h2-grid-template-columns":
                "base(100%) p-tablet(repeat(2, minmax(0, 1fr)))",
            })}
      >
        <HeroCard
          asNav
          color="secondary"
          title={intl.formatMessage({
            defaultMessage: "Profile information",
            id: "zd/ve4",
            description: "Profile and applications card title for profile card",
          })}
          href={paths.profile(user.id)}
        >
          <StatusItem
            asListItem
            title={intl.formatMessage({
              defaultMessage: "Personal and contact info",
              id: "b0fN+P",
              description: "Title of the About link section",
            })}
            status={
              aboutSectionHasEmptyRequiredFields(user) ? "error" : "success"
            }
            href={paths.profile(user.id, PROFILE_PAGE_SECTION_ID.ABOUT)}
          />

          <StatusItem
            asListItem
            title={intl.formatMessage({
              defaultMessage: "Work preferences",
              id: "Pf+PA/",
              description: "Title of the Work Location link section",
            })}
            status={
              workLocationSectionHasEmptyRequiredFields(user) ||
              workPreferencesSectionHasEmptyRequiredFields(user)
                ? "error"
                : "success"
            }
            href={paths.profile(
              user.id,
              PROFILE_PAGE_SECTION_ID.WORK_PREFERENCES,
            )}
          />

          <StatusItem
            asListItem
            title={intl.formatMessage({
              defaultMessage: "Diversity, equity, inclusion",
              id: "HAkMnl",
              description:
                "Title of the Diversity, equity and inclusion link section",
            })}
            href={paths.profile(user.id, PROFILE_PAGE_SECTION_ID.DEI)}
            icon={UserGroupIcon}
          />
          <StatusItem
            asListItem
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
            href={paths.profile(user.id, PROFILE_PAGE_SECTION_ID.GOVERNMENT)}
          />

          <StatusItem
            asListItem
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
            href={paths.profile(user.id, PROFILE_PAGE_SECTION_ID.LANGUAGE)}
          />
          {
            /* enable in #6772 */
            false && (
              <StatusItem
                asListItem
                title={intl.formatMessage({
                  defaultMessage: "Account and privacy settings",
                  id: "O+Lj1u",
                  description:
                    "Title of the Account and privacy settings link section",
                })}
                href={paths.profile(
                  user.id,
                  // this section doesn't exist yet
                  PROFILE_PAGE_SECTION_ID.ACCOUNT_AND_PRIVACY,
                )}
                icon={LockClosedIcon}
              />
            )
          }
        </HeroCard>
        <HeroCard
          color="tertiary"
          title={intl.formatMessage({
            defaultMessage: "Résumé and recruitments",
            id: "FSViGC",
            description: "Profile and applications card title for résumé card",
          })}
          href={paths.resumeAndRecruitment(user.id)}
        >
          <StatusItem
            title={intl.formatMessage({
              defaultMessage: "Work experiences",
              id: "LOmX3T",
              description: "Title for work experience section",
            })}
            itemCount={workExperiences?.length}
            icon={BriefcaseIcon}
          />
          <StatusItem
            title={intl.formatMessage({
              defaultMessage: "Education and certificates",
              id: "PFoM2I",
              description: "Title for education experience section",
            })}
            itemCount={educationExperiences?.length}
            icon={BookOpenIcon}
          />
          <StatusItem
            title={intl.formatMessage({
              defaultMessage: "Community participation",
              id: "Uy5Dg2",
              description: "Title for community experience section",
            })}
            itemCount={communityExperiences?.length}
            icon={UsersIcon}
          />
          <StatusItem
            title={intl.formatMessage({
              defaultMessage: "Personal learning",
              id: "UDMUHH",
              description: "Title for personal experience section",
            })}
            itemCount={personalExperiences?.length}
            icon={LightBulbIcon}
          />
          <StatusItem
            title={intl.formatMessage({
              defaultMessage: "Awards and recognition",
              id: "mWnekb",
              description: "Title for award section",
            })}
            itemCount={awardExperiences?.length}
            icon={StarIcon}
          />
          <StatusItem
            title={intl.formatMessage({
              defaultMessage: "Qualified recruitments",
              id: "2dpDPq",
              description: "Title for qualified recruitments section",
            })}
            itemCount={
              notEmptyApplications.filter(isApplicationQualifiedRecruitment)
                .length
            }
            icon={ShieldCheckIcon}
            href={paths.resumeAndRecruitment(user.id, {
              section:
                RESUME_AND_RECRUITMENTS_PAGE_SECTION_ID.QUALIFIED_RECRUITMENT_PROCESSES,
            })}
          />
        </HeroCard>
        {skillLibraryFlag ? (
          <HeroCard
            color="quaternary"
            title={intl.formatMessage({
              defaultMessage: "Skill showcase",
              id: "OXyqf7",
              description: "applicant dashboard card title for skill showcase",
            })}
            href={skillShowcaseUrl}
          >
            <StatusItem
              title={intl.formatMessage({
                defaultMessage: "Behavioural skill library",
                id: "yzqnvb",
                description: "Title for behavioural skill library section",
              })}
              itemCount={behaviouralSkillLibraryCount}
              status={behaviouralSkillLibraryStatus}
              href={behaviouralSkillLibraryUrl}
            />
            <StatusItem
              title={intl.formatMessage({
                defaultMessage: "Technical skill library",
                id: "FEK54g",
                description: "Title for technical skill library section",
              })}
              itemCount={technicalSkillLibraryCount}
              status={technicalSkillLibraryStatus}
              href={technicalSkillLibraryUrl}
            />
            <StatusItem
              title={intl.formatMessage({
                defaultMessage: "Behavioural skill showcase",
                id: "qxRpIs",
                description: "Title for behavioural skill showcase section",
              })}
              status={behaviouralSkillShowcaseStatus}
              href={behaviouralSkillShowcaseUrl}
            />
            <StatusItem
              title={intl.formatMessage({
                defaultMessage: "Technical skill showcase",
                id: "tgG8VK",
                description: "Title for technical skill showcase section",
              })}
              status={technicalSkillShowcaseStatus}
              href={technicalSkillShowcaseUrl}
            />
            <StatusItem
              title={intl.formatMessage({
                defaultMessage: "Types of work of interest",
                id: "3Ix4Rz",
                description: "Title for types of work of interest section",
              })}
              itemCount={typesOfWorkInterestCount}
              icon={BeakerIcon}
              href={typesOfWorkInterestUrl}
            />
            <StatusItem
              title={intl.formatMessage({
                defaultMessage: "Skill credentials",
                id: "KSH0Di",
                description: "Title for skill credentials section",
              })}
              itemCount={skillCredentialsCount}
              icon={ShieldCheckIcon}
              href={skillCredentialsUrl}
            />
          </HeroCard>
        ) : null}
      </div>
    </Hero>
  );
};

export default DashboardHeading;
