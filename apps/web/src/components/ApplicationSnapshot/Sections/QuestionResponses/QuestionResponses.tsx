import { useIntl } from "react-intl";
import { Fragment } from "react";
import { tv } from "tailwind-variants";

import type { LocalizedString } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Heading } from "@gc-digital-talent/ui";

export interface SnapshotQuestionResponse {
  id: string;
  answer?: string | null;
  question?: LocalizedString | null;
}

const questionHeading = tv({
  base: "text-base lg:text-base",
  variants: {
    first: {
      true: "mt-0",
    },
  },
});

interface QuestionResponsesProps {
  responses?: SnapshotQuestionResponse[];
}

const QuestionResponses = ({ responses }: QuestionResponsesProps) => {
  const intl = useIntl();
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);
  const answeredResponses = unpackMaybes(responses).filter((response) =>
    Boolean(response.question?.localized),
  );

  if (answeredResponses.length <= 0) {
    return <p>{notAvailable}</p>;
  }

  return answeredResponses.map((response, index) => (
    <Fragment key={response.id}>
      <Heading
        level="h4"
        size="h6"
        className={questionHeading({ first: index === 0 })}
      >
        {response.question?.localized ?? notAvailable}
      </Heading>
      <p>{response.answer ?? notAvailable}</p>
    </Fragment>
  ));
};

export default QuestionResponses;
