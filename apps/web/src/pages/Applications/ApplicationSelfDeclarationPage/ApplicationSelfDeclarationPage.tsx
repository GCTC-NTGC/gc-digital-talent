import React from "react";
import { useIntl } from "react-intl";
import HeartIcon from "@heroicons/react/20/solid/HeartIcon";

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
  const path = paths.applicationSelfDeclaration(application.id);
  return {
    title: intl.formatMessage({
      defaultMessage: "Indigenous Peoples Self-Declaration Form",
      id: "CU5XqI",
      description: "Page title for the self-declaration page",
    }),
    subtitle: intl.formatMessage({
      defaultMessage: "Help us understand your community.",
      id: "gQl1LT",
      description: "Subtitle for the self-declaration page",
    }),
    icon: HeartIcon,
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
        defaultMessage: "Self-declaration",
        id: "fLohdl",
        description: "Link text for the self-declaration page",
      }),
    },
  };
};

const ApplicationSelfDeclaration = ({ application }: ApplicationPageProps) => {
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

const ApplicationSelfDeclarationPage = () => (
  <ApplicationApi PageComponent={ApplicationSelfDeclaration} />
);

export default ApplicationSelfDeclarationPage;
