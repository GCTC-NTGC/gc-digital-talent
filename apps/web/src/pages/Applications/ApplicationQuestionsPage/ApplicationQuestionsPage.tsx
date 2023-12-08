import React from "react";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";

import { Heading, Link, Well } from "@gc-digital-talent/ui";
import { BasicForm } from "@gc-digital-talent/forms";
import { notEmpty } from "@gc-digital-talent/helpers";
import { toast } from "@gc-digital-talent/toast";

import { ApplicationStep, useUpdateApplicationMutation } from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/applicationStep";
import applicationMessages from "~/messages/applicationMessages";

import ApplicationApi, { ApplicationPageProps } from "../ApplicationApi";
import { useApplicationContext } from "../ApplicationContext";
import { dataToFormValues, formValuesToSubmitData } from "./utils";
import { FormValues } from "./types";
import AnswerInput from "./components/AnswerInput";
import FormActions from "./components/FormActions";

export const getPageInfo: GetPageNavInfo = ({
  application,
  paths,
  intl,
  stepOrdinal,
}) => {
  const path = paths.applicationQuestions(application.id);
  return {
    title: intl.formatMessage({
      defaultMessage: "Screening questions",
      id: "sTij/C",
      description: "Page title for the application screening questions page",
    }),
    subtitle: intl.formatMessage({
      defaultMessage: "Answer key questions about your fit in this role.",
      id: "GTHuSJ",
      description: "Subtitle for the application screening questions page",
    }),
    icon: PencilSquareIcon,
    crumbs: [
      {
        url: path,
        label: intl.formatMessage(applicationMessages.numberedStep, {
          stepOrdinal,
        }),
      },
    ],
    link: {
      url: path,
    },
  };
};

const ApplicationQuestions = ({ application }: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const { currentStepOrdinal, isIAP } = useApplicationContext();
  const pageInfo = getPageInfo({
    intl,
    paths,
    application,
    stepOrdinal: currentStepOrdinal,
  });
  const [{ fetching: mutating }, executeMutation] =
    useUpdateApplicationMutation();
  const cancelPath = paths.profileAndApplications({ fromIapDraft: isIAP });

  const screeningQuestions =
    application.pool.screeningQuestions?.filter(notEmpty) || [];
  const screeningQuestionResponses =
    application.screeningQuestionResponses?.filter(notEmpty) || [];
  const handleSubmit = async (formValues: FormValues) => {
    const data = formValuesToSubmitData(formValues, screeningQuestionResponses);
    executeMutation({
      id: application.id,
      application: {
        ...data,
        insertSubmittedStep: ApplicationStep.ScreeningQuestions,
      },
    })
      .then((res) => {
        if (!res.error) {
          toast.success(
            intl.formatMessage({
              defaultMessage:
                "Successfully updated screening question responses!",
              id: "kJUKrT",
              description:
                "Message displayed to users when saving screening question responses is successful.",
            }),
          );
          navigate(
            formValues.action === "continue"
              ? paths.applicationReview(application.id)
              : cancelPath,
          );
        }
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: adding experience failed",
            id: "moKAQP",
            description:
              "Message displayed to user after experience fails to be created.",
          }),
        );
      });
  };

  return (
    <>
      <div
        data-h2-display="p-tablet(flex)"
        data-h2-align-items="p-tablet(flex-end)"
        data-h2-justify-content="p-tablet(space-between)"
        data-h2-margin-bottom="base(x1)"
      >
        <Heading
          data-h2-margin="base(0)"
          data-h2-font-weight="base(400)"
          size="h3"
        >
          {pageInfo.title}
        </Heading>
        <Link
          color="secondary"
          mode="inline"
          href={paths.applicationQuestionsIntro(application.id)}
        >
          {intl.formatMessage({
            defaultMessage: "Review instructions",
            id: "VcpIlx",
            description:
              "Link text to return to an introduction page on an application",
          })}
        </Link>
      </div>
      <p data-h2-margin="base(x1, 0, x3, 0)">
        {intl.formatMessage({
          defaultMessage:
            'Don\'t forget to take a break if you need to! Using the "Save and quit for now" button, you can record your progress and return to questions you might be stuck on later.',
          id: "tMnjyJ",
          description:
            "Notice that application can be saved and returned to at a later time.",
        })}
      </p>
      <BasicForm
        onSubmit={handleSubmit}
        options={{
          defaultValues: dataToFormValues(
            screeningQuestions,
            screeningQuestionResponses,
          ),
        }}
      >
        {screeningQuestions.length ? (
          screeningQuestions.map((question, index) => (
            <React.Fragment key={question.id}>
              <Heading
                level="h3"
                size="h4"
                data-h2-font-weight="base(700)"
                data-h2-margin="base(x2, 0, x1, 0)"
              >
                {intl.formatMessage(
                  {
                    defaultMessage: "Question {number}",
                    id: "/sBGov",
                    description: "Heading for a specific screening question",
                  },
                  { number: index + 1 },
                )}
              </Heading>
              <input type="hidden" name={`answers.${index}.id`} />
              <input type="hidden" name={`answers.${index}.questionId`} />
              <AnswerInput index={index} question={question} />
            </React.Fragment>
          ))
        ) : (
          <Well>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "This process has no screening questions. You may continue on to the next step.",
                id: "CfNtWn",
                description:
                  "Message displayed to users when there are no screening questions for a process",
              })}
            </p>
          </Well>
        )}
        <FormActions disabled={mutating} />
      </BasicForm>
    </>
  );
};

const ApplicationQuestionsPage = () => (
  <ApplicationApi PageComponent={ApplicationQuestions} />
);

export default ApplicationQuestionsPage;
