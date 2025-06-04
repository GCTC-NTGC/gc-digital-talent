import { useIntl } from "react-intl";

import { CardRepeater, useCardRepeaterContext } from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { commonMessages, formMessages } from "@gc-digital-talent/i18n";

import { labels } from "./utils";
import GeneralQuestionDialog from "./GeneralQuestionDialog";

const GeneralQuestionCard_Fragment = graphql(/* GraphQL */ `
  fragment GeneralQuestionCard on GeneralQuestion {
    ...GeneralQuestionDialog
    question {
      en
      fr
    }
  }
`);

interface GeneralQuestionCardProps {
  index: number;
  generalQuestionQuery: FragmentType<typeof GeneralQuestionCard_Fragment>;
  disabled?: boolean;
}

const GeneralQuestionCard = ({
  index,
  generalQuestionQuery,
  disabled,
}: GeneralQuestionCardProps) => {
  const intl = useIntl();
  const { remove } = useCardRepeaterContext();
  const generalQuestion = getFragment(
    GeneralQuestionCard_Fragment,
    generalQuestionQuery,
  );

  return (
    <CardRepeater.Card
      index={index}
      edit={
        <GeneralQuestionDialog questionQuery={generalQuestion} index={index} />
      }
      remove={
        <CardRepeater.Remove
          disabled={disabled}
          onClick={() => remove(index)}
          aria-label={intl.formatMessage(formMessages.repeaterRemove, {
            index: index + 1,
          })}
        />
      }
    >
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        data-h2-grid-template-columns="l-tablet(1fr 1fr)"
      >
        <div>
          <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x.25)">
            {intl.formatMessage(labels.questionEn)}
          </p>
          <p>
            {generalQuestion.question?.en ??
              intl.formatMessage(commonMessages.notProvided)}
          </p>
        </div>
        <div>
          <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x.25)">
            {intl.formatMessage(labels.questionFr)}
          </p>
          <p>
            {generalQuestion.question?.fr ??
              intl.formatMessage(commonMessages.notProvided)}
          </p>
        </div>
      </div>
    </CardRepeater.Card>
  );
};

export default GeneralQuestionCard;
