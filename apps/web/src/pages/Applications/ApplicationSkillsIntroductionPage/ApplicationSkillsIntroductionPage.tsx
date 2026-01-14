import { useIntl } from "react-intl";
import SparklesIcon from "@heroicons/react/20/solid/SparklesIcon";

import { Heading, Link, Separator } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/applicationStep";
import applicationMessages from "~/messages/applicationMessages";

import ApplicationApi, { ApplicationPageProps } from "../ApplicationApi";
import { useApplicationContext } from "../ApplicationContext";

export const getPageInfo: GetPageNavInfo = ({
  application,
  paths,
  intl,
  stepOrdinal,
}) => {
  const path = paths.applicationSkillsIntro(application.id);
  return {
    title: intl.formatMessage({
      defaultMessage: "Tell us about your skills",
      id: "coOFBt",
      description: "Page title for the application skills introduction page",
    }),
    subtitle: intl.formatMessage({
      defaultMessage:
        "Tell us about how you meet the skill requirements for this opportunity.",
      id: "+vHVZ2",
      description: "Subtitle for the application skills page",
    }),
    icon: SparklesIcon,
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

const ApplicationSkillsIntroduction = ({
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
      <Heading size="h3" className="mt-0 mb-6 font-normal">
        {pageInfo.title}
      </Heading>
      <p className="my-6">
        {intl.formatMessage({
          defaultMessage:
            "The next step is the most important part of your application. We'll ask you to talk about how you meet the skill requirements for this role.",
          id: "Qu3NZ1",
          description:
            "Application step for skill requirements, introduction, description, paragraph one",
        })}
      </p>
      <p className="my-6">
        {intl.formatMessage({
          defaultMessage:
            "In the same way that you selected items from your career timeline to confirm the experience and education requirements, we'll ask you to describe one or more experiences from your career timeline where you actively used the required skill.",
          id: "0Ma07A",
          description:
            "Application step for skill requirements, introduction, description, paragraph two",
        })}
      </p>
      <Separator />
      <div className="flex flex-col flex-wrap items-start gap-6 sm:flex-row sm:items-center">
        <Link
          href={paths.applicationSkills(application.id)}
          mode="solid"
          color="primary"
        >
          {intl.formatMessage({
            defaultMessage: "Let's get to it!",
            id: "PnyBYM",
            description: "Action button to move to the next step",
          })}
        </Link>
        <Link
          href={paths.profileAndApplications({ fromIapDraft: isIAP })}
          mode="inline"
        >
          {intl.formatMessage(applicationMessages.saveQuit)}
        </Link>
      </div>
    </>
  );
};

export const Component = () => (
  <ApplicationApi PageComponent={ApplicationSkillsIntroduction} />
);

Component.displayName = "ApplicationSkillsIntroductionPage";

export default Component;
