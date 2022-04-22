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
  >
    {Icon && <Icon className="card__icon" data-h2-width="b(50)" />}
    <Heading
      as="h5"
      color="white"
      data-h2-display="b(flex)"
      data-h2-flex-direction="b(column)"
      data-h2-align-items="b(center)"
      data-h2-margin="b(bottom, xxs)"
      data-h2-font-size="b(h3)"
    >
      {title}
    </Heading>
    {children}
  </div>
);

export default Card;
