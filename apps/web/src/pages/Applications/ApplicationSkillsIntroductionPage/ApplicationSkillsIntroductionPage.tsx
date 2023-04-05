import React from "react";
import { useIntl } from "react-intl";
import { SparklesIcon } from "@heroicons/react/20/solid";

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
  const path = paths.applicationSkillsIntro(application.id);
  return {
    title: intl.formatMessage({
      defaultMessage: "Let's talk about skills",
      id: "7ET77N",
      description: "Page title for the application skills introduction page",
    }),
    subtitle: intl.formatMessage({
      defaultMessage:
        "Tell us about how you meet the skill requirements for this opportunity.",
      id: "+vHVZ2",
      description: "Subtitle for the application skills page",
    }),
    icon: SparklesIcon,
    omitFromStepper: true,
    crumbs: [
      {
        url: path,
        label: intl.formatMessage({
          defaultMessage: "Step 5 (Intro)",
          id: "NlfaES",
          description:
            "Breadcrumb link text for the application skills introduction page",
        }),
      },
    ],
    link: {
      url: path,
    },
    prerequisites: [
      ApplicationStep.Welcome,
      ApplicationStep.ReviewYourProfile,
      ApplicationStep.ReviewYourResume,
      ApplicationStep.EducationRequirements,
    ],
    stepSubmitted: null,
  };
};

const ApplicationSkillsIntroduction = ({
  application,
}: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const pageInfo = getPageInfo({ intl, paths, application });

  return <Heading data-h2-margin-top="base(0)">{pageInfo.title}</Heading>;
};

const ApplicationSkillsIntroductionPage = () => (
  <ApplicationApi PageComponent={ApplicationSkillsIntroduction} />
);

export default ApplicationSkillsIntroductionPage;
