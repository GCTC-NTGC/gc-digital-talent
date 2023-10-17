import React, { ReactElement } from "react";
import isArray from "lodash/isArray";

import { ChipProps } from "./Chip";

type ChipsProps = Omit<React.HTMLProps<HTMLUListElement>, "children"> & {
  children: ReactElement<ChipProps> | Array<ReactElement<ChipProps>>;
};

const Chips = ({ children, ...rest }: ChipsProps) => (
  <ul
    data-h2-display="base(flex)"
    data-h2-flex-wrap="base(wrap)"
    data-h2-gap="base(x.25, x.125)"
    data-h2-list-style="base(none)"
    data-h2-padding="base(0)"
    {...rest}
  >
    {isArray(children) ? (
      children.map((child) => <li key={child.key}>{child}</li>)
    ) : (
      <li>{children}</li>
    )}
  </ul>
);

export default Chips;
