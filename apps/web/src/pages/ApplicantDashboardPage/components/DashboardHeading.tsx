import * as React from "react";
import { useIntl } from "react-intl";
import {
  BriefcaseIcon,
  BookOpenIcon,
  UsersIcon,
  LightBulbIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

import { User } from "@gc-digital-talent/graphql";

import Hero from "~/components/Hero/Hero";
import useRoutes from "~/hooks/useRoutes";
import { HeroCard } from "./HeroCard";
import {
  HeroCardExperienceItem,
  HeroCardProfileItem,
  ProfileItemStatus,
} from "./HeroCardItem";
import {
  hasEmptyRequiredFields as aboutSectionHasEmptyRequiredFields,
  hasEmptyOptionalFields as aboutSectionHasEmptyOptionalFields,
} from "../../../components/UserProfile/ProfileSections/AboutSection";
import {
  hasEmptyRequiredFields as languageInformationSectionHasEmptyRequiredFields,
  hasEmptyOptionalFields as languageInformationSectionHasEmptyOptionalFields,
} from "../../../components/UserProfile/ProfileSections/LanguageInformationSection";
import {
  hasEmptyRequiredFields as governmentInformationSectionHasEmptyRequiredFields,
  hasEmptyOptionalFields as governmentInformationSectionHasEmptyOptionalFields,
} from "../../../components/UserProfile/ProfileSections/GovernmentInformationSection";
import {
  hasEmptyRequiredFields as workLocationSectionHasEmptyRequiredFields,
  hasEmptyOptionalFields as workLocationSectionHasEmptyOptionalFields,
} from "../../../components/UserProfile/ProfileSections/WorkLocationSection";
import {
  hasEmptyRequiredFields as workPreferencesSectionHasEmptyRequiredFields,
  hasEmptyOptionalFields as workPreferencesSectionHasEmptyOptionalFields,
} from "../../../components/UserProfile/ProfileSections/WorkPreferencesSection";
import {
  hasEmptyRequiredFields as diversityEquityInclusionSectionHasEmptyRequiredFields,
  hasEmptyOptionalFields as diversityEquityInclusionSectionHasEmptyOptionalFields,
} from "../../../components/UserProfile/ProfileSections/DiversityEquityInclusionSection";

export interface DashboardHeadingProps {
  user: User;
}

export const DashboardHeading = ({ user }: DashboardHeadingProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  function deriveSectionStatus(
    isMissingRequiredFields: boolean,
    isMissingOptionalFields: boolean,
  ): ProfileItemStatus {
    if (isMissingRequiredFields) return "has-empty-required-fields";
    if (isMissingOptionalFields) return "has-empty-optional-fields";
    return "all-sections-complete";
  }

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
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(row)"
        data-h2-justify-content="base(space-evenly)"
        data-h2-gap="base(x1)"
      >
        <HeroCard
          ariaRole="navigation"
          color="secondary"
          title={intl.formatMessage({
            defaultMessage: "My profile information",
            id: "XvfBqb",
            description: "applicant dashboard card title for profile card",
          })}
          href={paths.profile(user.id)}
        >
          <HeroCardProfileItem
            sectionName={intl.formatMessage({
              defaultMessage: "About me",
              id: "sqQgmS",
              description:
                "applicant dashboard card section name for the 'about me' profile section",
            })}
            status={deriveSectionStatus(
              aboutSectionHasEmptyRequiredFields(user),
              aboutSectionHasEmptyOptionalFields(user),
            )}
            href={paths.aboutMe(user.id)}
          />

          <HeroCardProfileItem
            sectionName={intl.formatMessage({
              defaultMessage: "Language information",
              id: "u8bR0p",
              description:
                "applicant dashboard card section name for the 'language information' profile section",
            })}
            status={deriveSectionStatus(
              languageInformationSectionHasEmptyRequiredFields(user),
              languageInformationSectionHasEmptyOptionalFields(user),
            )}
            href={paths.languageInformation(user.id)}
          />

          <HeroCardProfileItem
            sectionName={intl.formatMessage({
              defaultMessage: "Government information",
              id: "DKDv8/",
              description:
                "applicant dashboard card section name for the 'government information' profile section",
            })}
            status={deriveSectionStatus(
              governmentInformationSectionHasEmptyRequiredFields(user),
              governmentInformationSectionHasEmptyOptionalFields(user),
            )}
            href={paths.governmentInformation(user.id)}
          />
          <HeroCardProfileItem
            sectionName={intl.formatMessage({
              defaultMessage: "Work location",
              id: "Tsgge3",
              description:
                "applicant dashboard card section name for the 'work location' profile section",
            })}
            status={deriveSectionStatus(
              workLocationSectionHasEmptyRequiredFields(user),
              workLocationSectionHasEmptyOptionalFields(user),
            )}
            href={paths.workLocation(user.id)}
          />

          <HeroCardProfileItem
            sectionName={intl.formatMessage({
              defaultMessage: "Work preferences",
              id: "zj1jRy",
              description:
                "applicant dashboard card section name for the 'work preferences' profile section",
            })}
            status={deriveSectionStatus(
              workPreferencesSectionHasEmptyRequiredFields(user),
              workPreferencesSectionHasEmptyOptionalFields(user),
            )}
            href={paths.workPreferences(user.id)}
          />
          <HeroCardProfileItem
            sectionName={intl.formatMessage({
              defaultMessage: "Diversity, equity, and inclusion",
              id: "bvNo9B",
              description:
                "applicant dashboard card section name for the 'diversity, equity inclusion' profile section",
            })}
            status={deriveSectionStatus(
              diversityEquityInclusionSectionHasEmptyRequiredFields(user),
              diversityEquityInclusionSectionHasEmptyOptionalFields(user),
            )}
            href={paths.diversityEquityInclusion(user.id)}
          />
        </HeroCard>
        <HeroCard
          ariaRole="navigation"
          color="tertiary"
          title={intl.formatMessage({
            defaultMessage: "My résumé and experience",
            id: "naaQ+q",
            description: "applicant dashboard card title for résumé card",
          })}
          href={paths.skillsAndExperiences(user.id)}
        >
          <HeroCardExperienceItem
            sectionName={intl.formatMessage({
              defaultMessage: "Work experience",
              id: "W8jG78",
              description:
                "applicant dashboard card section name for work experiences",
            })}
            itemCount={user.workExperiences?.length}
            icon={BriefcaseIcon}
          />
          <HeroCardExperienceItem
            sectionName={intl.formatMessage({
              defaultMessage: "Education experience",
              id: "Fyn0LW",
              description:
                "applicant dashboard card section name for education experiences",
            })}
            itemCount={user.educationExperiences?.length}
            icon={BookOpenIcon}
          />
          <HeroCardExperienceItem
            sectionName={intl.formatMessage({
              defaultMessage: "Community experience",
              id: "tZjWCz",
              description:
                "applicant dashboard card section name for community experiences",
            })}
            itemCount={user.communityExperiences?.length}
            icon={UsersIcon}
          />
          <HeroCardExperienceItem
            sectionName={intl.formatMessage({
              defaultMessage: "Personal experience",
              id: "uHUKNz",
              description:
                "applicant dashboard card section name for personal experiences",
            })}
            itemCount={user.personalExperiences?.length}
            icon={LightBulbIcon}
          />
          <HeroCardExperienceItem
            sectionName={intl.formatMessage({
              defaultMessage: "Awards",
              id: "xi/PTs",
              description: "applicant dashboard card section name for awards",
            })}
            itemCount={user.awardExperiences?.length}
            icon={StarIcon}
          />
        </HeroCard>
      </div>
    </Hero>
  );
};

export default DashboardHeading;
