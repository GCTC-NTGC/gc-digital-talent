import * as React from "react";
import { useIntl } from "react-intl";
import { useWatch } from "react-hook-form";

import { formMessages } from "@gc-digital-talent/i18n";

import { countNumberOfWords } from "../../utils";

export interface WordCounterProps {
  /** The input name that implements a word limit */
  name: string;
  /** Maximum amount of words before passing the optimal range. The Progress Ring color correlates with this number. */
  wordLimit: number;
  /** Override the current word count (used in rich text to omit tags) */
  currentCount?: number;
}

const WordCounter = ({
  name,
  wordLimit,
  currentCount,
  ...rest
}: WordCounterProps): React.ReactElement => {
  const intl = useIntl();
  const currentValue = useWatch({ name });
  const wordCount = currentCount ?? countNumberOfWords(currentValue);
  const wordsLeft = wordLimit - wordCount;
  return (
    <span
      aria-hidden="true"
      data-h2-font-size="base(caption)"
      {...(wordsLeft < 0
        ? {
            "data-h2-color": "base(error.darker)",
          }
        : {
            "data-h2-color": "base(black)",
          })}
      {...rest}
    >
      {intl.formatMessage(formMessages.wordLimit, {
        wordCount,
        wordLimit,
      })}
    </span>
  );
};

export default WordCounter;
