import React from "react";
import { useWatch } from "react-hook-form";
import { useIntl } from "react-intl";

import {
  TextArea,
  WordCounter,
  countNumberOfWords,
} from "@gc-digital-talent/forms";
import { errorMessages, getLocalizedName } from "@gc-digital-talent/i18n";

import { ScreeningQuestion } from "~/api/generated";

const TEXT_AREA_ROWS = 3;
const TEXT_AREA_MAX_WORDS = 200;

interface AnswerInputProps {
  index: number;
  question: ScreeningQuestion;
}

const AnswerInput = ({ index, question }: AnswerInputProps) => {
  const intl = useIntl();
  const inputName = `answers.${index}.answer`;
  const currentValue = useWatch({ name: inputName });
  const questionId = `answers.${index}.question`;

  return (
    <>
      <p
        data-h2-margin="base(x1, 0)"
        data-h2-font-weight="base(700)"
        id={questionId}
      >
        {getLocalizedName(question.question, intl)}
      </p>
      <TextArea
        id={`answers.${index}.answer`}
        name={`answers.${index}.answer`}
        labelledBy={questionId}
        label={intl.formatMessage(
          { defaultMessage: "Answer to question {number}", id: "3BU43Q" },
          {
            number: index + 1,
          },
        )}
        rules={{
          required: intl.formatMessage(errorMessages.required),
          validate: {
            wordCount: (value: string) =>
              countNumberOfWords(value) <= TEXT_AREA_MAX_WORDS ||
              intl.formatMessage(errorMessages.overWordLimit, {
                value: TEXT_AREA_MAX_WORDS,
              }),
          },
        }}
        rows={TEXT_AREA_ROWS}
      />
      <div
        data-h2-margin="base(-x.5, 0, 0, 0)"
        data-h2-text-align="base(right)"
      >
        <WordCounter text={currentValue} wordLimit={TEXT_AREA_MAX_WORDS} />
      </div>
    </>
  );
};

export default AnswerInput;
