import React from "react";
import { useIntl } from "react-intl";
import { countNumberOfWords } from "../../helpers/formUtils";

export interface WordCounterProps {
  /** The string of text that words will be counted from. */
  text: string;
  /** Maximum amount of words before passing the optimal range. The Progress Ring color correlates with this number. */
  wordLimit: number;
}

export const WordCounter: React.FunctionComponent<WordCounterProps> = ({
  text,
  wordLimit,
  ...rest
}): React.ReactElement => {
  const intl = useIntl();
  const minWords = 0;
  const numOfWords = countNumberOfWords(text);
  const wordsLeft = wordLimit - numOfWords;
  return (
    <span
      role="progressbar"
      aria-valuenow={numOfWords}
      aria-valuemin={minWords}
      aria-valuemax={wordLimit}
      data-h2-font-size="b(caption)"
      {...rest}
    >
      {wordsLeft < 0 ? (
        <span data-h2-font-color="b(red)">
          {Math.abs(wordsLeft)}{" "}
          {intl.formatMessage(
            {
              defaultMessage:
                "{wordsLeft, plural, one {word over limit} other {words over limit}}.",
              description: "Message for when user goes over word limit.",
            },
            { wordsLeft },
          )}
        </span>
      ) : (
        <span data-h2-font-color="b(darkgray)">
          {wordsLeft}{" "}
          {intl.formatMessage(
            {
              defaultMessage:
                "{wordsLeft, plural, one {word left} other {words left}}.",
              description: "Message for when user goes over word limit.",
            },
            { wordsLeft },
          )}
        </span>
      )}
    </span>
  );
};

export default WordCounter;
