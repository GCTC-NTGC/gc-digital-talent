import { HTMLProps, ReactElement } from "react";
import { tv } from "tailwind-variants";

import { notEmpty } from "@gc-digital-talent/helpers";

import { ChipProps } from "./Chip";

const chips = tv({
  base: "flex list-none flex-wrap gap-x-2 gap-y-1 p-0",
});

type ChipsProps = Omit<HTMLProps<HTMLUListElement>, "children"> & {
  children: ReactElement<ChipProps> | (ReactElement<ChipProps> | null)[] | null;
};

const Chips = ({ children, className, ...rest }: ChipsProps) => (
  <ul {...rest} className={chips({ class: className })}>
    {Array.isArray(children) ? (
      children.filter(notEmpty).map((child) => <li key={child.key}>{child}</li>)
    ) : (
      <li>{children}</li>
    )}
  </ul>
);

export default Chips;
