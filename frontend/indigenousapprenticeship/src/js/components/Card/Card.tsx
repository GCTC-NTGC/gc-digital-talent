import React from "react";

import Heading from "../Heading/Heading";

interface CardProps {
  Icon?: React.FC<React.HTMLAttributes<HTMLOrSVGElement>>;
  title: string;
}

const Card: React.FC<CardProps> = ({ title, Icon, children }) => (
  <div
    data-h2-display="b(flex)"
    data-h2-flex-direction="b(column)"
    data-h2-align-items="b(center)"
    data-h2-padding="b(0, x2) m(0)"
  >
    {Icon && <Icon className="card__icon" data-h2-width="b(25%) m(50%)" />}
    <Heading
      as="h5"
      color="white"
      data-h2-display="b(flex)"
      data-h2-flex-direction="b(column)"
      data-h2-align-items="b(center)"
      data-h2-margin="b(0, 0, x.125, 0)"
      data-h2-font-size="b(h3, 1.3)"
    >
      {title}
    </Heading>
    {children}
  </div>
);

export default Card;
