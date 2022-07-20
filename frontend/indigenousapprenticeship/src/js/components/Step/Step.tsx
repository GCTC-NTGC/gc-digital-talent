import React from "react";

import Heading from "../Heading/Heading";

interface StepProps {
  position: string;
  title: string;
}

const Step: React.FC<StepProps> = ({ position, title, children }) => (
  <div
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column)"
    data-h2-align-items="base(center)"
    data-h2-padding="base(0, x2) l-tablet(0)"
  >
    <Heading
      as="h4"
      color="white"
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-align-items="base(center)"
      data-h2-margin="base(0, 0, x.5, 0)"
    >
      <span data-h2-font-size="base(h1, 1.3)" data-h2-color="base(light.ia-primary)">
        {position}
      </span>
      <span data-h2-font-size="base(h3, 1.3)">{title}</span>
    </Heading>
    {children}
  </div>
);

export default Step;
