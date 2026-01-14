import { useIntl } from "react-intl";
import StarIcon from "@heroicons/react/20/solid/StarIcon";
import BriefcaseIcon from "@heroicons/react/20/solid/BriefcaseIcon";
import BookOpenIcon from "@heroicons/react/20/solid/BookOpenIcon";
import UserGroupIcon from "@heroicons/react/20/solid/UserGroupIcon";
import LightBulbIcon from "@heroicons/react/20/solid/LightBulbIcon";

import { Accordion, DescriptionList, Heading } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/applicationStep";
import experienceMessages from "~/messages/experienceMessages";
import { organizationSuggestionsFromExperiences } from "~/utils/experienceUtils";
import poolCandidateMessages from "~/messages/poolCandidateMessages";

import ApplicationApi, { ApplicationPageProps } from "../ApplicationApi";
import { useApplicationContext } from "../ApplicationContext";
import AddExperienceForm from "./components/AddExperienceForm";

export const getPageInfo: GetPageNavInfo = ({
  application,
  paths,
  intl,
  stepOrdinal,
}) => {
  const path = paths.applicationCareerTimelineAdd(application.id);
  return {
    title: intl.formatMessage({
      defaultMessage: "Add an experience to your career timeline",
      id: "gU/nxf",
      description: "Title for application career timeline add experience",
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
        label: intl.formatMessage(poolCandidateMessages.assessmentStepNumber, {
          stepNumber: stepOrdinal,
        }),
      },
      {
        url: paths.applicationCareerTimelineAdd(application.id),
        label: intl.formatMessage({
          defaultMessage: "Add experience",
          id: "g1WB3B",
          description: "Title for add experience page",
        }),
      },
    ],
    link: {
      url: path,
    },
  };
};

const ApplicationCareerTimelineAdd = ({
  application,
}: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { currentStepOrdinal } = useApplicationContext();
  const pageInfo = getPageInfo({
    intl,
    paths,
    application,
    stepOrdinal: currentStepOrdinal,
  });

  const applicationExperiences = unpackMaybes(application.user.experiences);
  const organizationsForAutocomplete = organizationSuggestionsFromExperiences(
    applicationExperiences,
  );

  return (
    <>
      <Heading size="h3" className="mt-0 font-normal">
        {pageInfo.title}
      </Heading>
      <p className="my-6">
        {intl.formatMessage({
          defaultMessage:
            "This form allows you to add a new experience to your career timeline. Get started by selecting the type of experience you'd like to add.",
          id: "EI0GEZ",
          description:
            "Instructions on how to add an experience to your career timeline",
        })}
      </p>
      <Accordion.Root size="sm" type="multiple">
        <Accordion.Item value="learn-more">
          <Accordion.Trigger as="h3">
            {intl.formatMessage({
              defaultMessage: "Types of experience you can add",
              id: "EJ09b7",
              description:
                "Button text to open section describing experience types",
            })}
          </Accordion.Trigger>
          <Accordion.Content>
            <p className="mt-6">
              {intl.formatMessage({
                defaultMessage:
                  "We all have a variety of accomplishments and experiences that shape our careers and skills. Share only what you would be comfortable to share at work. On this platform, you can add the following to your career timeline:",
                id: "mpcA6q",
                description:
                  "Lead-in text for the list of experience type definitions",
              })}
            </p>
            <DescriptionList.Root>
              <DescriptionList.Item
                color="secondary"
                icon={BriefcaseIcon}
                title={intl.formatMessage(experienceMessages.work)}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "Part-time or full-time employment, self-employment, fellowships, or internships.",
                  id: "4QF+9d",
                  description: "Description for work experience section",
                })}
              </DescriptionList.Item>
              <DescriptionList.Item
                color="secondary"
                icon={BookOpenIcon}
                title={intl.formatMessage(experienceMessages.education)}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "Diplomas, certificates, online courses, apprenticeships, licences, or other credentials received from educational institutions.",
                  id: "8BU+HQ",
                  description: "Description for education experience section",
                })}
              </DescriptionList.Item>
              <DescriptionList.Item
                color="secondary"
                icon={UserGroupIcon}
                title={intl.formatMessage(experienceMessages.community)}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "Activities in your community that have helped you grow, including volunteering and organizing ceremonies or events.",
                  id: "oN0FFl",
                  description: "Description for community experience section",
                })}
              </DescriptionList.Item>
              <DescriptionList.Item
                color="secondary"
                icon={LightBulbIcon}
                title={intl.formatMessage(experienceMessages.personal)}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "Other activities that have helped you grow and develop your skills, including hobbies, family activities, and extracurricular activities.",
                  id: "baSmVn",
                  description: "Description for personal experience section",
                })}
              </DescriptionList.Item>
              <DescriptionList.Item
                color="secondary"
                icon={StarIcon}
                title={intl.formatMessage(experienceMessages.award)}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "Awards you've received or other ways you've been recognized for going above and beyond.",
                  id: "8J5O+T",
                  description: "Description for award experience section",
                })}
              </DescriptionList.Item>
            </DescriptionList.Root>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
      <AddExperienceForm
        applicationId={application.id}
        organizationSuggestions={organizationsForAutocomplete}
      />
    </>
  );
};

export const Component = () => (
  <ApplicationApi PageComponent={ApplicationCareerTimelineAdd} />
);

Component.displayName = "ApplicationCareerTimelineAddPage";

export default Component;
