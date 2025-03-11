import { useIntl } from "react-intl";
import { ReactNode } from "react";

import { uiMessages } from "@gc-digital-talent/i18n";
import { Maybe } from "@gc-digital-talent/graphql";

import Heading, { HeadingLevel } from "../Heading";
import Step from "./Step";
import { StepState, StepType } from "./types";

const deriveStepState = (
  stepIndex: number,
  currentIndex?: Maybe<number>,
  completed?: boolean | null,
  disabled?: boolean | null,
  error?: boolean | null,
): StepState => {
  if (currentIndex === stepIndex) {
    return error ? "active-error" : "active";
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
  subTitle?: ReactNode;
  label: string;
  steps: Maybe<StepType[]>;
}

const Stepper = ({
  currentIndex,
  headingLevel = "h2",
  subTitle,
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
        <Heading
          level={headingLevel}
          size="h6"
          data-h2-margin="base(0, 0, x1, 0)"
          data-h2-font-weight="base(700)"
        >
          {intl.formatMessage(uiMessages.stepTitle, {
            current: index + 1,
            total: steps.length,
          })}
        </Heading>
      ) : null}
      {subTitle}
      <ol
        data-h2-align-items="base(flex-start)"
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x1, 0)"
        data-h2-list-style="base(none)"
        data-h2-margin="base(x.75, 0, x1, 0)"
        data-h2-padding="base(0)"
      >
        {steps?.map(
          (
            { href, label: stepLabel, completed, disabled, error },
            stepIndex,
          ) => (
            <Step
              key={href}
              href={href}
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
