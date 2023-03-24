import React from "react";
import { useIntl } from "react-intl";
import { StarIcon } from "@heroicons/react/20/solid";

import { Heading } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import { GetApplicationPageInfo } from "~/types/poolCandidate";
import ApplicationApi, { ApplicationPageProps } from "../ApplicationApi";

export const getPageInfo: GetApplicationPageInfo = ({
  application,
  paths,
  intl,
}) => {
  const path = paths.applicationResumeAdd(application.id);
  return {
    title: intl.formatMessage({
      defaultMessage: "Add an experience to your résumé",
      id: "fBabZh",
      description: "Page title for the application résumé add experience page",
    }),
    icon: StarIcon,
    crumbs: [
      {
        url: path,
        label: intl.formatMessage({
          defaultMessage: "Step 2 (add experience)",
          id: "IEYl//",
          description:
            "Breadcrumb link text for the application résumé add experience page",
        }),
      },
    ],
    link: {
      url: path,
    },
  };
};

const ApplicationResumeAdd = ({ application }: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const pageInfo = getPageInfo({ intl, paths, application });

  return <Heading data-h2-margin-top="base(0)">{pageInfo.title}</Heading>;
};

const ApplicationResumeAddPage = () => (
  <ApplicationApi PageComponent={ApplicationResumeAdd} />
);

export default ApplicationResumeAddPage;
