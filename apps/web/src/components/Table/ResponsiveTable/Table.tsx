import React from "react";

type TableProps = React.HTMLAttributes<HTMLTableElement>;

const Table = ({ children, ...rest }: TableProps) => (
  <table
    role="table"
    data-h2-border-collapse="base(collapse)"
    data-h2-display="base(block) l-tablet(table)"
    data-h2-overflow="base(hidden)"
    data-h2-radius="base(s)"
    data-h2-shadow="base(medium)"
    data-h2-width="base(100%)"
    {...rest}
  >
    {children}
  </table>
);

export default Table;
