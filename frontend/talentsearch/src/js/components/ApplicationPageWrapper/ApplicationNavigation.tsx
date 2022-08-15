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

  return (
    <div data-h2-margin="b(top, xxs) s(left, xxs) s(top, none)">{children}</div>
  );
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
    data-h2-display="b(flex)"
    data-h2-flex-direction="b(column) s(row)"
    data-h2-align-items="b(center) s(flex-start)"
  >
    {steps.map((step, index) => (
      <Spacer key={step.path} isLast={index + 1 !== steps.length}>
        <Step
          {...step}
          disabled={index + 1 === currentStep}
          {...(index !== steps.length - 1 && {
            "data-h2-margin": "s(right, s)",
          })}
        />
      </Spacer>
    ))}
  </div>
);

export default ApplicationNavigation;
