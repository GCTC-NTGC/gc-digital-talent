import { useState, useMemo } from "react";
import { useIntl } from "react-intl";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";

import { TableOfContents, CardRepeater, Notice } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { PoolStatus, getFragment, graphql } from "@gc-digital-talent/graphql";

import type { EditPoolSectionMetadata } from "~/types/pool";

import { useEditPoolContext } from "../EditPoolContext";
import type {
  GeneralQuestionsSubmit,
  GeneralQuestionsSubmitData,
} from "./utils";
import { questionToSubmitData } from "./utils";
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
      question {
        en
        fr
      }
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
      unpackMaybes(pool.generalQuestions).sort(
        (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
      ),
    [pool.generalQuestions],
  );
  const { isSubmitting } = useEditPoolContext();

  const handleUpdate = async (newQuestions: typeof questions) => {
    setIsUpdating(true);
    const deleteItems = questions
      .filter(
        (question) =>
          !newQuestions.some((newQuestion) => newQuestion.id === question.id),
      )
      .map((question) => question.id);
    const addItem = newQuestions.find((question) => question.id === "new");
    const updateItems = newQuestions
      .filter((question) => question.id !== "new")
      .map((question, index) => ({
        id: question.id,
        question: questionToSubmitData(question.question),
        sortOrder: index + 1,
      }));

    const generalQuestions: GeneralQuestionsSubmitData["generalQuestions"] =
      addItem
        ? {
            create: [
              {
                sortOrder: updateItems.length + 1,
                question: questionToSubmitData(addItem.question),
              },
            ],
          }
        : { update: updateItems, delete: deleteItems };

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
        <CardRepeater.Root
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
        <Notice.Root className="my-6 text-center">
          <Notice.Title>
            {intl.formatMessage({
              defaultMessage: "You haven't added any questions yet.",
              id: "jXUnrt",
              description:
                "Message that appears when there are no general messages for a pool",
            })}
          </Notice.Title>
          <Notice.Content>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  'You can add items using the "Add a new question" button provided.',
                id: "z4wfGZ",
                description:
                  "Instructions on how to add a question when there are none",
              })}
            </p>
          </Notice.Content>
        </Notice.Root>
      ) : null}
    </>
  );
};

export default GeneralQuestionsSection;
