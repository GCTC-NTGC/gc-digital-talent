import { useIntl } from "react-intl";

import {
  errorMessages,
  getLocale,
  getLocalizedName,
  Locales,
} from "@gc-digital-talent/i18n";
import { GeneralQuestion, ScreeningQuestion } from "@gc-digital-talent/graphql";
import TextArea from "@gc-digital-talent/forms/TextArea";

import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";

const TEXT_AREA_ROWS = 3;
const TEXT_AREA_MAX_WORDS_EN = 200;

interface AnswerInputProps {
  index: number;
  question: ScreeningQuestion | GeneralQuestion;
}

const AnswerInput = ({ index, question }: AnswerInputProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const isScreening = question.__typename === "ScreeningQuestion";
  const answerPrefix = isScreening ? "screeningAnswers" : "generalAnswers";
  const questionId = `${answerPrefix}.${index}.question`;

  const wordCountLimits: Record<Locales, number> = {
    en: TEXT_AREA_MAX_WORDS_EN,
    fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
  } as const;

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
        id={`${answerPrefix}.${index}.answer`}
        name={`${answerPrefix}.${index}.answer`}
        aria-labelledby={questionId}
        rows={TEXT_AREA_ROWS}
        wordLimit={wordCountLimits[locale]}
        label={intl.formatMessage(
          {
            defaultMessage: "Answer to question {number}",
            id: "clAZjC",
            description: "Label for answer to specific question field",
          },
          {
            number: index + 1,
          },
        )}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
      />
    </>
  );
};

export default AnswerInput;
