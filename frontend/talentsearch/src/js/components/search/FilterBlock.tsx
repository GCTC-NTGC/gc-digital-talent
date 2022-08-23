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
      data-h2-font-size="base(h6, 1)"
      data-h2-font-weight="base(700)"
      data-h2-margin="base(x3, 0, x1, 0)"
    >
      {title}
    </h3>
    <p data-h2-margin="base(0, 0, x1, 0)">{text}</p>
    {children && <div>{children}</div>}
  </div>
);

export default FilterBlock;
