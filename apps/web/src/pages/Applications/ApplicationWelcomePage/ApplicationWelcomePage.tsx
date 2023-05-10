import React from "react";
import { useIntl } from "react-intl";
import HeartIcon from "@heroicons/react/24/solid/HeartIcon";
import { useNavigate } from "react-router-dom";

import { Button, Heading, Link, Separator } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";

import useRoutes from "~/hooks/useRoutes";
import { GetApplicationPageInfo } from "~/types/poolCandidate";
import { getFullPoolAdvertisementTitleHtml } from "~/utils/poolUtils";
import { useUpdateApplicationMutation, ApplicationStep } from "~/api/generated";

import { errorMessages } from "@gc-digital-talent/i18n";
import ApplicationApi, { ApplicationPageProps } from "../ApplicationApi";
import applicationWelcomeMessages from "./applicationWelcomeMessages";
import { PublishingGroup } from "@gc-digital-talent/graphql";

export const getPageInfo: GetApplicationPageInfo = ({
  application,
  paths,
  intl,
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
    icon: HeartIcon,
    crumbs: [
      {
        url: paths.applicationWelcome(application.id),
        label: intl.formatMessage({
          defaultMessage: "Step 1",
          id: "n6ON28",
          description: "Breadcrumb link text for the application welcome page",
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
    prerequisites: [],
    stepSubmitted: ApplicationStep.Welcome,
    hasError: null,
  };
};

const ApplicationWelcome = ({ application }: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const pageInfo = getPageInfo({ intl, paths, application });
  const welcomeMessages = applicationWelcomeMessages(
    application.poolAdvertisement?.publishingGroup,
  );
  const poolName = getFullPoolAdvertisementTitleHtml(
    intl,
    application.poolAdvertisement,
  );
  const [{ fetching }, executeMutation] = useUpdateApplicationMutation();
  const nextStepPath = paths.applicationProfile(application.id);

  const handleNavigation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // We don't want to navigate until we mark the step as complete

    executeMutation({
      id: application.id,
      application: {
        insertSubmittedStep: ApplicationStep.Welcome,
      },
    })
      .then((res) => {
        if (res.data) {
          navigate(nextStepPath);
        }
      })
      .catch(() => {
        toast.error(
          intl.formatMessage(errorMessages.unknownErrorRequestErrorTitle),
        );
      });

    return false;
  };

  // const isPublishedByIAP = application.poolAdvertisement?.publishingGroup === PublishingGroup.Iap;
  return (
    <>
      <Heading data-h2-margin-top="base(0)">{pageInfo.title}</Heading>
      <p data-h2-margin="base(x1, 0)">
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
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage(welcomeMessages.description)}
        {/* {isPublishedByIAP
          ? intl.formatMessage({
              defaultMessage:
                "The Program is a Government of Canada initiative specifically for First Nations, Inuit, and Métis peoples. It is pathway to employment in the federal public service for Indigenous peoples who have a passion for Information Technology (IT). We focus on that passion, and your potential to grow and succeed in this field.",
              id: "eyI7JA",
              description:
                "Description of how the skills-based hiring platform assess candidates.",
            })
          : intl.formatMessage({
              defaultMessage:
                "The GC Digital Talent platform is a skills-based hiring system. This means that your application will put a heavier focus on your skills and how you've used them in past experiences to help us get a stronger understanding of your fit.",
              id: "u/DBSl",
              description:
                "Description of how the skills-based hiring platform assess candidates.",
            })} */}
      </p>
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "<strong>To get started, we'll ask you to review your basic profile information</strong>. If you haven't created your profile yet, no problem! You can add all the relevant information in the next step.",
          id: "F7RkOA",
          description:
            "Description of the application process and the next step",
        })}
      </p>
      <Separator
        orientation="horizontal"
        data-h2-background-color="base(gray.lighter)"
        data-h2-margin="base(x2, 0)"
        decorative
      />
      <div
        data-h2-display="base(flex)"
        data-h2-gap="base(x.25, x.5)"
        data-h2-flex-wrap="base(wrap)"
        data-h2-flex-direction="base(column) l-tablet(row)"
        data-h2-align-items="base(flex-start) l-tablet(center)"
      >
        <form onSubmit={handleNavigation}>
          <Button
            type="submit"
            color="primary"
            mode="solid"
            disabled={fetching}
          >
            {intl.formatMessage({
              defaultMessage: "Let's go!",
              id: "r6z4HM",
              description: "Link text to begin the application process",
            })}
          </Button>
        </form>
        <Link
          type="button"
          mode="inline"
          color="secondary"
          href={paths.pool(application?.poolAdvertisement?.id || "")}
        >
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

const ApplicationWelcomePage = () => (
  <ApplicationApi PageComponent={ApplicationWelcome} />
);

export default ApplicationWelcomePage;
