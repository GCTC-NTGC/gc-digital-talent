import React from "react";

import { HTMLFieldsetProps } from "../../types";

const Fieldset = (props: HTMLFieldsetProps) => (
  <fieldset
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column)"
    data-h2-gap="base(x.25 0)"
    data-h2-position="base(relative)"
    data-h2-margin-top="base(x1.5)"
    {...props}
  />
);

export default Fieldset;
