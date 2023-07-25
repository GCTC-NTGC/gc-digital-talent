import React from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";
import StarIcon from "@heroicons/react/20/solid/StarIcon";

import { Heading, Pending, ThrowNotFound } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/applicationStep";
import { AnyExperience } from "~/types/experience";
import {
  useGetApplicationQuery,
  useGetMyExperiencesQuery,
} from "~/api/generated";
import applicationMessages from "~/messages/applicationMessages";

import { ApplicationPageProps } from "../ApplicationApi";
import EditExperienceForm from "./components/ExperienceEditForm";
import { useApplicationContext } from "../ApplicationContext";

export const getPageInfo: GetPageNavInfo = ({
  application,
  paths,
  resourceId,
  intl,
  stepOrdinal,
}) => {
  const path = paths.applicationCareerTimelineEdit(
    application.id,
    resourceId ?? "",
  );
  return {
    title: intl.formatMessage({
      defaultMessage: "Edit your experience",
      id: "QRI/bf",
      description:
        "Page title for the application career timeline edit experience page",
    }),
    subtitle: intl.formatMessage({
      defaultMessage: "Update and review your career timeline information.",
      id: "5dFzBc",
      description: "Subtitle for the application career timeline page",
    }),
    icon: StarIcon,
    crumbs: [
      {
        url: paths.applicationCareerTimeline(application.id),
        label: intl.formatMessage(applicationMessages.numberedStep, {
          stepOrdinal,
        }),
      },
      {
        url: path,
        label: intl.formatMessage({
          defaultMessage: "Edit Experience",
          id: "nnRlUH",
          description:
            "Breadcrumb link text for the application career timeline edit experience page",
        }),
      },
    ],
    link: {
      url: path,
    },
  };
};

interface ApplicationCareerTimelineEditProps extends ApplicationPageProps {
  experience: AnyExperience;
}

const ApplicationCareerTimelineEdit = ({
  application,
  experience,
}: ApplicationCareerTimelineEditProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { experienceId } = useParams();
  const { currentStepOrdinal } = useApplicationContext();
  const pageInfo = getPageInfo({
    intl,
    paths,
    application,
    resourceId: experienceId,
    stepOrdinal: currentStepOrdinal,
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

const ApplicationCareerTimelineEditPage = () => {
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
    requestPolicy: "cache-first",
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
      {application && experience ? (
        <ApplicationCareerTimelineEdit
          application={application}
          experience={experience}
        />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export default ApplicationCareerTimelineEditPage;
