import React from "react";
import { useIntl } from "react-intl";
import { HeartIcon } from "@heroicons/react/24/solid";

import { Heading } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import { GetApplicationPageInfo } from "~/types/poolCandidate";
import ApplicationApi, { ApplicationPageProps } from "../ApplicationApi";

export const getPageInfo: GetApplicationPageInfo = ({
  application,
  paths,
  intl,
}) => {
  return {
    title: intl.formatMessage({
      defaultMessage: "Welcome, {name}",
      id: "ttq9CR",
      description: "Page title for the application welcome page",
    }),
    subtitle: intl.formatMessage({
      defaultMessage:
        "Welcome to the beginning of your application. We're excited to meet you!",
      id: "Zd02bf",
      description: "Subtitle for the application welcome page",
    }),
    icon: HeartIcon,
    crumb: {
      url: paths.applicationWelcome(application.id),
      label: intl.formatMessage({
        defaultMessage: "Step 1",
        id: "n6ON28",
        description: "Breadcrumb link text for the application welcome page",
      }),
    },
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

const Welcome = ({ application }: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const pageInfo = getPageInfo({ intl, paths, application });

  return <Heading>{pageInfo.title}</Heading>;
};

const WelcomePage = () => <ApplicationApi PageComponent={Welcome} />;

export default WelcomePage;
