import React from "react";

type RowProps = React.HTMLAttributes<HTMLTableRowElement>;

const Row = ({ children, ...rest }: RowProps) => (
  <tr
    role="row"
    data-h2-display="base(block) l-tablet(table-row)"
    data-h2-padding="base(x.25 x.5) l-tablet(0)"
    data-h2-background-color="base:selectors[*:nth-child(even)](black.lightest.60) base:selectors[*:nth-child(odd)](foreground)"
    data-h2-border-bottom="base(1px solid gray.light)"
    {...rest}
  >
    {children}
  </tr>
);

export default Row;
