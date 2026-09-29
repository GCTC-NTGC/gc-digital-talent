import type { ReactNode } from "react";

import type { HeadingRank } from "@gc-digital-talent/ui";

interface FilterBlockProps {
  id: string;
  title?: string | ReactNode;
  text: ReactNode;
  children?: ReactNode;
  headingRank?: HeadingRank;
}

const FilterBlock = ({
  id,
  title,
  text,
  children,
  headingRank = "h3",
}: FilterBlockProps) => {
  const Heading = headingRank;
  return (
    <>
      {title && (
        <Heading id={id} className="tex-lg mt-12 mb-3 font-bold lg:text-xl">
          {title}
        </Heading>
      )}
      <p className="mt-3 mb-6">{text}</p>
      {children}
    </>
  );
};

export default FilterBlock;
