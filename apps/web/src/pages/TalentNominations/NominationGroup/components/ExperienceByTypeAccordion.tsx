import { Accordion } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Experience } from "@gc-digital-talent/graphql";

import ExperienceCard from "~/components/ExperienceCard/ExperienceCard";

interface ExperienceByTypeAccordionProps {
  experienceSections: {
    id: string;
    title: string;
    experiences: Omit<Experience, "user">[];
  }[];
  openSections: string[];
  defaultOpen?: boolean;
  setOpenSections: (sections: string[]) => void;
}

const ExperienceByTypeAccordion = ({
  experienceSections,
  openSections: expandedItems,
  setOpenSections,
}: ExperienceByTypeAccordionProps) => {
  return (
    <Accordion.Root
      type="multiple"
      mode="card"
      value={expandedItems}
      onValueChange={setOpenSections} // Sync state with Accordion
      data-h2-margin="base(0, 0)"
    >
      {experienceSections
        .filter(
          ({ experiences: sectionExperiences }) =>
            sectionExperiences.length > 0,
        )
        .map(({ id, title, experiences: sectionExperiences }) => (
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
        ))}
    </Accordion.Root>
  );
};

export default ExperienceByTypeAccordion;
