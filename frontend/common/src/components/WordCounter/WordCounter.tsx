import React from "react";
import { useIntl } from "react-intl";
import { countNumberOfWords } from "../../helpers/formUtils";

export interface WordCounterProps {
  /** Maximum amount of words before passing the optimal range. The Progress Ring color correlates with this number. */
  wordLimit: number;
  /** The text who's words are being counted. */
  value: string;
}

const WordCounter: React.FunctionComponent<WordCounterProps> = ({
  wordLimit,
  value,
}): React.ReactElement => {
  const intl = useIntl();
  const minWords = 0;
  const numOfWords = countNumberOfWords(value);
  return (
    <span
      role="progressbar"
      aria-valuenow={numOfWords}
      aria-valuemin={minWords}
      aria-valuemax={wordLimit}
      data-h2-font-size="b(caption)"
    >
      {wordLimit - numOfWords < 0 ? (
        <span data-h2-font-color="b(red)">
          {Math.abs(wordLimit - numOfWords)}{" "}
          {intl.formatMessage({
            defaultMessage: "words over limit.",
            description: "Message for when user goes over word limit.",
          })}
        </span>
      ) : (
        <span data-h2-font-color="b(darkgray)">
          {wordLimit - numOfWords}{" "}
          {intl.formatMessage({
            defaultMessage: "words left.",
            description: "Message for when user goes over word limit.",
          })}
        </span>
      )}
    </span>
  );
};

export default WordCounter;
