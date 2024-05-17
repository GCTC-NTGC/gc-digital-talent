import { useIntl } from "react-intl";
import StarIcon from "@heroicons/react/20/solid/StarIcon";

import { Heading, ThrowNotFound } from "@gc-digital-talent/ui";
import { Experience } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/applicationStep";
import { AnyExperience } from "~/types/experience";
import applicationMessages from "~/messages/applicationMessages";
import useRequiredParams from "~/hooks/useRequiredParams";

import { ApplicationPageProps } from "../ApplicationApi";
import { useApplicationContext } from "../ApplicationContext";
import EditExperienceForm from "./components/ExperienceEditForm";
import useApplication from "../useApplication";

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
          defaultMessage: "Edit experience",
          id: "zsUuN9",
          description: "Title for edit experience page",
        }),
      },
    ],
    link: {
      url: path,
    },
  };
};

type RouteParams = {
  experienceId: string;
  applicationId: string;
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
  const { experienceId } = useRequiredParams<RouteParams>("experienceId", true);
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
      <Heading size="h3" className="mt-0">
        {pageInfo.title}
      </Heading>
      <p className="mt-6">
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

export const Component = () => {
  const { application } = useApplication();
  const { experienceId } = useRequiredParams<RouteParams>(
    ["experienceId", "applicationId"],
    true,
  );

  const experiences: Experience[] = unpackMaybes(application.user?.experiences);
  const experience = experiences?.find((exp) => exp?.id === experienceId);

  return application && experience ? (
    <ApplicationCareerTimelineEdit
      application={application}
      experience={experience}
    />
  ) : (
    <ThrowNotFound />
  );
};

Component.displayName = "ApplicationCareerTimelineEditPage";
