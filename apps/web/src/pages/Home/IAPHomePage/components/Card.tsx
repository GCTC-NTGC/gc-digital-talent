import { HTMLAttributes, ReactElement, ReactNode } from "react";

import Heading from "~/components/IAPHeading/Heading";

interface CardProps {
  title: string;
  Icon?: (props: HTMLAttributes<HTMLOrSVGElement>) => ReactElement;
  children?: ReactNode;
}

const Card = ({ title, Icon, children }: CardProps) => (
  <div data-h2-text-align="base(center)">
    {Icon && (
      <Icon
        data-h2-width="base(x4)"
        data-h2-display="base(inline-block)"
        aria-hidden="true"
      />
    )}
    <Heading
      as="h4"
      data-h2-color="base:all(white)"
      data-h2-font-size="base(h3, 1)"
      data-h2-margin="base(x1, 0, x1, 0)"
    >
      {title}
    </Heading>
    <div data-h2-color="base:all(white)">{children}</div>
  </div>
);

export default Card;
