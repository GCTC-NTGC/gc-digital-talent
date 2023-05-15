import * as React from "react";
import { useIntl } from "react-intl";
import BriefcaseIcon from "@heroicons/react/24/solid/BriefcaseIcon";
import BookOpenIcon from "@heroicons/react/24/solid/BookOpenIcon";
import UsersIcon from "@heroicons/react/24/solid/UsersIcon";
import LightBulbIcon from "@heroicons/react/24/solid/LightBulbIcon";
import StarIcon from "@heroicons/react/24/solid/StarIcon";

import Hero from "~/components/Hero/Hero";
import useRoutes from "~/hooks/useRoutes";
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
import {
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "~/utils/experienceUtils";

import { AwardExperience } from "~/api/generated";
import { notEmpty } from "@gc-digital-talent/helpers";
import {
  HeroCardExperienceItem,
  HeroCardProfileItem,
  ProfileItemStatus,
} from "./HeroCardItem";
import { HeroCard } from "./HeroCard";

import { PartialUser } from "../types";

function deriveSectionStatus(
  isMissingRequiredFields: boolean,
  isMissingOptionalFields: boolean,
): ProfileItemStatus {
  if (isMissingRequiredFields) return "has-empty-required-fields";
  if (isMissingOptionalFields) return "has-empty-optional-fields";
  return "all-sections-complete";
}

export interface DashboardHeadingProps {
  user: PartialUser;
}

const DashboardHeading = ({ user }: DashboardHeadingProps) => {
  const intl = useIntl();
  const paths = useRoutes();

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
          <HeroCardProfileItem
            sectionName={intl.formatMessage({
              defaultMessage: "About Me",
              id: "4sJvia",
              description: "Title of the About link section",
            })}
            status={deriveSectionStatus(
              aboutSectionHasEmptyRequiredFields(user),
              aboutSectionHasEmptyOptionalFields(user),
            )}
            href={paths.aboutMe(user.id)}
          />

          <HeroCardProfileItem
            sectionName={intl.formatMessage({
              defaultMessage: "Language Information",
              id: "B9x0ZV",
              description: "Title of the Language Information link section",
            })}
            status={deriveSectionStatus(
              languageInformationSectionHasEmptyRequiredFields(user),
              languageInformationSectionHasEmptyOptionalFields(user),
            )}
            href={paths.languageInformation(user.id)}
          />

          <HeroCardProfileItem
            sectionName={intl.formatMessage({
              defaultMessage: "Government Information",
              id: "Nc4sjC",
              description: "Title of the Government Information link section",
            })}
            status={deriveSectionStatus(
              governmentInformationSectionHasEmptyRequiredFields(user),
              governmentInformationSectionHasEmptyOptionalFields(user),
            )}
            href={paths.governmentInformation(user.id)}
          />
          <HeroCardProfileItem
            sectionName={intl.formatMessage({
              defaultMessage: "Work Location",
              id: "9WxeNz",
              description: "Title of the Work Location link section",
            })}
            status={deriveSectionStatus(
              workLocationSectionHasEmptyRequiredFields(user),
              workLocationSectionHasEmptyOptionalFields(user),
            )}
            href={paths.workLocation(user.id)}
          />

          <HeroCardProfileItem
            sectionName={intl.formatMessage({
              defaultMessage: "Work Preferences",
              id: "0DzlCc",
              description: "Title of the Work Preferences link section",
            })}
            status={deriveSectionStatus(
              workPreferencesSectionHasEmptyRequiredFields(user),
              workPreferencesSectionHasEmptyOptionalFields(user),
            )}
            href={paths.workPreferences(user.id)}
          />
          <HeroCardProfileItem
            sectionName={intl.formatMessage({
              defaultMessage: "Diversity, equity and inclusion",
              id: "e2R6fy",
              description:
                "Title of the Diversity, equity and inclusion link section",
            })}
            status={deriveSectionStatus(
              diversityEquityInclusionSectionHasEmptyRequiredFields(user),
              diversityEquityInclusionSectionHasEmptyOptionalFields(user),
            )}
            href={paths.diversityEquityInclusion(user.id)}
          />
          <HeroCardProfileItem
            sectionName={intl.formatMessage({
              defaultMessage: "Role and salary expectations",
              id: "95OYVk",
              description:
                "Title of the Role and salary expectations link section",
            })}
            status={deriveSectionStatus(
              roleSalarySectionHasEmptyRequiredFields(user),
              roleSalarySectionHasEmptyOptionalFields(user),
            )}
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
          <HeroCardExperienceItem
            sectionName={intl.formatMessage({
              defaultMessage: "Work experience",
              id: "giUfys",
              description: "Title for work experience section",
            })}
            itemCount={workExperiences?.length}
            icon={BriefcaseIcon}
            color="primary"
          />
          <HeroCardExperienceItem
            sectionName={intl.formatMessage({
              defaultMessage: "Education experience",
              id: "u6LIbY",
              description: "Title for education experience section",
            })}
            itemCount={educationExperiences?.length}
            icon={BookOpenIcon}
            color="secondary"
          />
          <HeroCardExperienceItem
            sectionName={intl.formatMessage({
              defaultMessage: "Volunteer and community experience",
              id: "Rz7WtH",
              description: "Title for community experience section",
            })}
            itemCount={communityExperiences?.length}
            icon={UsersIcon}
            color="tertiary"
          />
          <HeroCardExperienceItem
            sectionName={intl.formatMessage({
              defaultMessage: "Personal experience",
              id: "wTFUPE",
              description: "Title for personal experience section",
            })}
            itemCount={personalExperiences?.length}
            icon={LightBulbIcon}
            color="quaternary"
          />
          <HeroCardExperienceItem
            sectionName={intl.formatMessage({
              defaultMessage: "Award",
              id: "+ikQY0",
              description: "Title for award section",
            })}
            itemCount={awardExperiences?.length}
            icon={StarIcon}
            color="quinary"
          />
        </HeroCard>
      </div>
    </Hero>
  );
};

export default DashboardHeading;
