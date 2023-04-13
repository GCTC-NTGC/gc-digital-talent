import React from "react";
import { useIntl } from "react-intl";
import { PencilSquareIcon } from "@heroicons/react/20/solid";

import { Heading, Link } from "@gc-digital-talent/ui";
import { ApplicationStep } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import { GetApplicationPageInfo } from "~/types/poolCandidate";
import ApplicationApi, { ApplicationPageProps } from "../ApplicationApi";

export const getPageInfo: GetApplicationPageInfo = ({
  application,
  paths,
  intl,
}) => {
  const path = paths.applicationQuestionsIntro(application.id);
  return {
    title: intl.formatMessage({
      defaultMessage: "A few related questions",
      id: "Tdr8r5",
      description:
        "Page title for the application screening questions introduction page",
    }),
    subtitle: intl.formatMessage({
      defaultMessage: "Answer key questions about your fit in this role.",
      id: "GTHuSJ",
      description: "Subtitle for the application screening questions page",
    }),
    icon: PencilSquareIcon,
    omitFromStepper: true,
    crumbs: [
      {
        url: path,
        label: intl.formatMessage({
          defaultMessage: "Step 6 (Intro)",
          id: "9MUsDL",
          description:
            "Breadcrumb link text for the application screening questions introduction page",
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
      ApplicationStep.SkillRequirements,
    ],
    stepSubmitted: null,
  };
};

const ApplicationQuestionsIntroduction = ({
  application,
}: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const pageInfo = getPageInfo({ intl, paths, application });

  return (
    <>
      <Heading data-h2-margin-top="base(0)">{pageInfo.title}</Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "In the final step of the application, we'd like to ask you a handful of opportunity-specific questions that help us understand your unique fit.",
          id: "L5duFP",
          description:
            "Application step for screening questions, introduction description, paragraph one",
        })}
      </p>
      <p data-h2-padding-top="base:(x1)">
        {intl.formatMessage({
          defaultMessage:
            "Your answers will be assessed as a part of your application, so be sure to give each question the time and thought required for an answer that really represents you and your experience.",
          id: "OUXmYd",
          description:
            "Application step for screening questions, introduction description, paragraph two",
        })}
      </p>
      <div data-h2-padding="base:(x2, 0, x2, 0)">
        <hr data-h2-color="base:(gray.lighter)" />
      </div>
      <Link
        type="button"
        color="primary"
        href={paths.applicationQuestions(application.id)}
      >
        {intl.formatMessage({
          defaultMessage: "I'm ready!",
          id: "egLb65",
          description: "An action button to proceed",
        })}
      </Link>
      <Link
        type="button"
        mode="inline"
        color="secondary"
        href={paths.dashboard()}
        data-h2-padding="base:(0, 0, 0, x1)"
      >
        {intl.formatMessage({
          defaultMessage: "Save and quit for now",
          id: "nSBnuF",
          description: "An action button to leave without losing progress",
        })}
      </Link>
    </>
  );
};

const ApplicationQuestionsIntroductionPage = () => (
  <ApplicationApi PageComponent={ApplicationQuestionsIntroduction} />
);

export default ApplicationQuestionsIntroductionPage;
