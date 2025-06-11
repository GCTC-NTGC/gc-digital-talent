import { ReactNode } from "react";

import Heading from "~/components/IAPHeading/Heading";

interface StepProps {
  position: string;
  title: string;
  children?: ReactNode;
}

const Step = ({ position, title, children }: StepProps) => (
  <div className="text-center">
    <Heading level="h4" size="h3" color="white">
      <span className="mb-6 inline-block text-5xl font-extrabold text-primary-300">
        {position}
      </span>
      <span className="block">{title}</span>
    </Heading>
    <div className="mt-6 text-white">{children}</div>
  </div>
);

export default Step;
