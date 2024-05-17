import { ReactNode } from "react";

import { HeadingRank } from "@gc-digital-talent/ui";

interface FilterBlockProps {
  id: string;
  title?: string | ReactNode;
  text: string;
  children?: ReactNode;
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
    <>
      {title && (
        <Heading
          id={id}
          data-h2-font-size="base(h6, 1)"
          className="font-bold"
          data-h2-margin="base(x2, 0, x.5, 0)"
        >
          {title}
        </Heading>
      )}
      <p data-h2-margin="base(x.5, 0, x1, 0)">{text}</p>
      {children}
    </>
  );
};

export default FilterBlock;
