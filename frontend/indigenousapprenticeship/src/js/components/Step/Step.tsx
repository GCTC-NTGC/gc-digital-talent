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
  >
    <Heading
      as="h5"
      color="white"
      data-h2-display="b(flex)"
      data-h2-flex-direction="b(column)"
      data-h2-align-items="b(center)"
      data-h2-margin="b(bottom, s)"
    >
      <span data-h2-font-size="b(h1)" data-h2-font-color="b(ia-lightpink)">
        {position}
      </span>
      <span data-h2-font-size="b(h3)">{title}</span>
    </Heading>
    {children}
  </div>
);

export default Step;
