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
      data-h2-font-size="base(h4)"
      data-h2-font-weight="base(700)"
      data-h2-margin="base(0, 0, x1, 0)"
    >
      {title}
    </h3>
    <p
      data-h2-font-size="base(caption)"
      data-h2-margin="base(0, 0, x1, 0)"
      data-h2-padding="base(0, x3, 0, 0)"
    >
      {text}
    </p>
    {children && <div style={{ maxWidth: "30rem" }}>{children}</div>}
  </div>
);

export default FilterBlock;
