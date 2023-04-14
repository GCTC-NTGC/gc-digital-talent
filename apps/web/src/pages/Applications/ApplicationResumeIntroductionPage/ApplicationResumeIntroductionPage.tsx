import React from "react";
import { useIntl } from "react-intl";
import { StarIcon } from "@heroicons/react/20/solid";

import { Heading, Link, Separator } from "@gc-digital-talent/ui";
import { ApplicationStep } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import { GetApplicationPageInfo } from "~/types/poolCandidate";
import { useFeatureFlags } from "@gc-digital-talent/env";
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
    stepSubmitted: null,
    hasError: null,
  };
};

const ApplicationResumeIntroduction = ({
  application,
}: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const pageInfo = getPageInfo({ intl, paths, application });
  const nextStep = paths.applicationResume(application.id);
  const { applicantDashboard } = useFeatureFlags();

  return (
    <>
      <Heading data-h2-margin-top="base(0)">{pageInfo.title}</Heading>
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "The next step is to make sure that your résumé is as up-to-date as possible.",
          id: "kfXCY8",
          description:
            "Application step to begin working on résumé, paragraph one",
        })}
      </p>
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "More specifically, not only do we want to know your <strong>work history</strong>, but we highly value knowing about your <strong>community experience</strong>, <strong>awards</strong>, <strong>personal initiatives</strong>, and <strong>education</strong> too!",
          id: "rpES4b",
          description:
            "Application step to begin working on résumé, paragraph two",
        })}
      </p>
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "Once you’ve completed your resume and are happy with the experiences you’ve added, you’ll use them in further steps to help us better understand how you meet the skill requirements for this opportunity.",
          id: "iK/Vqe",
          description:
            "Application step to begin working on résumé, paragraph three",
        })}
      </p>
      <Separator
        orientation="horizontal"
        data-h2-background-color="base(gray.lighter)"
        data-h2-margin="base(x2, 0)"
        decorative
      />
      <div
        data-h2-display="base(flex)"
        data-h2-gap="base(x.25, x.5)"
        data-h2-flex-wrap="base(wrap)"
        data-h2-flex-direction="base(column) l-tablet(row)"
        data-h2-align-items="base(flex-start) l-tablet(center)"
      >
        <Link type="button" color="primary" mode="solid" href={nextStep}>
          {intl.formatMessage({
            defaultMessage: "Got it, let's go!",
            id: "AOrJqm",
            description: "Link text to continue the application process",
          })}
        </Link>
        <Link
          type="button"
          mode="inline"
          color="secondary"
          href={applicantDashboard ? paths.dashboard() : paths.myProfile()}
        >
          {intl.formatMessage({
            defaultMessage: "Save and quit for now",
            id: "U86N4g",
            description: "Action button to save and exit an application",
          })}
        </Link>
      </div>
    </>
  );
};

const ApplicationResumeIntroductionPage = () => (
  <ApplicationApi PageComponent={ApplicationResumeIntroduction} />
);

export default ApplicationResumeIntroductionPage;
