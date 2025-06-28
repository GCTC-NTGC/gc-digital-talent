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
          label={intl.formatMessage(formMessages.repeaterRemove, {
            index: index + 1,
          })}
        />
      }
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-3 font-bold">
            {intl.formatMessage(labels.questionEn)}
          </p>
          <p>
            {generalQuestion.question?.en ??
              intl.formatMessage(commonMessages.notProvided)}
          </p>
        </div>
        <div>
          <p className="mb-3 font-bold">
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
