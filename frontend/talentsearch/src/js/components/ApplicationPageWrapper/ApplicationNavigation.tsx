import React from "react";

import Step, { type StepProps } from "./Step";

export interface ApplicationNavigationProps {
  currentStep: number;
  steps: Omit<StepProps, "disabled">[];
}

const ApplicationNavigation = ({
  currentStep,
  steps,
}: ApplicationNavigationProps) => (
  <div
    data-h2-padding="b(top-bottom, m)"
    data-h2-display="b(flex)"
    data-h2-flex-direction="b(column) s(row)"
  >
    {steps.map((step, index) => (
      <Step
        key={step.path}
        {...step}
        disabled={index + 1 === currentStep}
        {...(index !== steps.length - 1 && {
          "data-h2-margin": "s(right, s)",
        })}
      />
    ))}
  </div>
);

export default ApplicationNavigation;
