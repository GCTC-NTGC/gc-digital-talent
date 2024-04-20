import React from "react";

import { Separator } from "@gc-digital-talent/ui";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

const Root = (props: DivProps) => (
  <div
    className="rounded p-6 shadow-xl"
    data-h2-background="base(foreground)"
    {...props}
  />
);

const Header = (props: DivProps) => (
  <div
    className="mb-6 flex flex-col items-start justify-between gap-y-6 md:flex-row md:gap-x-6 md:gap-y-0"
    {...props}
  />
);

const Footer = (props: DivProps) => (
  <>
    <Separator space="sm" />
    <div
      className="flex flex-col items-center justify-start gap-y-3 sm:flex-row sm:gap-x-6 sm:gap-y-0"
      {...props}
    />
  </>
);

export default {
  Root,
  Header,
  Footer,
};
