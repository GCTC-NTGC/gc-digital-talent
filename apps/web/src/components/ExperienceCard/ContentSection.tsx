import React from "react";

import { HeadingRank } from "@gc-digital-talent/ui";

interface ContentSectionProps extends React.HTMLProps<HTMLDivElement> {
  title: string;
  children: React.ReactNode;
  headingLevel?: HeadingRank;
}

const ContentSection = ({
  title,
  children,
  headingLevel = "h3",
  ...rest
}: ContentSectionProps) => {
  const Heading = headingLevel;

  return (
    <div {...rest}>
      <Heading
        className="font-bold"
        data-h2-margin-bottom="base(x.5)"
        data-h2-font-size="base(normal)"
      >
        {title}
      </Heading>
      {children}
    </div>
  );
};

export default ContentSection;
