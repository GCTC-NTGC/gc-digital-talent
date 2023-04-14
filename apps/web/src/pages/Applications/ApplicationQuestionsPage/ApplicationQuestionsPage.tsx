import React from "react";
import { useIntl } from "react-intl";
import { PencilSquareIcon } from "@heroicons/react/20/solid";

import { Heading } from "@gc-digital-talent/ui";
import {
  Applicant,
  ApplicationStep,
  PoolAdvertisement,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import { GetApplicationPageInfo } from "~/types/poolCandidate";
import { screeningQuestionsSectionHasMissingResponses } from "~/validators/profile";
import ApplicationApi, { ApplicationPageProps } from "../ApplicationApi";

export const getPageInfo: GetApplicationPageInfo = ({
  application,
  paths,
  intl,
}) => {
  const path = paths.applicationQuestions(application.id);
  return {
    title: intl.formatMessage({
      defaultMessage: "Screening questions",
      id: "sTij/C",
      description: "Page title for the application screening questions page",
    }),
    subtitle: intl.formatMessage({
      defaultMessage: "Answer key questions about your fit in this role.",
      id: "GTHuSJ",
      description: "Subtitle for the application screening questions page",
    }),
    icon: PencilSquareIcon,
    crumbs: [
      {
        url: path,
        label: intl.formatMessage({
          defaultMessage: "Step 6",
          id: "wWnEgP",
          description:
            "Breadcrumb link text for the application screening questions page",
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
    stepSubmitted: ApplicationStep.ScreeningQuestions,
    hasError: (applicant: Applicant, poolAdvertisement: PoolAdvertisement) => {
      return screeningQuestionsSectionHasMissingResponses(
        application,
        poolAdvertisement,
      );
    },
  };
};

const ApplicationQuestions = ({ application }: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const pageInfo = getPageInfo({ intl, paths, application });

  return <Heading data-h2-margin-top="base(0)">{pageInfo.title}</Heading>;
};

const ApplicationQuestionsPage = () => (
  <ApplicationApi PageComponent={ApplicationQuestions} />
);

export default ApplicationQuestionsPage;
