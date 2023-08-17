import React from "react";

import { Heading } from "@gc-digital-talent/ui";

import { Experience } from "~/api/generated";

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
