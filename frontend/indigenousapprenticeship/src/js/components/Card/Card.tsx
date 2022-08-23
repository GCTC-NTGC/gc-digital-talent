import React from "react";

import Heading from "../Heading/Heading";

interface CardProps {
  Icon?: React.FC<React.HTMLAttributes<HTMLOrSVGElement>>;
  title: string;
}

const Card: React.FC<CardProps> = ({ title, Icon, children }) => (
  <div data-h2-text-align="base(center)">
    {Icon && <Icon data-h2-width="base(x4)" />}
    <Heading
      as="h4"
      color="white"
      data-h2-font-size="base(h3, 1)"
      data-h2-margin="base(x1, 0, x1, 0)"
    >
      {title}
    </Heading>
    <div data-h2-color="base(ia-white)">{children}</div>
  </div>
);

export default Card;
