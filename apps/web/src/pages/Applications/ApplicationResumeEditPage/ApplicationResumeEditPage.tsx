import React from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import StarIcon from "@heroicons/react/20/solid/StarIcon";

import { Heading, Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { ApplicationStep } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/pages";
import { AnyExperience } from "~/types/experience";
import {
  useGetApplicationQuery,
  useGetMyExperiencesQuery,
} from "~/api/generated";

import { ApplicationPageProps } from "../ApplicationApi";
import EditExperienceForm from "./components/ExperienceEditForm";

export const getPageInfo: GetPageNavInfo = ({
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
    subtitle: intl.formatMessage({
      defaultMessage: "Update and review your résumé information.",
      id: "OkREUg",
      description: "Subtitle for the application résumé page",
    }),
    icon: StarIcon,
    omitFromStepper: true,
    crumbs: [
      {
        url: paths.applicationResume(application.id),
        label: intl.formatMessage({
          defaultMessage: "Step 3",
          id: "khjfel",
          description: "Breadcrumb link text for the application résumé page",
        }),
      },
      {
        url: path,
        label: intl.formatMessage({
          defaultMessage: "Edit Experience",
          id: "dTJT+y",
          description:
            "Breadcrumb link text for the application résumé edit experience page",
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

interface ApplicationResumeEditProps extends ApplicationPageProps {
  experience: AnyExperience;
}

const ApplicationResumeEdit = ({
  application,
  experience,
}: ApplicationResumeEditProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { experienceId } = useParams();
  const pageInfo = getPageInfo({
    intl,
    paths,
    application,
    resourceId: experienceId,
  });

  return (
    <>
      <Heading data-h2-margin-top="base(0)">{pageInfo.title}</Heading>
      <p data-h2-margin="base(0)">
        {intl.formatMessage({
          defaultMessage:
            "From here you can edit this experience. Don't forget, work experiences should focus on describing  your part-time, full-time, self-employment, fellowship, non-profit, or internship experiences.",
          id: "zMZQLY",
          description: "Description for editing an experience.",
        })}
      </p>
      <EditExperienceForm
        applicationId={application.id}
        experience={experience}
      />
    </>
  );
};

const ApplicationResumeEditPage = () => {
  const { applicationId, experienceId } = useParams();
  const [
    {
      data: applicationData,
      fetching: applicationFetching,
      error: applicationError,
    },
  ] = useGetApplicationQuery({
    variables: {
      id: applicationId || "",
    },
  });
  const [
    {
      data: experienceData,
      fetching: experienceFetching,
      error: experienceError,
    },
  ] = useGetMyExperiencesQuery();

  const application = applicationData?.poolCandidate;
  const experience = experienceData?.me?.experiences?.find(
    (exp) => exp?.id === experienceId,
  );

  return (
    <Pending
      fetching={applicationFetching || experienceFetching}
      error={applicationError || experienceError}
    >
      {application?.poolAdvertisement && experience ? (
        <ApplicationResumeEdit
          application={application}
          experience={experience}
        />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export default ApplicationResumeEditPage;
