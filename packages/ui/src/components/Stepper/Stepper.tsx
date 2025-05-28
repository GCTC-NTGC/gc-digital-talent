import { useIntl } from "react-intl";
import { ReactNode } from "react";

import { uiMessages } from "@gc-digital-talent/i18n";
import { Maybe } from "@gc-digital-talent/graphql";

import Heading, { HeadingLevel } from "../Heading";
import Step from "./Step";
import { StepType } from "./types";
import { StepState } from "./utils";

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
  if (steps) {
    maxIndex = steps.length - 1;
    if (currentIndex !== undefined) {
      index =
        currentIndex > maxIndex || currentIndex < 0 ? undefined : currentIndex;
    }
  }

  return (
    <nav aria-label={label}>
      {steps && index !== undefined ? (
        <Heading level={headingLevel} size="h6" className="mt-0 mb-6 font-bold">
          {intl.formatMessage(uiMessages.stepTitle, {
            current: index + 1,
            total: steps.length,
          })}
        </Heading>
      ) : null}
      {subTitle}
      <ol className="mt-4 mb-6 flex list-none flex-col items-start gap-y-6 p-0">
        {steps?.map(
          (
            { href, label: stepLabel, completed, disabled, error },
            stepIndex,
          ) => (
            <Step
              key={href}
              href={href}
              label={stepLabel}
              state={
                deriveStepState(stepIndex, index, completed, disabled, error) ??
                "default"
              }
              last={stepIndex === maxIndex}
            />
          ),
        )}
      </ol>
    </nav>
  );
};

export default Stepper;
