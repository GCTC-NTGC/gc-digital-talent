import React from "react";
import { useIntl } from "react-intl";
import RocketLaunchIcon from "@heroicons/react/20/solid/RocketLaunchIcon";

import { Heading } from "@gc-digital-talent/ui";

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
  const path = paths.applicationReview(application.id);
  return {
    title: intl.formatMessage({
      defaultMessage: "Review your submission",
      id: "rR+M64",
      description: "Page title for the application review page",
    }),
    subtitle: intl.formatMessage({
      defaultMessage: "Review your application and submit it!",
      id: "O6L+3N",
      description: "Subtitle for the application review page",
    }),
    icon: RocketLaunchIcon,
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
      label: intl.formatMessage({
        defaultMessage: "Review and submit",
        id: "QDcEYJ",
        description: "Link text for the application review page",
      }),
    },
  };
};

const ApplicationReview = ({ application }: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { currentStepOrdinal } = useApplicationContext();
  const pageInfo = getPageInfo({
    intl,
    paths,
    application,
    stepOrdinal: currentStepOrdinal,
  });

  return <Heading data-h2-margin-top="base(0)">{pageInfo.title}</Heading>;
};

const ApplicationReviewPage = () => (
  <ApplicationApi PageComponent={ApplicationReview} />
);

export default ApplicationReviewPage;
