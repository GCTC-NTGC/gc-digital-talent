import React from "react";

interface FilterBlockProps {
  id: string;
  title: string | React.ReactNode;
  text: string;
}

const FilterBlock: React.FC<FilterBlockProps> = ({
  id,
  title,
  text,
  children,
}) => (
  <div>
    <h3
      id={id}
      data-h2-font-size="b(h4)"
      data-h2-font-weight="b(700)"
      data-h2-margin="b(bottom, m)"
    >
      {title}
    </h3>
    <p
      data-h2-font-size="b(caption)"
      data-h2-margin="b(bottom, m)"
      data-h2-padding="b(right, xl)"
    >
      {text}
    </p>
    {children && <div style={{ maxWidth: "30rem" }}>{children}</div>}
  </div>
);

export default FilterBlock;
