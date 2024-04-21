import React from "react";
import { useIntl } from "react-intl";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";

import { Heading, Link, Separator } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/applicationStep";
import applicationMessages from "~/messages/applicationMessages";
import processMessages from "~/messages/processMessages";

import ApplicationApi, { ApplicationPageProps } from "../ApplicationApi";
import { useApplicationContext } from "../ApplicationContext";

export const getPageInfo: GetPageNavInfo = ({
  application,
  paths,
  intl,
  stepOrdinal,
}) => {
  const path = paths.applicationQuestionsIntro(application.id);
  return {
    title: intl.formatMessage(processMessages.additionalQuestions),
    subtitle: intl.formatMessage({
      defaultMessage: "Answer key questions about your fit in this role.",
      id: "GTHuSJ",
      description: "Subtitle for the application screening questions page",
    }),
    icon: PencilSquareIcon,
    crumbs: [
      {
        url: path,
        label: intl.formatMessage(applicationMessages.numberedStepIntro, {
          stepOrdinal,
        }),
      },
    ],
    link: {
      url: path,
    },
  };
};

const ApplicationQuestionsIntroduction = ({
  application,
}: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { currentStepOrdinal, isIAP } = useApplicationContext();
  const pageInfo = getPageInfo({
    intl,
    paths,
    application,
    stepOrdinal: currentStepOrdinal,
  });

  return (
    <>
      <Heading size="h3" className="mt-0">
        {pageInfo.title}
      </Heading>
      <>
        <p className="mb-3">
          {intl.formatMessage({
            defaultMessage:
              "This step allows hiring managers to ask two different types of questions: screening questions and general questions. Each question will be labelled so that you have a clear understanding of how your answer will be reviewed.",
            id: "80KL2S",
            description:
              "Application step for additional questions, introduction description, paragraph one",
          })}
        </p>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Your answers to <strong>screening questions will be evaluated</strong> as a part of your application, so be sure to give each question the time and thought required for an answer that really represents you and your experience.",
            id: "zp8FqH",
            description:
              "Application step for additional questions, introduction description, paragraph two",
          })}
        </p>
      </>
      <Separator />
      <div className="flex flex-col flex-wrap items-start gap-6 md:flex-row md:items-center">
        <Link
          color="primary"
          mode="solid"
          href={paths.applicationQuestions(application.id)}
        >
          {intl.formatMessage({
            defaultMessage: "I'm ready!",
            id: "egLb65",
            description: "An action button to proceed",
          })}
        </Link>
        <Link
          color="secondary"
          mode="inline"
          href={paths.profileAndApplications({ fromIapDraft: isIAP })}
        >
          {intl.formatMessage(applicationMessages.saveQuit)}
        </Link>
      </div>
    </>
  );
};

const ApplicationQuestionsIntroductionPage = () => (
  <ApplicationApi PageComponent={ApplicationQuestionsIntroduction} />
);

export default ApplicationQuestionsIntroductionPage;
