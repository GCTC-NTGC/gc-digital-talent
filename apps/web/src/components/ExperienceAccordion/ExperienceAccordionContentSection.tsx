import React from "react";
import { HeadingRank } from "@gc-digital-talent/ui";

export interface ExperienceAccordionContentSectionProps {
  title: string;
  children: React.ReactNode;
  headingLevel?: HeadingRank;
}

export const ExperienceAccordionContentSection = ({
  title,
  children,
  headingLevel = "h3",
}: ExperienceAccordionContentSectionProps) => {
  const Heading = headingLevel;
  return (
    <div data-h2-margin="base(x1 0)">
      <Heading
        data-h2-font-weight="base(700)"
        data-h2-margin-bottom="base(x.5)"
        data-h2-font-size="base(normal)"
      >
        {title}
      </Heading>
      <p>{children}</p>
    </div>
  );
};

export default ExperienceAccordionContentSection;
