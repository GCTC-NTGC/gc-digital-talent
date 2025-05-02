import { HTMLProps, ReactElement } from "react";

import { notEmpty } from "@gc-digital-talent/helpers";

import { ChipProps } from "./Chip";

type ChipsProps = Omit<HTMLProps<HTMLUListElement>, "children"> & {
  children: ReactElement<ChipProps> | (ReactElement<ChipProps> | null)[] | null;
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
    {Array.isArray(children) ? (
      children.filter(notEmpty).map((child) => <li key={child.key}>{child}</li>)
    ) : (
      <li>{children}</li>
    )}
  </ul>
);

export default Chips;
