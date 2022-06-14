import React from "react";

import Heading from "../Heading/Heading";

interface StepProps {
  position: string;
  title: string;
}

const Step: React.FC<StepProps> = ({ position, title, children }) => (
  <div
    data-h2-display="b(flex)"
    data-h2-flex-direction="b(column)"
    data-h2-align-items="b(center)"
    data-h2-padding="b(0, x2) m(0)"
  >
    <Heading
      as="h5"
      color="white"
      data-h2-display="b(flex)"
      data-h2-flex-direction="b(column)"
      data-h2-align-items="b(center)"
      data-h2-margin="b(0, 0, x.5, 0)"
    >
      <span data-h2-font-size="b(h1, 1.3)" data-h2-color="b(light.ia-primary)">
        {position}
      </span>
      <span data-h2-font-size="b(h3, 1.3)">{title}</span>
    </Heading>
    {children}
  </div>
);

export default Step;
