import React from "react";

import { Experience } from "~/api/generated";

import ExperienceItem from "./ExperienceItem";

interface ExperienceTypeProps {
  title: React.ReactNode;
  icon: React.ReactNode;
  experiences: Experience[];
}

const ExperienceType = ({ title, icon, experiences }: ExperienceTypeProps) => (
  <div className="experience-category">
    <div
      data-h2-display="base(flex)"
      data-h2-align-items="base(center)"
      data-h2-padding="base(0, 0, x.5, 0)"
    >
      <span data-h2-margin="base(x.125, x.5, 0, 0)">{icon}</span>
      <p data-h2-font-size="base(h5, 1)">{title}</p>
    </div>
    {experiences.map((experience) => (
      <ExperienceItem key={experience.id} experience={experience} />
    ))}
  </div>
);

export default ExperienceType;
