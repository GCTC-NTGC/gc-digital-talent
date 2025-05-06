import { IntlShape } from "react-intl";

import {
  AwardExperience,
  FullCareerExperiencesFragment,
} from "@gc-digital-talent/graphql";

import experienceMessages from "~/messages/experienceMessages";
import { AnyExperience } from "~/types/experience";
import {
  compareByDate,
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "~/utils/experienceUtils";

type ExperienceItem = NonNullable<
  NonNullable<FullCareerExperiencesFragment["experiences"]>[number]
>;

interface AccordionSection {
  id: NonNullable<AnyExperience["__typename"]>;
  title: string;
  experiences: NonNullable<
    NonNullable<FullCareerExperiencesFragment["experiences"]>[number]
  >[];
}

export function buildExperienceByTypeSections(
  experiences: ExperienceItem[],
  intl: IntlShape,
) {
  const experienceSections: AccordionSection[] = [
    {
      id: "WorkExperience",
      title: intl.formatMessage(experienceMessages.work),
      experiences:
        experiences.filter(isWorkExperience).sort(compareByDate) ?? [],
    } as const,
    {
      id: "AwardExperience",
      title: intl.formatMessage(experienceMessages.award),
      experiences:
        experiences
          .filter(isAwardExperience)
          .map(
            (award: Omit<AwardExperience, "user">) =>
              ({
                ...award,
                startDate: award.awardedDate,
                endDate: award.awardedDate,
              }) as AwardExperience & { startDate: string; endDate: string },
          )
          .sort(compareByDate) ?? [],
    } as const,
    {
      id: "CommunityExperience",
      title: intl.formatMessage(experienceMessages.community),
      experiences:
        experiences.filter(isCommunityExperience).sort(compareByDate) ?? [],
    } as const,
    {
      id: "EducationExperience",
      title: intl.formatMessage(experienceMessages.education),
      experiences:
        experiences.filter(isEducationExperience).sort(compareByDate) ?? [],
    } as const,
    {
      id: "PersonalExperience",
      title: intl.formatMessage(experienceMessages.personal),
      experiences:
        experiences.filter(isPersonalExperience).sort(compareByDate) ?? [],
    } as const,
  ].filter((e) => e.experiences.length > 0);

  return experienceSections;
}
