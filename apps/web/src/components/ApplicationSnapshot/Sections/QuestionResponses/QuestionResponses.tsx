import { useIntl } from "react-intl";
import { Fragment } from "react";
import { tv } from "tailwind-variants";

import type {
  GeneralQuestionResponse,
  LocalizedString,
  ScreeningQuestionResponse,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Heading } from "@gc-digital-talent/ui";

type SourceQuestionResponse =
  GeneralQuestionResponse | ScreeningQuestionResponse;

export interface GenericQuestionResponse {
  id: string;
  question?: string | null;
  answer?: string | null;
}

const normalizeQuestionResponses = (
  responses?: SourceQuestionResponse[],
): GenericQuestionResponse[] => {
  if (!responses) {
    return [];
  }

  return responses
    .map((response) => {
      let question: LocalizedString | null | undefined;

      if ("screeningQuestion" in response) {
        question = response.screeningQuestion?.question;
      }

      if ("generalQuestion" in response) {
        question = response.generalQuestion?.question;
      }

      return {
        id: response.id,
        question: question?.localized,
        answer: response.answer,
      };
    })
    .filter((response) => Boolean(response.question));
};

const questionHeading = tv({
  base: "text-base lg:text-base",
  variants: {
    first: {
      true: "mt-0",
    },
  },
});

interface QuestionResponsesProps {
  responses?: SourceQuestionResponse[];
}

const QuestionResponses = ({ responses }: QuestionResponsesProps) => {
  const intl = useIntl();
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);
  const normalizedResponses = normalizeQuestionResponses(
    unpackMaybes(responses),
  );

  if (normalizedResponses.length <= 0) {
    return <p>{notAvailable}</p>;
  }

  return normalizedResponses.map((response, index) => (
    <Fragment key={response.id}>
      <Heading
        level="h4"
        size="h6"
        className={questionHeading({ first: index === 0 })}
      >
        {response.question ?? notAvailable}
      </Heading>
      <p>{response.answer ?? notAvailable}</p>
    </Fragment>
  ));
};

export default QuestionResponses;
