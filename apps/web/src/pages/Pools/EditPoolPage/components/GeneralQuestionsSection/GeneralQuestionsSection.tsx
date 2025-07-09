import { useState, useMemo } from "react";
import { useIntl } from "react-intl";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";
import sortBy from "lodash/sortBy";

import { TableOfContents, CardRepeater, Well } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  FragmentType,
  GeneralQuestion,
  PoolStatus,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";

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

const EditPoolGeneralQuestions_Fragment = graphql(/* GraphQL */ `
  fragment EditPoolGeneralQuestions on Pool {
    id
    status {
      value
    }
    generalQuestions {
      id
      sortOrder
      ...GeneralQuestionCard
    }
  }
`);

interface GeneralQuestionsProps {
  poolQuery: FragmentType<typeof EditPoolGeneralQuestions_Fragment>;
  sectionMetadata: EditPoolSectionMetadata;
  onSave: GeneralQuestionsSubmit;
}

export type { GeneralQuestionsSubmitData };

const GeneralQuestionsSection = ({
  poolQuery,
  sectionMetadata,
  onSave,
}: GeneralQuestionsProps) => {
  const intl = useIntl();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const pool = getFragment(EditPoolGeneralQuestions_Fragment, poolQuery);
  const questions = useMemo(
    () =>
      sortBy(
        unpackMaybes(pool.generalQuestions),
        (question) => question.sortOrder,
      ),
    [pool.generalQuestions],
  );
  const { isSubmitting } = useEditPoolContext();

  const handleUpdate = async (newQuestions: GeneralQuestion[]) => {
    setIsUpdating(true);
    const generalQuestions = repeaterQuestionsToSubmitData(
      newQuestions,
      questions,
    );
    await onSave({ generalQuestions }).then(() => {
      setIsUpdating(false);
    });
  };

  // disabled unless status is draft
  const formDisabled =
    pool.status?.value !== PoolStatus.Draft || isUpdating || isSubmitting;

  return (
    <>
      <TableOfContents.Heading icon={QuestionMarkCircleIcon} color="secondary">
        {sectionMetadata.title}
      </TableOfContents.Heading>
      <p className="my-6">
        {intl.formatMessage({
          defaultMessage:
            "This section allows you to <strong>optionally</strong> add up to 10 general questions that will be asked to applicants during the application process. Please note that these are <strong>not screening questions</strong>. Screening questions will be added when you craft your assessment plan.",
          id: "4W8uc/",
          description:
            "Helper message indicating what general questions are and how they differ from screening questions",
        })}
      </p>
      <div className="my-6">
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
              generalQuestionQuery={generalQuestion}
              disabled={formDisabled}
            />
          ))}
        </CardRepeater.Root>
      </div>
      {questions.length === 0 ? (
        <Well className="my-6 text-center">
          <p className="mb-3 font-bold">
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
