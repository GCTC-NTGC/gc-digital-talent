import React from "react";
import { useIntl } from "react-intl";

import { CardRepeater, useCardRepeaterContext } from "@gc-digital-talent/ui";
import { GeneralQuestion } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import { GeneralQuestionsSubmit, labels } from "./utils";
import GeneralQuestionDialog from "./GeneralQuestionDialog";

type GeneralQuestionCardProps = {
  index: number;
  generalQuestion: GeneralQuestion;
  onSave: GeneralQuestionsSubmit;
  onRemove: (index: number) => void;
  onMove: (fromIndex: number, toIndex: number) => void;
};

const GeneralQuestionCard = ({
  index,
  generalQuestion,
  onSave,
  onRemove,
  onMove,
}: GeneralQuestionCardProps) => {
  const intl = useIntl();
  const { move, remove } = useCardRepeaterContext();

  const handleMove = (from: number, to: number) => {
    move(from, to);
    onMove(from, to);
  };

  const handleRemove = (removeIndex: number) => {
    remove(removeIndex);
    onRemove(removeIndex);
  };

  return (
    <CardRepeater.Card
      index={index}
      onMove={handleMove}
      onRemove={handleRemove}
      edit={
        <GeneralQuestionDialog question={generalQuestion} onSave={onSave} />
      }
    >
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        data-h2-grid-template-columns="l-tablet(1fr 1fr)"
      >
        <div>
          <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x.25)">
            {intl.formatMessage(labels.questionEn)}
          </p>
          <p>
            {generalQuestion.question?.en ??
              intl.formatMessage(commonMessages.notProvided)}
          </p>
        </div>
        <div>
          <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x.25)">
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
