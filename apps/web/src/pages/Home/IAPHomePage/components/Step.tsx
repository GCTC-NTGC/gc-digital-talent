import { ReactNode } from "react";

import Heading from "~/components/IAPHeading/Heading";

interface StepProps {
  position: string;
  title: string;
  children?: ReactNode;
}

const Step = ({ position, title, children }: StepProps) => (
  <div data-h2-text-align="base(center)">
    <Heading
      as="h4"
      data-h2-font-size="base(h3, 1)"
      data-h2-color="base:all(white)"
    >
      <span
        data-h2-font-size="base(h1)"
        data-h2-font-weight="base(800)"
        data-h2-display="base(inline-block)"
        data-h2-margin="base(0, 0, x1, 0)"
        data-h2-color="base:all(primary.light)"
      >
        {position}
      </span>
      <span data-h2-display="base(block)">{title}</span>
    </Heading>
    <div data-h2-color="base:all(white)" data-h2-margin="base(x1, 0, 0, 0)">
      {children}
    </div>
  </div>
);

export default Step;
