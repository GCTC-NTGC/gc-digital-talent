import React from "react";

import { Separator } from "@gc-digital-talent/ui";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

const Root = (props: DivProps) => (
  <div
    data-h2-background="base(foreground)"
    data-h2-padding="base(x1)"
    data-h2-radius="base(rounded)"
    data-h2-shadow="base(larger)"
    {...props}
  />
);

const Header = (props: DivProps) => (
  <div
    data-h2-align-items="base(flex-start)"
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column) l-tablet(row)"
    data-h2-justify-content="base(space-between)"
    data-h2-gap="base(x1 0) l-tablet(0 x1)"
    data-h2-margin-bottom="base(x1)"
    {...props}
  />
);

const Footer = (props: DivProps) => (
  <>
    <Separator space="sm" />
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column) p-tablet(row)"
      data-h2-justify-content="base(flex-start)"
      data-h2-gap="base(x.5 0) p-tablet(0 x1)"
      data-h2-align-items="base(center)"
      {...props}
    />
  </>
);

export default {
  Root,
  Header,
  Footer,
};
