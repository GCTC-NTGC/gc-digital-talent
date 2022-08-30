import React from "react";

import Step, { type StepProps } from "./Step";

interface SpacerProps {
  children: React.ReactNode;
  isLast: boolean;
}

const Spacer = ({ children, isLast }: SpacerProps) => {
  if (isLast) {
    return children as JSX.Element;
  }

  return <div data-h2-margin="base(0, 0, 0, x.5)">{children}</div>;
};

export interface ApplicationNavigationProps {
  currentStep: number;
  steps: Omit<StepProps, "disabled">[];
}

const ApplicationNavigation = ({
  currentStep,
  steps,
}: ApplicationNavigationProps) => (
  <div
    data-h2-display="base(flex)"
    data-h2-flex-direction="base(column) p-tablet(row)"
    data-h2-align-items="base(center) p-tablet(flex-start)"
  >
    {steps.map((step, index) => (
      <Spacer key={step.path} isLast={index + 1 !== steps.length}>
        <Step
          {...step}
          disabled={index + 1 === currentStep}
          {...(index !== steps.length - 1 && {
            "data-h2-margin": "p-tablet(0, x.5, 0, 0)",
          })}
        />
      </Spacer>
    ))}
  </div>
);

export default ApplicationNavigation;
