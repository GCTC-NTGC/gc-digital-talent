import React from "react";

import styles from "./styles";

type CellProps = React.HTMLAttributes<HTMLTableCellElement>;

const Cell = ({ children, ...rest }: CellProps) => (
  <td
    role="cell"
    data-h2-display="base(grid) l-tablet(table-cell)"
    data-h2-grid-template-columns="base(6rem auto)"
    data-h2-gap="base(x.5 x.25) l-tablet(0)"
    data-h2-vertical-align="base(text-top)"
    {...styles.cell}
    {...rest}
  >
    {children}
  </td>
);

export default Cell;
