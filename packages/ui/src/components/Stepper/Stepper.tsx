import React from "react";
import { useIntl } from "react-intl";

import { uiMessages } from "@gc-digital-talent/i18n";

import Heading, { HeadingLevel } from "../Heading";

import Step from "./Step";
import { StepState, StepType } from "./types";

const deriveStepState = (
  stepIndex: number,
  currentIndex: number,
  completed: boolean,
  error = false,
): StepState => {
  if (currentIndex === stepIndex) {
    return "active";
  }

  if (error) {
    return "error";
  }

  if (completed) {
    return "completed";
  }

  return "disabled";
};

export interface StepperProps {
  currentIndex: number;
  headingLevel?: HeadingLevel;
  label: string;
  steps: Array<StepType>;
  // Allows users to skip steps when true
  preventDisable?: boolean;
}

const Stepper = ({
  currentIndex,
  headingLevel = "h2",
  label,
  steps,
  preventDisable,
}: StepperProps) => {
  const intl = useIntl();
  const maxIndex = steps.length - 1;
  const index = currentIndex > maxIndex ? maxIndex : currentIndex;

  return (
    <nav aria-label={label}>
      <Heading level={headingLevel} size="h6" data-h2-font-weight="base(700)">
        {intl.formatMessage(uiMessages.stepTitle, {
          current: index + 1,
          total: steps.length,
        })}
      </Heading>
      <ol
        data-h2-align-items="base(flex-start)"
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x.75, 0)"
        data-h2-list-style="base(none)"
        data-h2-margin="base(x.75, 0, x1, 0)"
        data-h2-padding="base(0)"
      >
        {steps.map(
          ({ icon, href, label: stepLabel, completed, error }, stepIndex) => (
            <Step
              key={href}
              href={href}
              icon={icon}
              label={stepLabel}
              state={deriveStepState(stepIndex, index, completed, error)}
              last={stepIndex === maxIndex}
              preventDisable={preventDisable}
            />
          ),
        )}
      </ol>
    </nav>
  );
};

export default Stepper;
