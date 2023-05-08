import React from "react";
import { useIntl } from "react-intl";
import SparklesIcon from "@heroicons/react/20/solid/SparklesIcon";

import { Heading, Link, Separator } from "@gc-digital-talent/ui";
import { ApplicationStep } from "@gc-digital-talent/graphql";
import { useFeatureFlags } from "@gc-digital-talent/env";

import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/pages";
import ApplicationApi, { ApplicationPageProps } from "../ApplicationApi";

export const getPageInfo: GetPageNavInfo = ({ application, paths, intl }) => {
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
    hasError: null,
  };
};

const ApplicationSkillsIntroduction = ({
  application,
}: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const pageInfo = getPageInfo({ intl, paths, application });
  const { applicantDashboard } = useFeatureFlags();

  return (
    <>
      <Heading data-h2-margin-top="base(0)">{pageInfo.title}</Heading>
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "The next step is the most important piece of your application where you'll be asked to talk about how you meet the skill requirements for this role.",
          id: "ikYbDD",
          description:
            "Application step for skill requirements, introduction, description, paragraph one",
        })}
      </p>
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "In the same way that you selected items from your résumé to confirm the experience and education requirements, we'll ask you to describe one or more experiences from your résumé where you actively used the required skill.",
          id: "pKLIzg",
          description:
            "Application step for skill requirements, introduction, description, paragraph two",
        })}
      </p>
      <Separator
        orientation="horizontal"
        decorative
        data-h2-background="base(black.light)"
        data-h2-margin="base(x2, 0)"
      />
      <div
        data-h2-display="base(flex)"
        data-h2-gap="base(x.25, x.5)"
        data-h2-flex-wrap="base(wrap)"
        data-h2-flex-direction="base(column) l-tablet(row)"
        data-h2-align-items="base(flex-start) l-tablet(center)"
      >
        <Link
          href={paths.applicationSkills(application.id)}
          mode="solid"
          type="button"
          color="primary"
        >
          {intl.formatMessage({
            defaultMessage: "Let's get to it!",
            id: "PnyBYM",
            description: "Action button to move to the next step",
          })}
        </Link>
        <Link
          href={applicantDashboard ? paths.dashboard() : paths.myProfile()}
          mode="inline"
          type="button"
          color="secondary"
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

const ApplicationSkillsIntroductionPage = () => (
  <ApplicationApi PageComponent={ApplicationSkillsIntroduction} />
);

export default ApplicationSkillsIntroductionPage;
