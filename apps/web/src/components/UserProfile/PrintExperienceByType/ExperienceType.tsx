import React from "react";

import { Experience } from "~/api/generated";

import { Heading } from "@gc-digital-talent/ui";
import ExperienceItem from "./ExperienceItem";

interface ExperienceTypeProps {
  title: React.ReactNode;
  experiences: Experience[];
}

const ExperienceType = ({ title, experiences }: ExperienceTypeProps) => (
  <div>
    <Heading level="h4">{title}</Heading>
    {experiences.map((experience) => (
      <ExperienceItem key={experience.id} experience={experience} />
    ))}
  </div>
);

export default ExperienceType;
