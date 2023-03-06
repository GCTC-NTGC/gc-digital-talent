import React from "react";
import { useIntl } from "react-intl";

import { formMessages } from "@gc-digital-talent/i18n";

import { countNumberOfWords } from "../../utils";

export interface WordCounterProps {
  /** The string of text that words will be counted from. */
  text: string;
  /** Maximum amount of words before passing the optimal range. The Progress Ring color correlates with this number. */
  wordLimit: number;
}

const WordCounter: React.FunctionComponent<WordCounterProps> = ({
  text,
  wordLimit,
  ...rest
}): React.ReactElement => {
  const intl = useIntl();
  const numOfWords = countNumberOfWords(text);
  const wordsLeft = wordLimit - numOfWords;
  return (
    <>
      <span aria-hidden="true" data-h2-font-size="base(caption)" {...rest}>
        {wordsLeft < 0 ? (
          <span data-h2-color="base(error)">
            {Math.abs(wordsLeft)}{" "}
            {intl.formatMessage(formMessages.wordsOver, { wordsLeft })}
          </span>
        ) : (
          <span data-h2-color="base(gray.dark)">
            {wordsLeft}{" "}
            {intl.formatMessage(formMessages.wordsLeft, { wordsLeft })}
          </span>
        )}
      </span>
      {wordsLeft < 0 && (
        <span aria-live="polite" data-h2-visually-hidden="base(invisible)">
          {intl.formatMessage(formMessages.overLimit, { wordLimit })}
        </span>
      )}
    </>
  );
};

export default WordCounter;
