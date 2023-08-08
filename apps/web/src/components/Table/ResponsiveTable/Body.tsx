import React from "react";

type BodyProps = React.HTMLAttributes<HTMLTableSectionElement>;

const Body = ({ children, ...rest }: BodyProps) => (
  // Note: Need to specify role for mobile responsive styles
  // eslint-disable-next-line jsx-a11y/no-redundant-roles
  <tbody
    role="rowgroup"
    data-h2-width="base(100%)"
    data-h2-display="base(block) l-tablet(table-row-group)"
    {...rest}
  >
    {children}
  </tbody>
);

export default Body;
