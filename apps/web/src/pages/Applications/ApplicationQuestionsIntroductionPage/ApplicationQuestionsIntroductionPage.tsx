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
      <Heading
        data-h2-margin="base(0, 0, x1, 0)"
        data-h2-font-weight="base(400)"
        size="h3"
      >
        {pageInfo.title}
      </Heading>
      <>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "This step allows hiring managers to ask two different types of questions: screening questions and general questions. Each question will be labelled so that you have a clear understanding of how your answer will be reviewed.",
            id: "80KL2S",
            description:
              "Application step for additional questions, introduction description, paragraph one",
          })}
        </p>
        <p data-h2-padding-top="base(x.5)">
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
      <div
        data-h2-display="base(flex)"
        data-h2-gap="base(x1)"
        data-h2-flex-wrap="base(wrap)"
        data-h2-flex-direction="base(column) l-tablet(row)"
        data-h2-align-items="base(flex-start) l-tablet(center)"
      >
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

export const Component = () => (
  <ApplicationApi PageComponent={ApplicationQuestionsIntroduction} />
);

Component.displayName = "ApplicationQuestionsIntroductionPage";
