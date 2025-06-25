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
