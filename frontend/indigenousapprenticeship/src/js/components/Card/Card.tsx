import React from "react";

import Heading from "../Heading/Heading";

interface CardProps {
  Icon?: React.FC<React.HTMLAttributes<HTMLOrSVGElement>>;
  title: string;
}

const Card: React.FC<CardProps> = ({ title, Icon, children }) => (
  <div
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column)"
    data-h2-align-items="base(center)"
    data-h2-padding="base(0, x2) l-tablet(0)"
  >
    {Icon && <Icon className="card__icon" data-h2-width="base(25%) l-tablet(50%)" />}
    <Heading
      as="h5"
      color="white"
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-align-items="base(center)"
      data-h2-margin="base(0, 0, x.125, 0)"
      data-h2-font-size="base(h3, 1.3)"
    >
      {title}
    </Heading>
    {children}
  </div>
);

export default Card;
