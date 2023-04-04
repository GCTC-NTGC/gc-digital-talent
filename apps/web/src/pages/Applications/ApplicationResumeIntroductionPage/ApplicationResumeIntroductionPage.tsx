import React from "react";
import { useIntl } from "react-intl";
import { StarIcon } from "@heroicons/react/20/solid";

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
  const path = paths.applicationResumeIntro(application.id);
  return {
    title: intl.formatMessage({
      defaultMessage: "Great work! On to your résumé.",
      id: "VTYtzg",
      description: "Page title for the application résumé introduction page",
    }),
    subtitle: intl.formatMessage({
      defaultMessage: "Update and review your résumé information.",
      id: "mxH830",
      description: "Subtitle for the application résumé introduction page",
    }),
    icon: StarIcon,
    omitFromStepper: true,
    crumbs: [
      {
        url: path,
        label: intl.formatMessage({
          defaultMessage: "Step 3 (Intro)",
          id: "G06TVY",
          description:
            "Breadcrumb link text for the application résumé introduction page",
        }),
      },
    ],
    link: {
      url: path,
    },
    prerequisites: [ApplicationStep.Welcome, ApplicationStep.ReviewYourProfile],
  };
};

const ApplicationResumeIntroduction = ({
  application,
}: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const pageInfo = getPageInfo({ intl, paths, application });

  return <Heading data-h2-margin-top="base(0)">{pageInfo.title}</Heading>;
};

const ApplicationResumeIntroductionPage = () => (
  <ApplicationApi PageComponent={ApplicationResumeIntroduction} />
);

export default ApplicationResumeIntroductionPage;
