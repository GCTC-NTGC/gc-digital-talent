import { TreeView } from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";

import ExperienceCard from "../ExperienceCard/ExperienceCard";

export const ExperienceTreeItems_Fragment = graphql(/** GraphQL */ `
  fragment ExperienceTreeItems on Experience {
    id
    ...ExperienceCard
  }
`);

interface ExperienceTreeItemsProps {
  experiencesQuery: FragmentType<typeof ExperienceTreeItems_Fragment>[];
}

const ExperienceTreeItems = ({
  experiencesQuery,
}: ExperienceTreeItemsProps) => {
  const experiences = getFragment(
    ExperienceTreeItems_Fragment,
    experiencesQuery,
  );

  return (
    <>
      {experiences.length
        ? experiences.map((experience) => (
            <TreeView.Item key={experience.id}>
              <ExperienceCard
                key={experience.id}
                experienceQuery={experience}
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
