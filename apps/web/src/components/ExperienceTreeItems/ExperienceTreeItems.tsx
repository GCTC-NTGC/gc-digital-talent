import React from "react";

import { Accordion, TreeView } from "@gc-digital-talent/ui";

import { Experience } from "~/api/generated";
import ExperienceAccordion from "../ExperienceAccordion/ExperienceAccordion";

interface ExperienceTreeItemsProps {
  experiences: Experience[];
}

const ExperienceTreeItems = ({ experiences }: ExperienceTreeItemsProps) => {
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {experiences.length
        ? experiences.map((experience) => (
            <TreeView.Item key={experience.id}>
              <div data-h2-margin="base(-x.5, 0)">
                <Accordion.Root type="single" collapsible>
                  <ExperienceAccordion
                    key={experience.id}
                    experience={experience}
                    headingLevel="h3"
                    showSkills={false}
                  />
                </Accordion.Root>
              </div>
            </TreeView.Item>
          ))
        : null}
    </>
  );
};

export default ExperienceTreeItems;
