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

export function buildTypeSections(
  experiences: ExperienceItem[],
  intl: IntlShape,
) {
  const experienceSections: AccordionSection[] = [
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

  return experienceSections;
}

export function buildWorkStreamSections(
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

  const experienceSections: AccordionSection[] = workStreamsAndTheirExperiences
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

  const footer = (
    <>
      <p data-h2-font-weight="base(bold)" data-h2-margin-bottom="base(x.15)">
        {intl.formatMessage({
          defaultMessage: "Work streams with no experience",
          id: "PNTlS7",
          description:
            "a description for a list of work streams with no experiences",
        })}
      </p>
      <ul>
        {workStreamsWithNoExperiences.map((workStream) => (
          <li key={workStream.id} data-h2-margin-bottom="base(x.15)">
            {workStream.name?.localized ??
              intl.formatMessage(commonMessages.notProvided)}
          </li>
        ))}
      </ul>
    </>
  );

  return {
    experienceSections,
    footer,
  };
}
