import React from "react";

import styles from "./styles";

type CellHeaderProps = React.HTMLAttributes<HTMLTableCellElement>;

const CellHeader = ({ children, ...rest }: CellHeaderProps) => (
  <th
    role="columnheader"
    data-h2-background-color="base(black)"
    data-h2-color="base(white)"
    data-h2-display="base(none) l-tablet(table-cell)"
    data-h2-font-size="base(caption)"
    data-h2-vertical-align="base(bottom)"
    {...styles.cell}
    {...rest}
  >
    {children}
  </th>
);

export default CellHeader;
