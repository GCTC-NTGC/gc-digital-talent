import { forwardRef } from "react";

import { HTMLFieldsetProps } from "../../types";

const Fieldset = forwardRef<HTMLFieldSetElement, HTMLFieldsetProps>(
  (props, forwardedRef) => (
    <fieldset
      ref={forwardedRef}
      data-h2-border="base(none)"
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x.25 0)"
      data-h2-padding="base(0)"
      {...props}
    />
  ),
);

export default Fieldset;
