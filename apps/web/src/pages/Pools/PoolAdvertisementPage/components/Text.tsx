import * as React from "react";

type TextProps = React.HTMLProps<HTMLParagraphElement>;

const Text = (props: TextProps) => (
  <p data-h2-margin="base(x.5 0)" {...props} />
);

export default Text;
