import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { FormEvent } from "react";

import { Button, Heading, Link, Separator } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { errorMessages } from "@gc-digital-talent/i18n";
import { ApplicationStep } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/applicationStep";
import { getShortPoolTitleHtml } from "~/utils/poolUtils";
import poolCandidateMessages from "~/messages/poolCandidateMessages";

import useUpdateApplicationMutation from "../useUpdateApplicationMutation";
import ApplicationApi, { ApplicationPageProps } from "../ApplicationApi";
import { useApplicationContext } from "../ApplicationContext";

export const getPageInfo: GetPageNavInfo = ({
  application,
  paths,
  intl,
  stepOrdinal,
}) => {
  return {
    title: intl.formatMessage(
      {
        defaultMessage: "Welcome, {name}",
        id: "ttq9CR",
        description: "Page title for the application welcome page",
      },
      {
        name: application.user.firstName,
      },
    ),
    subtitle: intl.formatMessage({
      defaultMessage:
        "Welcome to the beginning of your application. We're excited to meet you!",
      id: "Zd02bf",
      description: "Subtitle for the application welcome page",
    }),
    crumbs: [
      {
        url: paths.applicationWelcome(application.id),
        label: intl.formatMessage(poolCandidateMessages.assessmentStepNumber, {
          stepNumber: stepOrdinal,
        }),
      },
    ],
    link: {
      url: paths.applicationWelcome(application.id),
      label: intl.formatMessage({
        defaultMessage: "Welcome",
        id: "sde2Dj",
        description: "Link text for the application welcome page",
      }),
    },
  };
};

const ApplicationWelcome = ({ application }: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const { followingPageUrl, currentStepOrdinal, isIAP } =
    useApplicationContext();
  const pageInfo = getPageInfo({
    intl,
    paths,
    application,
    stepOrdinal: currentStepOrdinal,
  });
  const poolName = getShortPoolTitleHtml(intl, {
    workStream: application.pool.workStream,
    name: application.pool.name,
    publishingGroup: application.pool.publishingGroup,
    classification: application.pool.classification,
  });
  const [{ fetching }, executeMutation] = useUpdateApplicationMutation();
  const nextStepPath =
    followingPageUrl ?? paths.applicationProfile(application.id);

  const handleNavigation = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // We don't want to navigate until we mark the step as complete

    executeMutation({
      id: application.id,
      application: {
        insertSubmittedStep: ApplicationStep.Welcome,
      },
    })
      .then(async (res) => {
        if (res.data) {
          await navigate(nextStepPath);
        }
      })
      .catch(() => {
        toast.error(
          intl.formatMessage(errorMessages.unknownErrorRequestErrorTitle),
        );
      });

    return false;
  };

  return (
    <>
      <Heading size="h3" className="mt-0 mb-6 font-normal">
        {pageInfo.title}
      </Heading>
      <p className="my-6">
        {intl.formatMessage(
          {
            defaultMessage:
              "We're happy to see your interest in the {poolName} opportunity.",
            id: "MNjEW5",
            description: "Introductory sentence for a pool application.",
          },
          {
            poolName,
          },
        )}
      </p>
      <p className="my-6">
        {isIAP
          ? intl.formatMessage({
              defaultMessage:
                "The program is a Government of Canada initiative specifically for First Nations, Inuit, and Métis peoples. It is a pathway to employment in the federal public service for Indigenous peoples who have a passion for Information Technology (IT). We focus on that passion, and your potential to grow and succeed in this field.",
              id: "VHhOb/",
              description:
                "Description of how the hiring platform assesses candidates for IAP.",
            })
          : intl.formatMessage({
              defaultMessage:
                "GC Digital Talent is a skills-based hiring system. This means that your application will emphasize your skills and how you’ve applied them in the past, helping us to better understand your fit.",
              id: "f6UvQ4",
              description:
                "Description of how the skills-based hiring platform assess candidates.",
            })}
      </p>
      <p className="my-6">
        {intl.formatMessage({
          defaultMessage:
            "<strong>To get started, review your profile.</strong> If you haven’t created your profile yet, no problem! You can add all the necessary information in the next step.",
          id: "QMY4DF",
          description:
            "Description of the application process and the next step",
        })}
      </p>
      <Separator />
      <div className="flex flex-col flex-wrap items-start gap-6 sm:flex-row sm:items-center">
        <form onSubmit={handleNavigation}>
          <Button type="submit" color="primary" disabled={fetching}>
            {intl.formatMessage({
              defaultMessage: "Let's go!",
              id: "r6z4HM",
              description: "Link text to begin the application process",
            })}
          </Button>
        </form>
        <Link mode="inline" href={paths.jobPoster(application.pool.id)}>
          {intl.formatMessage({
            defaultMessage: "Return to the advertisement",
            id: "RWvojd",
            description:
              "Link text to return to a pool advertisement during the application",
          })}
        </Link>
      </div>
    </>
  );
};

export const Component = () => (
  <ApplicationApi PageComponent={ApplicationWelcome} />
);

Component.displayName = "ApplicationWelcomePage";

export default Component;
