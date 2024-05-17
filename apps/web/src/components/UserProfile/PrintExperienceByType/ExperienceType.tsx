import { ReactNode } from "react";

import { Heading } from "@gc-digital-talent/ui";
import { Experience } from "@gc-digital-talent/graphql";

import ExperienceItem from "./ExperienceItem";

interface ExperienceTypeProps {
  title: ReactNode;
  experiences: Experience[];
}

const ExperienceType = ({ title, experiences }: ExperienceTypeProps) => (
  <div>
    <Heading level="h4" className="font-bold">
      {title}
    </Heading>
    {experiences.map((experience) => (
      <ExperienceItem key={experience.id} experience={experience} />
    ))}
  </div>
);

export default ExperienceType;
