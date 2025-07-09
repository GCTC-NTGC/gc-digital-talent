import { HTMLProps } from "react";
import { tv } from "tailwind-variants";

type TextProps = HTMLProps<HTMLParagraphElement>;

const text = tv({ base: "my-3" });

const Text = ({ className, ...rest }: TextProps) => (
  <p className={text({ class: className })} {...rest} />
);

export default Text;
