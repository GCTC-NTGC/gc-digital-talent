import React from "react";
import { useIntl } from "react-intl";
import { RocketLaunchIcon } from "@heroicons/react/20/solid";

import { Heading } from "@gc-digital-talent/ui";
import { ApplicationStep } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import { GetApplicationPageInfo } from "~/types/poolCandidate";
import ApplicationApi, { ApplicationPageProps } from "../ApplicationApi";

export const getPageInfo: GetApplicationPageInfo = ({
  application,
  paths,
  intl,
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
        label: intl.formatMessage({
          defaultMessage: "Step 7",
          id: "b5m9Ja",
          description: "Breadcrumb link text for the application review page",
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
    prerequisites: [
      ApplicationStep.Welcome,
      ApplicationStep.ReviewYourProfile,
      ApplicationStep.ReviewYourResume,
      ApplicationStep.EducationRequirements,
      ApplicationStep.SkillRequirements,
      ApplicationStep.ScreeningQuestions,
    ],
    stepSubmitted: ApplicationStep.ReviewAndSubmit,
    hasError: () => {
      return !application.signature;
    },
  };
};

const ApplicationReview = ({ application }: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const pageInfo = getPageInfo({ intl, paths, application });

  return <Heading data-h2-margin-top="base(0)">{pageInfo.title}</Heading>;
};

const ApplicationReviewPage = () => (
  <ApplicationApi PageComponent={ApplicationReview} />
);

export default ApplicationReviewPage;
