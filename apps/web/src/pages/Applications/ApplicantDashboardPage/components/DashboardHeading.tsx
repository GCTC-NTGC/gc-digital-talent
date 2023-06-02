import * as React from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";

import BriefcaseIcon from "@heroicons/react/20/solid/BriefcaseIcon";
import BookOpenIcon from "@heroicons/react/20/solid/BookOpenIcon";
import UsersIcon from "@heroicons/react/20/solid/UsersIcon";
import LightBulbIcon from "@heroicons/react/20/solid/LightBulbIcon";
import StarIcon from "@heroicons/react/20/solid/StarIcon";
import UserGroupIcon from "@heroicons/react/20/solid/UserGroupIcon";
import { notEmpty } from "@gc-digital-talent/helpers";
import { Alert } from "@gc-digital-talent/ui";

import Hero from "~/components/Hero/Hero";
import useRoutes, {
  FromIapDraftQueryKey,
  FromIapSuccessQueryKey,
} from "~/hooks/useRoutes";
import {
  aboutSectionHasEmptyRequiredFields,
  governmentInformationSectionHasEmptyRequiredFields,
  languageInformationSectionHasEmptyRequiredFields,
  roleSalarySectionHasEmptyRequiredFields,
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
import { navigationMessages } from "@gc-digital-talent/i18n";
import { StatusItem } from "~/components/StatusItem/StatusItem";
import { HeroCard } from "~/components/HeroCard/HeroCard";
import { PartialUser } from "../types";

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
      subtitle={intl.formatMessage({
        defaultMessage:
          "Find new opportunities, update your résumé experience, or track applications.",
        id: "pqrVnW",
        description: "Subtitle for applicant dashboard hero",
      })}
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
                "Your draft application for the IT Apprenticeship Program for Indigenous Peoples has been successfully saved!",
              id: "8HdqmJ",
              description:
                "Title for notification that a draft IAP application was saved",
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
                "The apprenticeship program is a part of a larger digital talent initiative in the Government of Canada that has the hopes of recruiting awesome digital talent like yourself. This profile provides you access to other digital opportunities and recruitments beyond the apprenticeship program, if you choose to apply. If you’d prefer to stick to the apprenticeship program exclusively, that’s okay too!",
              id: "B1Pa0D",
              description:
                "Second paragraph for applicant dashboard notification welcoming an IAP user",
            })}
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "When you log into the account you created, you’ll be taken to this page from now on. You can use this page to review your Indigenous Apprenticeship application and track your position in the program.",
              id: "uSAdtr",
              description:
                "Third paragraph for applicant dashboard notification welcoming an IAP user",
            })}
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
                "The apprenticeship program is a part of a larger digital talent initiative in the Government of Canada that has the hopes of recruiting awesome digital talent like yourself. This profile provides you access to other digital opportunities and recruitments beyond the apprenticeship program, if you choose to apply. If you’d prefer to stick to the apprenticeship program exclusively, that’s okay too!",
              id: "B1Pa0D",
              description:
                "Second paragraph for applicant dashboard notification welcoming an IAP user",
            })}
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "When you log into the account you created, you’ll be taken to this page from now on. You can use this page to review your Indigenous Apprenticeship application and track your position in the program.",
              id: "uSAdtr",
              description:
                "Third paragraph for applicant dashboard notification welcoming an IAP user",
            })}
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
            defaultMessage: "My profile information",
            id: "XvfBqb",
            description: "applicant dashboard card title for profile card",
          })}
          href={paths.profile(user.id)}
        >
          <StatusItem
            asListItem
            title={intl.formatMessage(navigationMessages.aboutMe)}
            status={
              aboutSectionHasEmptyRequiredFields(user) ? "error" : "success"
            }
            href={paths.aboutMe(user.id)}
          />

          <StatusItem
            asListItem
            title={intl.formatMessage(navigationMessages.languageInformation)}
            status={
              languageInformationSectionHasEmptyRequiredFields(user)
                ? "error"
                : "success"
            }
            href={paths.languageInformation(user.id)}
          />

          <StatusItem
            asListItem
            title={intl.formatMessage(navigationMessages.governmentInformation)}
            status={
              governmentInformationSectionHasEmptyRequiredFields(user)
                ? "error"
                : "success"
            }
            href={paths.governmentInformation(user.id)}
          />
          <StatusItem
            asListItem
            title={intl.formatMessage(navigationMessages.workLocation)}
            status={
              workLocationSectionHasEmptyRequiredFields(user)
                ? "error"
                : "success"
            }
            href={paths.workLocation(user.id)}
          />

          <StatusItem
            asListItem
            title={intl.formatMessage(navigationMessages.workPreferences)}
            status={
              workPreferencesSectionHasEmptyRequiredFields(user)
                ? "error"
                : "success"
            }
            href={paths.workPreferences(user.id)}
          />
          <StatusItem
            asListItem
            title={intl.formatMessage(
              navigationMessages.diversityEquityInclusion,
            )}
            href={paths.diversityEquityInclusion(user.id)}
            icon={UserGroupIcon}
          />

          <StatusItem
            asListItem
            title={intl.formatMessage(
              navigationMessages.roleSalaryExpectations,
            )}
            status={
              roleSalarySectionHasEmptyRequiredFields(user)
                ? "error"
                : "success"
            }
            href={paths.roleSalary(user.id)}
          />
        </HeroCard>
        <HeroCard
          color="tertiary"
          title={intl.formatMessage({
            defaultMessage: "My résumé and experience",
            id: "naaQ+q",
            description: "applicant dashboard card title for résumé card",
          })}
          href={paths.skillsAndExperiences(user.id)}
        >
          <StatusItem
            title={intl.formatMessage({
              defaultMessage: "Work experience",
              id: "giUfys",
              description: "Title for work experience section",
            })}
            itemCount={workExperiences?.length}
            icon={BriefcaseIcon}
          />
          <StatusItem
            title={intl.formatMessage({
              defaultMessage: "Education experience",
              id: "u6LIbY",
              description: "Title for education experience section",
            })}
            itemCount={educationExperiences?.length}
            icon={BookOpenIcon}
          />
          <StatusItem
            title={intl.formatMessage({
              defaultMessage: "Volunteer and community experience",
              id: "Rz7WtH",
              description: "Title for community experience section",
            })}
            itemCount={communityExperiences?.length}
            icon={UsersIcon}
          />
          <StatusItem
            title={intl.formatMessage({
              defaultMessage: "Personal experience",
              id: "wTFUPE",
              description: "Title for personal experience section",
            })}
            itemCount={personalExperiences?.length}
            icon={LightBulbIcon}
          />
          <StatusItem
            title={intl.formatMessage({
              defaultMessage: "Award",
              id: "+ikQY0",
              description: "Title for award section",
            })}
            itemCount={awardExperiences?.length}
            icon={StarIcon}
          />
        </HeroCard>
      </div>
    </Hero>
  );
};

export default DashboardHeading;
