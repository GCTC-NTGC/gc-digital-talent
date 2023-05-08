import React from "react";
import { useIntl } from "react-intl";
import PresentationChartBarIcon from "@heroicons/react/20/solid/PresentationChartBarIcon";

import { Heading } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/pages";

import ApplicationApi, { ApplicationPageProps } from "../ApplicationApi";

export const getPageInfo: GetPageNavInfo = ({ application, paths, intl }) => {
  const path = paths.applicationEducation(application.id);
  return {
    title: intl.formatMessage({
      defaultMessage: "Minimum experience or education",
      id: "6esMaA",
      description: "Page title for the application education page",
    }),
    subtitle: intl.formatMessage({
      defaultMessage:
        "Confirm you have the minimum experience or equivalent education for the role.",
      id: "gtns9R",
      description: "Subtitle for the application education  page",
    }),
    icon: PresentationChartBarIcon,
    crumbs: [
      {
        url: path,
        label: intl.formatMessage({
          defaultMessage: "Step 4",
          id: "w7F00q",
          description:
            "Breadcrumb link text for the application education page",
        }),
      },
    ],
    link: {
      url: path,
      label: intl.formatMessage({
        defaultMessage: "Education requirements",
        id: "dlJCeM",
        description: "Link text for the application education page",
      }),
    },
  };
};

const ApplicationEducation = ({ application }: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const pageInfo = getPageInfo({ intl, paths, application });

  return <Heading data-h2-margin-top="base(0)">{pageInfo.title}</Heading>;
};

const ApplicationEducationPage = () => (
  <ApplicationApi PageComponent={ApplicationEducation} />
);

export default ApplicationEducationPage;
