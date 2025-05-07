import { IntlShape } from "react-intl";

import {
  AwardExperience,
  FullCareerExperiencesFragment,
  FullCareerExperiencesOptionsFragment,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import experienceMessages from "~/messages/experienceMessages";
import {
  compareByDate,
  experiencesDurationMonths,
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "~/utils/experienceUtils";

// turn a duration in months to a localized subtitle string
function durationMonthsToSubtitle(
  durationMonths: number,
  intl: IntlShape,
): string {
  const yearCount = Math.floor(durationMonths / 12);
  const monthCount = durationMonths % 12;

  if (yearCount > 0) {
    return intl.formatMessage(
      {
        defaultMessage:
          "{yearCount, plural, =1 {# year} other {# years}}, {monthCount, plural, =1 {# month} other {# months}}",
        id: "NWbotz",
        description: "A duration of a certain number of years and months",
      },
      {
        yearCount,
        monthCount,
      },
    );
  }

  return intl.formatMessage(
    {
      defaultMessage: "{monthCount, plural, =1 {# month} other {# months}}",
      id: "+fYyID",
      description: "A duration of a certain number of months",
    },
    {
      monthCount,
    },
  );
}

type ExperienceItem = NonNullable<
  NonNullable<FullCareerExperiencesFragment["experiences"]>[number]
>;

type WorkStreamItem = NonNullable<
  NonNullable<FullCareerExperiencesOptionsFragment["workStreams"]>[number]
>;

export interface AccordionSection {
  id: string;
  title: string;
  subtitle: string | null;
  experiences: ExperienceItem[];
}

// take a list of experiences and organize them into "by experience type" sections
export function buildExperienceByTypeData(
  experiences: ExperienceItem[],
  intl: IntlShape,
) {
  const sections: AccordionSection[] = [
    {
      id: "WorkExperience",
      title: intl.formatMessage(experienceMessages.work),
      subtitle: null,
      experiences:
        experiences.filter(isWorkExperience).sort(compareByDate) ?? [],
    } as const,
    {
      id: "AwardExperience",
      title: intl.formatMessage(experienceMessages.award),
      subtitle: null,
      experiences:
        experiences
          .filter(isAwardExperience)
          .map(
            (awardExperience) =>
              ({
                ...awardExperience,
                startDate: awardExperience.awardedDate,
                endDate: awardExperience.awardedDate,
              }) as AwardExperience & { startDate: string; endDate: string },
          )
          .sort(compareByDate) ?? [],
    } as const,
    {
      id: "CommunityExperience",
      title: intl.formatMessage(experienceMessages.community),
      subtitle: null,
      experiences:
        experiences.filter(isCommunityExperience).sort(compareByDate) ?? [],
    } as const,
    {
      id: "EducationExperience",
      title: intl.formatMessage(experienceMessages.education),
      subtitle: null,
      experiences:
        experiences.filter(isEducationExperience).sort(compareByDate) ?? [],
    } as const,
    {
      id: "PersonalExperience",
      title: intl.formatMessage(experienceMessages.personal),
      subtitle: null,
      experiences:
        experiences.filter(isPersonalExperience).sort(compareByDate) ?? [],
    } as const,
  ].filter((e) => e.experiences.length > 0);

  return {
    sections,
  };
}

// take a list of experiences and work streams and organize them into "by work stream" sections, and a footer of unused work streams
export function buildExperienceByWorkStreamData(
  experiences: ExperienceItem[],
  workStreams: WorkStreamItem[],
  intl: IntlShape,
) {
  const workExperiences = experiences.filter(isWorkExperience);

  const workStreamsAndTheirExperiences = workStreams.map((workStream) => ({
    workStream: workStream,
    experiences: workExperiences.filter((experience) =>
      experience.workStreams?.some(
        (experienceWorkStream) => experienceWorkStream.id == workStream.id,
      ),
    ),
  }));

  const sections: AccordionSection[] = workStreamsAndTheirExperiences
    .filter((bundle) => bundle.experiences.length)
    .map((bundle) => ({
      id: bundle.workStream.id,
      title:
        bundle.workStream.name?.localized ??
        intl.formatMessage(commonMessages.notProvided),
      subtitle: durationMonthsToSubtitle(
        experiencesDurationMonths(bundle.experiences),
        intl,
      ),
      experiences: bundle.experiences,
    }));

  const workStreamsWithNoExperiences = workStreamsAndTheirExperiences
    .filter((bundle) => !bundle.experiences.length)
    .map((bundle) => bundle.workStream);

  workStreamsWithNoExperiences.sort(
    (a, b) => a.name?.localized?.localeCompare(b.name?.localized ?? "") ?? 0,
  );

  return {
    sections,
    workStreamsWithNoExperiences,
  };
}
