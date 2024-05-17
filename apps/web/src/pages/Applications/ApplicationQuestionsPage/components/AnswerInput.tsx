import { useIntl } from "react-intl";

import { TextArea } from "@gc-digital-talent/forms";
import { errorMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { GeneralQuestion, ScreeningQuestion } from "@gc-digital-talent/graphql";

const TEXT_AREA_ROWS = 3;
const TEXT_AREA_MAX_WORDS = 200;

interface AnswerInputProps {
  index: number;
  question: ScreeningQuestion | GeneralQuestion;
}

const AnswerInput = ({ index, question }: AnswerInputProps) => {
  const intl = useIntl();
  const isScreening = question.__typename === "ScreeningQuestion";
  const answerPrefix = isScreening ? "screeningAnswers" : "generalAnswers";
  const questionId = `${answerPrefix}.${index}.question`;

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
        wordLimit={TEXT_AREA_MAX_WORDS}
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
