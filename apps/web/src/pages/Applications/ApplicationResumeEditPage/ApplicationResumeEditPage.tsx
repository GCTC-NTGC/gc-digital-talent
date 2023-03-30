import React from "react";
import { useIntl } from "react-intl";
import { StarIcon } from "@heroicons/react/20/solid";

import { Heading } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import { GetApplicationPageInfo } from "~/types/poolCandidate";
import { useParams } from "react-router-dom";
import ApplicationApi, { ApplicationPageProps } from "../ApplicationApi";

export const getPageInfo: GetApplicationPageInfo = ({
  application,
  paths,
  resourceId,
  intl,
}) => {
  const path = paths.applicationResumeEdit(application.id, resourceId ?? "");
  return {
    title: intl.formatMessage({
      defaultMessage: "Edit your experience",
      id: "WiUlEh",
      description: "Page title for the application résumé edit experience page",
    }),
    icon: StarIcon,
    omitFromStepper: true,
    crumbs: [
      {
        url: path,
        label: intl.formatMessage({
          defaultMessage: "Step 2 (Edit experience)",
          id: "iFUbxh",
          description:
            "Breadcrumb link text for the application résumé edit experience page",
        }),
      },
    ],
    link: {
      url: path,
    },
  };
};

const ApplicationResumeEdit = ({ application }: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { experienceId } = useParams();
  const pageInfo = getPageInfo({
    intl,
    paths,
    application,
    resourceId: experienceId,
  });

  return <Heading data-h2-margin-top="base(0)">{pageInfo.title}</Heading>;
};

const ApplicationResumeEditPage = () => (
  <ApplicationApi PageComponent={ApplicationResumeEdit} />
);

export default ApplicationResumeEditPage;
