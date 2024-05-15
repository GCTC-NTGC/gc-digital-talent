import { HTMLProps } from "react";

export type CardBasicProps = HTMLProps<HTMLDivElement>;

const CardBasic = (props: CardBasicProps) => (
  <div
    data-h2-background-color="base(foreground)"
    data-h2-padding="base(x1)"
    data-h2-radius="base(rounded)"
    data-h2-shadow="base(larger)"
    {...props}
  />
);

export default CardBasic;
