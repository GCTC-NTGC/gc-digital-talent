import { useIntl } from "react-intl";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Accordion } from "@gc-digital-talent/ui";

const ScreeningDialogScreeningQuestions_Fragment = graphql(/** GraphQL */ `
  fragment ScreeningDialogScreeningQuestions on PoolCandidate {
    screeningQuestionResponses {
      answer
      screeningQuestion {
        id
        question {
          localized
        }
      }
    }
  }
`);

interface ScreeningQuestionsProps {
  query?: FragmentType<typeof ScreeningDialogScreeningQuestions_Fragment>;
}

const ScreeningQuestions = ({ query }: ScreeningQuestionsProps) => {
  const intl = useIntl();
  const candidate = getFragment(
    ScreeningDialogScreeningQuestions_Fragment,
    query,
  );

  const items = unpackMaybes(candidate?.screeningQuestionResponses)
    .filter((r) => !!r.screeningQuestion)
    .map((response) => ({
      id: response.screeningQuestion?.id,
      question:
        response.screeningQuestion?.question?.localized ??
        intl.formatMessage(commonMessages.notAvailable),
      answer: response.answer ?? intl.formatMessage(commonMessages.notProvided),
    }));

  return (
    <Accordion.Root type="multiple" className="mb-6">
      {items.map((item) => (
        <Accordion.Item key={item.id} value={item.id ?? ""}>
          <Accordion.Trigger>{item.question}</Accordion.Trigger>
          <Accordion.Content>{item.answer}</Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
};

export default ScreeningQuestions;
