import React from "react";
import { useIntl } from "react-intl";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";
import sortBy from "lodash/sortBy";

import { TableOfContents, CardRepeater, Well } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { GeneralQuestion, Pool, PoolStatus } from "@gc-digital-talent/graphql";

import { EditPoolSectionMetadata } from "~/types/pool";

import { useEditPoolContext } from "../EditPoolContext";
import {
  GeneralQuestionsSubmit,
  GeneralQuestionsSubmitData,
  repeaterQuestionsToSubmitData,
} from "./utils";
import GeneralQuestionCard from "./GeneralQuestionCard";
import GeneralQuestionDialog from "./GeneralQuestionDialog";

const MAX_GENERAL_QUESTIONS = 10;

interface GeneralQuestionsProps {
  pool: Pool;
  sectionMetadata: EditPoolSectionMetadata;
  onSave: GeneralQuestionsSubmit;
}

export type { GeneralQuestionsSubmitData };

const GeneralQuestionsSection = ({
  pool,
  sectionMetadata,
  onSave,
}: GeneralQuestionsProps) => {
  const intl = useIntl();
  const [isUpdating, setIsUpdating] = React.useState<boolean>(false);
  const questions = React.useMemo(
    () =>
      sortBy(
        unpackMaybes(pool.generalQuestions),
        (question) => question.sortOrder,
      ),
    [pool.generalQuestions],
  );
  const { isSubmitting } = useEditPoolContext();

  // disabled unless status is draft
  const formDisabled =
    pool.status !== PoolStatus.Draft || isUpdating || isSubmitting;

  const handleUpdate = (newQuestions: GeneralQuestion[]) => {
    setIsUpdating(true);
    const generalQuestions = repeaterQuestionsToSubmitData(
      newQuestions,
      questions,
    );
    onSave({ generalQuestions }).then(() => {
      setIsUpdating(false);
    });
  };

  return (
    <>
      <TableOfContents.Heading icon={QuestionMarkCircleIcon} color="secondary">
        {sectionMetadata.title}
      </TableOfContents.Heading>
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "This section allows you to <strong>optionally</strong> add up to 10 general questions that will be asked to applicants during the application process. Please note that these are <strong>not screening questions</strong>. Screening questions will be added when you craft your assessment plan.",
          id: "4W8uc/",
          description:
            "Helper message indicating what general questions are and how they differ from screening questions",
        })}
      </p>
      <div data-h2-margin="base(x1 0)">
        <CardRepeater.Root<GeneralQuestion>
          items={questions}
          disabled={formDisabled}
          max={MAX_GENERAL_QUESTIONS}
          onUpdate={handleUpdate}
          add={<GeneralQuestionDialog disabled={formDisabled} />}
        >
          {questions.map((generalQuestion, index) => (
            <GeneralQuestionCard
              key={generalQuestion.id}
              index={index}
              generalQuestion={generalQuestion}
              disabled={formDisabled}
            />
          ))}
        </CardRepeater.Root>
      </div>
      {questions.length === 0 ? (
        <Well data-h2-margin="base(x1 0)" data-h2-text-align="base(center)">
          <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x.5)">
            {intl.formatMessage({
              defaultMessage: "You haven't added any questions yet.",
              id: "jXUnrt",
              description:
                "Message that appears when there are no general messages for a pool",
            })}
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage:
                'You can add items using the "Add a new question" button provided.',
              id: "z4wfGZ",
              description:
                "Instructions on how to add a question when there are none",
            })}
          </p>
        </Well>
      ) : null}
    </>
  );
};

export default GeneralQuestionsSection;
