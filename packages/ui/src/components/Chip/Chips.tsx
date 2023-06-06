import React, { ReactElement } from "react";
import isArray from "lodash/isArray";
import { ChipProps } from "./Chip";

interface ChipsProps {
  children: ReactElement<ChipProps> | Array<ReactElement<ChipProps>>;
}

const Chips = ({ children }: ChipsProps) => (
  <div>
    {isArray(children) && children.length > 1 ? (
      <div
        role="list"
        data-h2-display="base(flex)"
        data-h2-flex-wrap="base(wrap)"
        data-h2-gap="base(x.25, x.125)"
      >
        {children.map((child) => (
          <div role="listitem" key={child.key}>
            {child}
          </div>
        ))}
      </div>
    ) : (
      children
    )}
  </div>
);

export default Chips;
