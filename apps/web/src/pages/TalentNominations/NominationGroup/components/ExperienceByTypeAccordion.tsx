import { useIntl } from "react-intl";

import { Accordion } from "@gc-digital-talent/ui";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  AwardExperience,
  FragmentType,
  getFragment,
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

import { FullCareerExperiences_Fragment } from "./FullCareerExperiences";

interface ExperienceByTypeAccordionProps {
  query: FragmentType<typeof FullCareerExperiences_Fragment>;
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
  const fragment = getFragment(FullCareerExperiences_Fragment, query);
  const experiences = fragment.experiences?.filter(notEmpty) ?? [];

  const experienceSections = [
    {
      id: "WorkExperience",
      title: intl.formatMessage(experienceMessages.work),
      experiences:
        experiences.filter(isWorkExperience).sort(compareByDate) ?? [],
    },
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
    },
    {
      id: "CommunityExperience",
      title: intl.formatMessage(experienceMessages.community),
      experiences:
        experiences.filter(isCommunityExperience).sort(compareByDate) ?? [],
    },
    {
      id: "EducationExperience",
      title: intl.formatMessage(experienceMessages.education),
      experiences:
        experiences.filter(isEducationExperience).sort(compareByDate) ?? [],
    },
    {
      id: "PersonalExperience",
      title: intl.formatMessage(experienceMessages.personal),
      experiences:
        experiences.filter(isPersonalExperience).sort(compareByDate) ?? [],
    },
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
                    sectionExperiences?.map((experience) => {
                      return (
                        <ExperienceCard
                          key={experience?.id}
                          experience={experience}
                          showEdit={false}
                        />
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
