import React from "react";

import { HeadingRank } from "@gc-digital-talent/ui";

interface FilterBlockProps {
  id: string;
  title?: string | React.ReactNode;
  text: string;
  children?: React.ReactNode;
  headingLevel?: HeadingRank;
}

const FilterBlock = ({
  id,
  title,
  text,
  children,
  headingLevel = "h3",
}: FilterBlockProps) => {
  const Heading = headingLevel;
  return (
    <div>
      {title && (
        <Heading
          id={id}
          data-h2-font-size="base(h6, 1)"
          data-h2-font-weight="base(700)"
          data-h2-margin="base(x3, 0, x1, 0)"
        >
          {title}
        </Heading>
      )}
      <p data-h2-margin="base(0, 0, x1, 0)">{text}</p>
      {children && <div>{children}</div>}
    </div>
  );
};

export default FilterBlock;
