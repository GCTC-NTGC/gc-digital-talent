import React from "react";

import { HeadingLevel } from "@common/components/Heading/Heading";

interface FilterBlockProps {
  id: string;
  title?: string | React.ReactNode;
  text: string;
  children?: React.ReactNode;
  headingLevel?: HeadingLevel;
}

const FilterBlock: React.FC<FilterBlockProps> = ({
  id,
  title,
  text,
  children,
  headingLevel = "h3",
}) => {
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
