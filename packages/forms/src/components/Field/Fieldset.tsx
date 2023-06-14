import React from "react";

import { HTMLFieldsetProps } from "../../types";
import useCommonInputStyles from "../../hooks/useCommonInputStyles";

type FieldsetProps = HTMLFieldsetProps & {
  /** Render without border and padding */
  flat?: boolean;
  /** Render with a bounding box */
  boundingBox?: boolean;
};

const Fieldset = ({ flat, boundingBox, ...rest }: FieldsetProps) => {
  const styles = useCommonInputStyles();
  return (
    <fieldset
      {...(boundingBox && styles)}
      data-h2-background="base(white) base:dark(black.light)"
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x.25 0)"
      data-h2-position="base(relative)"
      data-h2-margin-top="base(x1.25)"
      {...(flat && {
        "data-h2-border": "base(none)",
        "data-h2-padding": "base(0)",
      })}
      {...rest}
    />
  );
};

export default Fieldset;
