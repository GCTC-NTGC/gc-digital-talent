import React from "react";

import styles from "./styles";

type CellProps = React.HTMLAttributes<HTMLTableCellElement> & {
  isRowTitle?: boolean;
  isRowSelect?: boolean;
};

const Cell = ({ children, isRowTitle, isRowSelect, ...rest }: CellProps) => (
  <td
    role="cell"
    data-h2-vertical-align="base(text-top)"
    data-h2-max-width="base(100%) l-tablet(none)"
    {...(!isRowTitle && !isRowSelect
      ? {
          "data-h2-display": "base(grid) l-tablet(table-cell)",
          "data-h2-grid-template-columns": "base(6rem auto)",
          "data-h2-gap": "base(x.5 x.25) l-tablet(0)",
          "data-h2-width": "base(100%) l-tablet(auto)",
          "data-h2-order": "base(3)",
        }
      : {
          "data-h2-width": "base(auto)",
        })}
    {...(isRowSelect && {
      "data-h2-flex-shrink": "base(0)",
      "data-h2-order": "base(2)",
    })}
    {...(isRowTitle && {
      "data-h2-order": "base(1)",
      "data-h2-flex-grow": "base(1)",
    })}
    {...styles.cell}
    {...rest}
  >
    {children}
  </td>
);

export default Cell;
