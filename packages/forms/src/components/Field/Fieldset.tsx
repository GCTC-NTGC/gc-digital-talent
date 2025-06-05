import { forwardRef } from "react";
import { tv } from "tailwind-variants";

import { HTMLFieldsetProps } from "../../types";

const fieldSet = tv({
  base: "flex flex-col gap-y-1.5 border-none p-0",
});

const Fieldset = forwardRef<HTMLFieldSetElement, HTMLFieldsetProps>(
  ({ className, ...rest }, forwardedRef) => (
    <fieldset
      ref={forwardedRef}
      className={fieldSet({ class: className })}
      {...rest}
    />
  ),
);

export default Fieldset;
