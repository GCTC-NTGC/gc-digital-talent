import React from "react";
import { useIntl } from "react-intl";

import { uiMessages } from "@gc-digital-talent/i18n";
import { Maybe } from "@gc-digital-talent/graphql";

import Heading, { HeadingLevel } from "../Heading";
import Step from "./Step";
import { StepState, StepType } from "./types";

const deriveStepState = (
  stepIndex: number,
  currentIndex: Maybe<number>,
  completed?: boolean | null,
  disabled?: boolean | null,
  error?: boolean | null,
): StepState => {
  if (currentIndex === stepIndex) {
    return "active";
  }

  if (disabled) {
    return "disabled";
  }

  if (error) {
    return "error";
  }

  if (completed) {
    return "completed";
  }

  return "default";
};

export interface StepperProps {
  currentIndex: number | undefined;
  headingLevel?: HeadingLevel;
  label: string;
  steps: Maybe<Array<StepType>>;
}

const Stepper = ({
  currentIndex,
  headingLevel = "h2",
  label,
  steps,
}: StepperProps) => {
  const intl = useIntl();
  let maxIndex: number | undefined;
  let index: number | undefined;
  if (steps && currentIndex !== undefined) {
    maxIndex = steps.length - 1;
    index =
      currentIndex > maxIndex || currentIndex < 0 ? undefined : currentIndex;
  }

  return (
    <nav aria-label={label}>
      {steps && index !== undefined ? (
        <Heading level={headingLevel} size="h6" data-h2-font-weight="base(700)">
          {intl.formatMessage(uiMessages.stepTitle, {
            current: index + 1,
            total: steps.length,
          })}
        </Heading>
      ) : null}
      <ol
        data-h2-align-items="base(flex-start)"
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x.75, 0)"
        data-h2-list-style="base(none)"
        data-h2-margin="base(x.75, 0, x1, 0)"
        data-h2-padding="base(0)"
      >
        {steps?.map(
          (
            { icon, href, label: stepLabel, completed, disabled, error },
            stepIndex,
          ) => (
            <Step
              key={href}
              href={href}
              icon={icon}
              label={stepLabel}
              state={deriveStepState(
                stepIndex,
                index,
                completed,
                disabled,
                error,
              )}
              last={stepIndex === maxIndex}
            />
          ),
        )}
      </ol>
    </nav>
  );
};

export default Stepper;
