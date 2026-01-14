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
      <Heading className="mt-0 mb-6 font-normal" size="h3">
        {pageInfo.title}
      </Heading>
      <p className="mb-3">
        {intl.formatMessage({
          defaultMessage:
            "In this step, you may be asked screening questions and general questions. Your answers to <strong>screening questions will be evaluated</strong> as part of your application. Be sure to give thoughtful and detailed answers that really represent you and your experience.",
          id: "QlCJM8",
          description:
            "Application step for additional questions, introduction description, paragraph one",
        })}
      </p>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "We will label the questions so that you know how your answers will be reviewed.",
          id: "ZP1qNK",
          description:
            "Application step for additional questions, introduction description, paragraph two",
        })}
      </p>
      <Separator />
      <div className="flex flex-col flex-wrap items-start gap-6 sm:flex-row sm:items-center">
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
          color="primary"
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

export default Component;
