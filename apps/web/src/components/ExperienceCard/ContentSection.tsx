import type { HTMLProps, ReactNode } from "react";

import type { HeadingRank } from "@gc-digital-talent/ui";

interface ContentSectionProps extends HTMLProps<HTMLDivElement> {
  title: string;
  children: ReactNode;
  headingRank?: HeadingRank;
}

const ContentSection = ({
  title,
  children,
  headingRank = "h3",
  ...rest
}: ContentSectionProps) => {
  const Heading = headingRank;

  return (
    <div {...rest}>
      <Heading className="mb-3 text-base font-bold">{title}</Heading>
      {children}
    </div>
  );
};

export default ContentSection;
