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

import { notEmpty } from "@gc-digital-talent/helpers";
import { Alert, Link, ScrollToLink } from "@gc-digital-talent/ui";

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
import { PartialUser } from "../types";

function buildLink(href: string, chunks: React.ReactNode): React.ReactElement {
  return <Link href={href}>{chunks}</Link>;
}
function buildScrollToLink(
  to: string,
  chunks: React.ReactNode,
): React.ReactElement {
  return <ScrollToLink to={to}>{chunks}</ScrollToLink>;
}
export interface DashboardHeadingProps {
  user: PartialUser;
}

const DashboardHeading = ({ user }: DashboardHeadingProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const [searchParams, setSearchParams] = useSearchParams();

  const notEmptyExperiences = user.experiences?.filter(notEmpty);

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
          id: "vBTn/n",
          description: "Subtitle for applicant dashboard hero",
        },
        {
          a1: (chunks: React.ReactNode) =>
            buildLink(paths.profile(user.id), chunks),
          a2: (chunks: React.ReactNode) =>
            buildLink(paths.skillsAndExperiences(user.id), chunks),
          a3: (chunks: React.ReactNode) =>
            buildScrollToLink("track-applications-section", chunks),
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
                "Welcome to your Digital Talent profile dashboard",
              id: "kBEXbF",
              description:
                "Title for notification that a draft IAP application was saved",
            })}
          </Alert.Title>
          <p data-h2-margin-bottom="base(x0.5)">
            {intl.formatMessage({
              defaultMessage:
                "Are you looking for your application to the IT Apprenticeship Program for Indigenous Peoples?",
              id: "gJpWLM",
              description:
                "First paragraph for applicant dashboard notification welcoming an IAP user",
            })}
          </p>
          <p data-h2-margin-bottom="base(x0.5)">
            {intl.formatMessage({
              defaultMessage:
                "The apprenticeship program is a part of a larger digital talent initiative in the Government of Canada that aspires to recruit awesome digital talent like yourself. This profile provides access to other digital opportunities and recruitments beyond the apprenticeship program, if you choose to apply. If you’d prefer to stick to the apprenticeship program exclusively, that’s okay too!",
              id: "+im7hW",
              description:
                "Second paragraph for applicant dashboard notification welcoming an IAP user",
            })}
          </p>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "When you log into your account, you’ll start on this page from now on. You can use the <strong><a>Track your applications</a></strong> section on this page to review your Indigenous apprenticeship application and track your position in the program.",
                id: "KUVXJr",
                description:
                  "Third paragraph for applicant dashboard notification welcoming an IAP user",
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
                "You’ve now landed on your Digital Talent profile page.",
              id: "ueLK1P",
              description:
                "First paragraph for applicant dashboard notification welcoming an IAP user",
            })}
          </p>
          <p data-h2-margin-bottom="base(x0.5)">
            {intl.formatMessage({
              defaultMessage:
                "The apprenticeship program is a part of a larger digital talent initiative in the Government of Canada that aspires to recruit awesome digital talent like yourself. This profile provides access to other digital opportunities and recruitments beyond the apprenticeship program, if you choose to apply. If you’d prefer to stick to the apprenticeship program exclusively, that’s okay too!",
              id: "+im7hW",
              description:
                "Second paragraph for applicant dashboard notification welcoming an IAP user",
            })}
          </p>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "When you log into your account, you’ll start on this page from now on. You can use the <strong><a>Track your applications</a></strong> section on this page to review your Indigenous apprenticeship application and track your status in the program.",
                id: "RzNVWf",
                description:
                  "Third paragraph for applicant dashboard notification welcoming an IAP user",
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
        data-h2-grid-template-columns="base(100%) l-tablet(repeat(2, minmax(0, 1fr)))"
        data-h2-gap="base(x1)"
      >
        <HeroCard
          asNav
          color="secondary"
          title={intl.formatMessage({
            defaultMessage: "Profile information",
            id: "gTjLic",
            description: "applicant dashboard card title for profile card",
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
        </HeroCard>
        <HeroCard
          color="tertiary"
          title={intl.formatMessage({
            defaultMessage: "Résumé and recruitments",
            id: "Ori6s+",
            description: "applicant dashboard card title for résumé card",
          })}
          href={paths.skillsAndExperiences(user.id)}
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
            itemCount={0}
            icon={ShieldCheckIcon}
            scrollTo="qualified-recruitments-section"
          />
        </HeroCard>
      </div>
    </Hero>
  );
};

export default DashboardHeading;
