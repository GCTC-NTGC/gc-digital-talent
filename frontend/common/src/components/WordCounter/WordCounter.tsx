import React from "react";
import { useIntl } from "react-intl";
import { countNumberOfWords } from "../../helpers/formUtils";

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
          <span data-h2-color="base(dt-error)">
            {Math.abs(wordsLeft)}{" "}
            {intl.formatMessage(
              {
                defaultMessage:
                  "{wordsLeft, plural, one {word over limit} other {words over limit}}.",
                id: "WPJrmN",
                description: "Message for when user goes over word limit.",
              },
              { wordsLeft },
            )}
          </span>
        ) : (
          <span data-h2-color="base(dt-gray.dark)">
            {wordsLeft}{" "}
            {intl.formatMessage(
              {
                defaultMessage:
                  "{wordsLeft, plural, one {word left} other {words left}}.",
                id: "j6WJBY",
                description: "Message for when user goes over word limit.",
              },
              { wordsLeft },
            )}
          </span>
        )}
      </span>
      {wordsLeft < 0 && (
        <span aria-live="polite" data-h2-visually-hidden="base(invisible)">
          {intl.formatMessage(
            {
              defaultMessage: "You are over the word limit, {wordLimit}.",
              id: "JHgARn",
              description:
                "Text read out to assistive technology when over the word limit.",
            },
            { wordLimit },
          )}
        </span>
      )}
    </>
  );
};

export default WordCounter;
