import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";

import { Heading, Link } from "@gc-digital-talent/ui";
import { BasicForm } from "@gc-digital-talent/forms";
import { notEmpty } from "@gc-digital-talent/helpers";
import { toast } from "@gc-digital-talent/toast";
import { ApplicationStep } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/applicationStep";
import applicationMessages from "~/messages/applicationMessages";
import processMessages from "~/messages/processMessages";

import useUpdateApplicationMutation from "../useUpdateApplicationMutation";
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
    title: intl.formatMessage(processMessages.additionalQuestions),
    subtitle: intl.formatMessage({
      defaultMessage: "Answer key questions about your fit in this role.",
      id: "GTHuSJ",
      description: "Subtitle for the application screening questions page",
    }),
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
  const { isIAP } = useApplicationContext();
  const [{ fetching: mutating }, executeMutation] =
    useUpdateApplicationMutation();
  const cancelPath = paths.profileAndApplications({ fromIapDraft: isIAP });

  const screeningQuestions =
    application.pool.screeningQuestions?.filter(notEmpty) ?? [];
  const screeningQuestionResponses =
    application.screeningQuestionResponses?.filter(notEmpty) ?? [];
  const generalQuestions =
    application.pool.generalQuestions?.filter(notEmpty) ?? [];
  const generalQuestionResponses =
    application.generalQuestionResponses?.filter(notEmpty) ?? [];
  const handleSubmit = (formValues: FormValues) => {
    const data = formValuesToSubmitData(
      formValues,
      screeningQuestionResponses,
      generalQuestionResponses,
    );
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
              defaultMessage: "Successfully updated question responses!",
              id: "Bs/9PZ",
              description:
                "Message displayed to users when saving question responses is successful.",
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
            defaultMessage: "Error: updating question responses failed",
            id: "38dkpl",
            description:
              "Message displayed to user after application question responses fail to be updated.",
          }),
        );
      });
  };

  const errorLabels = {
    "generalAnswers.*.answer": intl.formatMessage(
      processMessages.generalQuestions,
    ),
    "screeningAnswers.*.answer": intl.formatMessage(
      processMessages.screeningQuestions,
    ),
  };

  return (
    <BasicForm
      onSubmit={handleSubmit}
      labels={errorLabels}
      options={{
        defaultValues: dataToFormValues(
          screeningQuestions,
          screeningQuestionResponses,
          generalQuestions,
          generalQuestionResponses,
        ),
      }}
    >
      {/* Screening Questions */}
      {screeningQuestions.length > 0 && (
        <div data-h2-margin-bottom="base(x4)">
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
              {intl.formatMessage(processMessages.screeningQuestions)}
            </Heading>
            <Link
              color="secondary"
              mode="inline"
              href={paths.applicationQuestionsIntro(application.id)}
            >
              {intl.formatMessage({
                defaultMessage: "Review instructions",
                id: "cCSlti",
                description: "Title for review instructions action",
              })}
            </Link>
          </div>
          <p data-h2-margin="base(x1, 0, x3, 0)">
            {intl.formatMessage({
              defaultMessage:
                "Remember, the questions in this section will be used to evaluate your application.",
              id: "8TyO/X",
              description: "Reminder what screening questions are used for.",
            })}
          </p>
          {screeningQuestions.map((question, index) => (
            <Fragment key={question.id}>
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
              <input type="hidden" name={`screeningAnswers.${index}.id`} />
              <input
                type="hidden"
                name={`screeningAnswers.${index}.questionId`}
              />
              <AnswerInput index={index} question={question} />
            </Fragment>
          ))}
        </div>
      )}
      {/* General Questions */}
      {generalQuestions.length > 0 && (
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
              {intl.formatMessage(processMessages.generalQuestions)}
            </Heading>
            {screeningQuestions.length === 0 && (
              <Link
                color="secondary"
                mode="inline"
                href={paths.applicationQuestionsIntro(application.id)}
              >
                {intl.formatMessage({
                  defaultMessage: "Review instructions",
                  id: "cCSlti",
                  description: "Title for review instructions action",
                })}
              </Link>
            )}
          </div>
          <p data-h2-margin="base(x1, 0, x3, 0)">
            {intl.formatMessage({
              defaultMessage:
                "Please answer these questions to the best of your ability to help hiring managers gain a stronger understanding of your fit to the opportunity.",
              id: "zH8887",
              description: "Reminder what general questions are used for.",
            })}
          </p>
          {generalQuestions.map((question, index) => (
            <Fragment key={question.id}>
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
              <input type="hidden" name={`generalAnswers.${index}.id`} />
              <input
                type="hidden"
                name={`generalAnswers.${index}.questionId`}
              />
              <AnswerInput index={index} question={question} />
            </Fragment>
          ))}
        </>
      )}
      <FormActions disabled={mutating} />
    </BasicForm>
  );
};

export const Component = () => (
  <ApplicationApi PageComponent={ApplicationQuestions} />
);

Component.displayName = "ApplicationQuestionsPage";
