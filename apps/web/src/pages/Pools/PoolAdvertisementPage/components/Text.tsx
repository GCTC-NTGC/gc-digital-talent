import { HTMLProps } from "react";

type TextProps = HTMLProps<HTMLParagraphElement>;

const Text = (props: TextProps) => (
  <p data-h2-margin="base(x.5 0)" {...props} />
);

export default Text;
