import React from "react";

export type CardBasicProps = React.HTMLProps<HTMLDivElement>;

const CardBasic = (props: CardBasicProps) => (
  <div
    data-h2-background-color="base(white) base:dark(black)"
    data-h2-padding="base(x1)"
    data-h2-radius="base(rounded)"
    data-h2-shadow="base(medium)"
    {...props}
  />
);

export default CardBasic;
