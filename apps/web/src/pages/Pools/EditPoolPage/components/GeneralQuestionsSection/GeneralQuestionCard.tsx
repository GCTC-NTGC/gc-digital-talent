import React from "react";
import { useIntl } from "react-intl";

import { CardRepeater, useCardRepeaterContext } from "@gc-digital-talent/ui";
import { GeneralQuestion } from "@gc-digital-talent/graphql";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";

import { labels } from "./utils";
import GeneralQuestionDialog from "./GeneralQuestionDialog";

type GeneralQuestionCardProps = {
  index: number;
  generalQuestion: GeneralQuestion;
  disabled?: boolean;
};

const GeneralQuestionCard = ({
  index,
  generalQuestion,
  disabled,
}: GeneralQuestionCardProps) => {
  const intl = useIntl();
  const { remove } = useCardRepeaterContext();

  return (
    <CardRepeater.Card
      index={index}
      edit={<GeneralQuestionDialog question={generalQuestion} index={index} />}
      remove={
        <CardRepeater.Remove
          disabled={disabled}
          onClick={() => remove(index)}
          aria-label={intl.formatMessage(formMessages.repeaterRemove, {
            index,
          })}
        />
      }
    >
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        data-h2-grid-template-columns="l-tablet(1fr 1fr)"
      >
        <div>
          <p className="font-bold" data-h2-margin-bottom="base(x.25)">
            {intl.formatMessage(labels.questionEn)}
          </p>
          <p>
            {generalQuestion.question?.en ??
              intl.formatMessage(commonMessages.notProvided)}
          </p>
        </div>
        <div>
          <p className="font-bold" data-h2-margin-bottom="base(x.25)">
            {intl.formatMessage(labels.questionFr)}
          </p>
          <p>
            {generalQuestion.question?.fr ??
              intl.formatMessage(commonMessages.notProvided)}
          </p>
        </div>
      </div>
    </CardRepeater.Card>
  );
};

export default GeneralQuestionCard;
