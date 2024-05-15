import { HTMLProps, ReactNode } from "react";

import { HeadingRank } from "@gc-digital-talent/ui";

interface ContentSectionProps extends HTMLProps<HTMLDivElement> {
  title: string;
  children: ReactNode;
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
        data-h2-font-weight="base(700)"
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
