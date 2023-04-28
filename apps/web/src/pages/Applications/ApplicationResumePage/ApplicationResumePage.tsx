import React from "react";
import { useIntl } from "react-intl";
import { StarIcon } from "@heroicons/react/20/solid";

import { Heading } from "@gc-digital-talent/ui";
import { Applicant, ApplicationStep } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import { GetApplicationPageInfo } from "~/types/poolCandidate";
import { resumeIsIncomplete } from "~/validators/profile";
import ApplicationApi, { ApplicationPageProps } from "../ApplicationApi";

export const getPageInfo: GetApplicationPageInfo = ({
  application,
  paths,
  intl,
}) => {
  const path = paths.applicationResume(application.id);
  return {
    title: intl.formatMessage({
      defaultMessage: "Review your résumé",
      id: "sXjm+Z",
      description: "Page title for the application résumé page",
    }),
    subtitle: intl.formatMessage({
      defaultMessage: "Update and review your résumé information.",
      id: "OkREUg",
      description: "Subtitle for the application résumé page",
    }),
    icon: StarIcon,
    crumbs: [
      {
        url: path,
        label: intl.formatMessage({
          defaultMessage: "Step 3",
          id: "khjfel",
          description: "Breadcrumb link text for the application résumé page",
        }),
      },
    ],
    link: {
      url: path,
    },
    prerequisites: [ApplicationStep.Welcome, ApplicationStep.ReviewYourProfile],
    introUrl: paths.applicationResumeIntro(application.id),
    stepSubmitted: ApplicationStep.ReviewYourResume,
    hasError: (applicant: Applicant) => {
      const isIncomplete = resumeIsIncomplete(applicant);
      return isIncomplete;
    },
  };
};

const ApplicationResume = ({ application }: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const pageInfo = getPageInfo({ intl, paths, application });

  return <Heading data-h2-margin-top="base(0)">{pageInfo.title}</Heading>;
};

const ApplicationResumePage = () => (
  <ApplicationApi PageComponent={ApplicationResume} />
);

export default ApplicationResumePage;
