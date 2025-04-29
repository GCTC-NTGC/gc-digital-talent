import { useIntl } from "react-intl";

import { Accordion, CardBasic } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Experience } from "@gc-digital-talent/graphql";

import ExperienceCard from "~/components/ExperienceCard/ExperienceCard";

interface ExperienceByTypeAccordionProps {
  experienceSections: {
    id: string;
    title: string;
    experiences: Omit<Experience, "user">[];
  }[];
  expandedItems: string[];
  setExpandedItems: (values: string[]) => void;
  toggleExpandedItem: (id: string) => void;
  isExpanded: (id: string) => boolean;
}

const ExperienceByTypeAccordion = ({
  experienceSections,
  expandedItems,
  setExpandedItems,
  toggleExpandedItem,
  isExpanded,
}: ExperienceByTypeAccordionProps) => {
  const intl = useIntl();

  return (
    <Accordion.Root
      type="multiple"
      mode="card"
      value={expandedItems}
      onValueChange={(values) => setExpandedItems(values)} // Sync state with Accordion
      data-h2-margin="base(0, 0)"
    >
      {experienceSections
        .filter(
          ({ experiences: sectionExperiences }) =>
            sectionExperiences.length > 0,
        )
        .map(({ id, title, experiences: sectionExperiences }) => (
          <Accordion.Item key={`accordion-item-${id}`} value={id}>
            <Accordion.Trigger
              onClick={() => toggleExpandedItem(id)}
              aria-expanded={isExpanded(id)}
            >
              {intl.formatMessage(
                {
                  defaultMessage: "{title} ({count})",
                  id: "Rb4Khk",
                  description: "Title with the count of experiences",
                },
                { title, count: sectionExperiences.length },
              )}
            </Accordion.Trigger>
            <Accordion.Content>
              <CardBasic
                data-h2-padding="base(0 0 0 x.5)"
                data-h2-border-radius="base(0 0 0 x.5)"
                data-h2-background-color="base(white)"
                data-h2-box-shadow="base(0 0 0 x.5)"
              >
                {unpackMaybes(
                  sectionExperiences?.map((experience) => {
                    return (
                      <ExperienceCard
                        key={experience?.id}
                        experience={experience}
                        showEdit={false}
                        isOpen={isExpanded(experience?.id)}
                        onOpenChange={() => toggleExpandedItem(experience?.id)}
                      />
                    );
                  }),
                )}
              </CardBasic>
            </Accordion.Content>
          </Accordion.Item>
        ))}
    </Accordion.Root>
  );
};

export default ExperienceByTypeAccordion;
