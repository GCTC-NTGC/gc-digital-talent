import { TreeView } from "@gc-digital-talent/ui";
import { Experience } from "@gc-digital-talent/graphql";

import ExperienceCard from "../ExperienceCard/ExperienceCard";

interface ExperienceTreeItemsProps {
  experiences: Omit<Experience, "user">[];
}

const ExperienceTreeItems = ({ experiences }: ExperienceTreeItemsProps) => {
  return (
    <>
      {experiences.length
        ? experiences.map((experience) => (
            <TreeView.Item key={experience.id}>
              <ExperienceCard
                key={experience.id}
                experience={experience}
                headingLevel="h3"
                showSkills={false}
                showEdit={false}
              />
            </TreeView.Item>
          ))
        : null}
    </>
  );
};

export default ExperienceTreeItems;
