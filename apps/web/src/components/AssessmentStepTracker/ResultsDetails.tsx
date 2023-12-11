import React from "react";
import { useIntl } from "react-intl";

import { Board } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import Counter from "@gc-digital-talent/ui/src/components/Button/Counter";
import { notEmpty } from "@gc-digital-talent/helpers";

import {
  AssessmentDecision,
  AssessmentStep,
  AssessmentStepType,
} from "~/api/generated";

import {
  getDecisionInfo,
  getResultDecisionCount,
  decisionOrder,
} from "./utils";

interface StatusCountProps {
  counter: number;
  decision: AssessmentDecision;
  isApplicationStep: boolean;
}

const StatusCount = ({
  decision,
  counter,
  isApplicationStep,
}: StatusCountProps) => {
  const intl = useIntl();
  const { icon, name, colorStyle } = getDecisionInfo(
    decision,
    isApplicationStep,
    intl,
  );
  const Icon = icon;

  return (
    <span
      data-h2-align-items="base(center)"
      data-h2-display="base(flex)"
      data-h2-gap="base(0 x.25)"
      data-h2-width="base(100%)"
      data-h2-justify-content="base(space-between)"
      data-h2-padding="base(x.25 0)"
      data-h2-font-size="base(caption)"
    >
      <span
        data-h2-display="base(flex)"
        data-h2-gap="base(0 x.25)"
        data-h2-align-items="base(center)"
      >
        <Icon
          {...colorStyle}
          data-h2-height="base(x.65)"
          data-h2-width="base(x.65)"
          data-h2-transition="base(transform 150ms ease)"
        />
        <span>{name}</span>
      </span>
      {counter >= 0 ? (
        <Counter
          count={counter}
          data-h2-radius="base(x.5)"
          data-h2-background="base(foreground)"
          data-h2-padding="base(x.125 x.5)"
          data-h2-min-width="base(x2)"
          data-h2-text-align="base(center)"
        />
      ) : null}
    </span>
  );
};

interface ResultsDetailsProps {
  step: AssessmentStep;
}

const ResultsDetails = ({ step }: ResultsDetailsProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(true);
  const intl = useIntl();
  const assessmentResults = step.assessmentResults?.filter(notEmpty);
  const stepCounts = getResultDecisionCount(assessmentResults ?? []);
  const stepTitle = getLocalizedName(step.title, intl);
  const isApplicationStep =
    step.type === AssessmentStepType.ApplicationScreening;

  return (
    <Board.Info
      open={isOpen}
      onOpenChange={setIsOpen}
      counter={assessmentResults?.length}
      title={
        isOpen
          ? intl.formatMessage(
              {
                defaultMessage:
                  "Hide distribution<hidden> of {stepTitle}</hidden>",
                id: "yq7+BB",
                description:
                  "Button text to hide the distribution of step statuses",
              },
              { stepTitle },
            )
          : intl.formatMessage(
              {
                defaultMessage:
                  "Show distribution<hidden> of {stepTitle}</hidden>",
                id: "YNXjg7",
                description:
                  "Button text to show the distribution of step statuses",
              },
              { stepTitle },
            )
      }
    >
      <div data-h2-display="base(flex)" data-h2-flex-direction="base(column)">
        {decisionOrder.map((decision) => (
          <StatusCount
            key={decision}
            decision={decision}
            counter={stepCounts[decision]}
            isApplicationStep={isApplicationStep}
          />
        ))}
      </div>
    </Board.Info>
  );
};

export default ResultsDetails;
