import { HTMLAttributes } from "react";

import { Card, Separator } from "@gc-digital-talent/ui";

type DivProps = HTMLAttributes<HTMLDivElement>;

const Root = (props: DivProps) => <Card {...props} />;

const Header = (props: DivProps) => (
  <div
    className="mb-6 flex flex-col items-start justify-between gap-6 sm:flex-row"
    {...props}
  />
);

const Footer = (props: DivProps) => (
  <>
    <Separator space="sm" />
    <div
      className="flex flex-col items-center justify-start gap-y-3 xs:flex-row xs:gap-x-6"
      {...props}
    />
  </>
);

export default {
  Root,
  Header,
  Footer,
};
