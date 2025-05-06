import { useIntl } from "react-intl";

import { Accordion } from "@gc-digital-talent/ui";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  AwardExperience,
  ExperienceByTypeAccordionFragment,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";

import {
  compareByDate,
  isAwardExperience,
  isCommunityExperience,
  isEducationExperience,
  isPersonalExperience,
  isWorkExperience,
} from "~/utils/experienceUtils";
import ExperienceCard from "~/components/ExperienceCard/ExperienceCard";
import experienceMessages from "~/messages/experienceMessages";
import { AnyExperience } from "~/types/experience";

export const ExperienceByTypeAccordion_Fragment = graphql(/* GraphQL */ `
  fragment ExperienceByTypeAccordion on User {
    experiences {
      id
      ...ExperienceCard
    }
  }
`);

interface AccordionSection {
  id: NonNullable<AnyExperience["__typename"]>;
  title: string;
  experiences: NonNullable<
    NonNullable<ExperienceByTypeAccordionFragment["experiences"]>[number]
  >[];
}

interface ExperienceByTypeAccordionProps {
  query: FragmentType<typeof ExperienceByTypeAccordion_Fragment>;
  openSections: string[];
  defaultOpen?: boolean;
  setOpenSections: (sections: string[]) => void;
}

const ExperienceByTypeAccordion = ({
  query,
  openSections: expandedItems,
  setOpenSections,
}: ExperienceByTypeAccordionProps) => {
  const intl = useIntl();
  const data = getFragment(ExperienceByTypeAccordion_Fragment, query);
  const experiences = data.experiences?.filter(notEmpty) ?? [];

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

  return (
    <Accordion.Root
      type="multiple"
      mode="card"
      value={expandedItems}
      onValueChange={setOpenSections} // Sync state with Accordion
      data-h2-margin="base(0, 0)"
    >
      {experienceSections.map(
        ({ id, title, experiences: sectionExperiences }) => (
          <Accordion.Item key={id} value={id}>
            <Accordion.Trigger>
              {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
              {title} ({sectionExperiences.length})
            </Accordion.Trigger>
            <Accordion.Content>
              <div>
                <div
                  data-h2-display="base(flex)"
                  data-h2-flex-direction="base(column)"
                  data-h2-gap="base(x.5 0)"
                >
                  {unpackMaybes(
                    sectionExperiences.map((experience) => {
                      return (
                        <>
                          {JSON.stringify(experience)}
                          <ExperienceCard
                            key={experience?.id}
                            experience={experience}
                            showEdit={false}
                          />
                        </>
                      );
                    }),
                  )}
                </div>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        ),
      )}
    </Accordion.Root>
  );
};

export default ExperienceByTypeAccordion;
