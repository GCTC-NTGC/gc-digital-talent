import { useIntl } from "react-intl";
import StarIcon from "@heroicons/react/20/solid/StarIcon";
import BriefcaseIcon from "@heroicons/react/20/solid/BriefcaseIcon";
import BookOpenIcon from "@heroicons/react/20/solid/BookOpenIcon";
import UserGroupIcon from "@heroicons/react/20/solid/UserGroupIcon";
import LightBulbIcon from "@heroicons/react/20/solid/LightBulbIcon";

import { Accordion, DescriptionList, Heading } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/applicationStep";
import applicationMessages from "~/messages/applicationMessages";
import experienceMessages from "~/messages/experienceMessages";

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
        label: intl.formatMessage(applicationMessages.numberedStep, {
          stepOrdinal,
        }),
      },
      {
        url: paths.applicationCareerTimelineAdd(application.id),
        label: intl.formatMessage({
          defaultMessage: "Add Experience",
          id: "K+ZIOB",
          description:
            "Breadcrumb link text for the application career timeline add experience page",
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

  return (
    <>
      <Heading
        data-h2-margin-top="base(0)"
        size="h3"
        data-h2-font-weight="base(400)"
      >
        {pageInfo.title}
      </Heading>
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "This form allows you to add a new experience to your career timeline. Get started by selecting the type of experience you’d like to add. If you need more information about what a certain type can include, expand the information below to see examples.",
          id: "myEzIh",
          description:
            "Instructions on how to add an experience to your career timeline",
        })}
      </p>
      <Accordion.Root size="sm" type="multiple">
        <Accordion.Item value="learn-more">
          <Accordion.Trigger as="h3">
            {intl.formatMessage({
              defaultMessage:
                "Learn more about the types of experience you can add",
              id: "h5OdMq",
              description:
                "Button text to open section describing experience types",
            })}
          </Accordion.Trigger>
          <Accordion.Content>
            <p data-h2-margin-top="base(x1)">
              {intl.formatMessage({
                defaultMessage:
                  "We all have a variety of accomplishments and experiences that shape both our careers and skills. Please only share what you would be comfortable sharing with a coworker. On this platform, you can add the following to your career timeline:",
                id: "OYjVy4",
                description:
                  "Lead-in text for the list of experience type definitions",
              })}
            </p>
            <DescriptionList.Root>
              <DescriptionList.Item
                Icon={BriefcaseIcon}
                title={intl.formatMessage(experienceMessages.work)}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "Share your part-time, full-time, self-employment, fellowship, non-profit, or internship experiences.",
                  id: "GNHnrr",
                  description: "Description for work experience section",
                })}
              </DescriptionList.Item>
              <DescriptionList.Item
                Icon={BookOpenIcon}
                title={intl.formatMessage(experienceMessages.education)}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "Share your diplomas, certificates, online courses, apprenticeships, licenses, or alternative credentials received from educational institutions.",
                  id: "VW3KlZ",
                  description: "Description for education experience section",
                })}
              </DescriptionList.Item>
              <DescriptionList.Item
                Icon={UserGroupIcon}
                title={intl.formatMessage(experienceMessages.community)}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "Share how participating in your community has helped you grow, including volunteering, ceremony, events, and virtual collaboration.",
                  id: "a1Cych",
                  description: "Description for community experience section",
                })}
              </DescriptionList.Item>
              <DescriptionList.Item
                Icon={LightBulbIcon}
                title={intl.formatMessage(experienceMessages.personal)}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "Share how other life events have helped you grow and develop your skills, including family, hobbies, and extracurricular activities.",
                  id: "+5+rJS",
                  description: "Description for personal experience section",
                })}
              </DescriptionList.Item>
              <DescriptionList.Item
                Icon={StarIcon}
                title={intl.formatMessage(experienceMessages.award)}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "Share specific awards and recognition you've received for going above and beyond.",
                  id: "IWJ/Qi",
                  description: "Description for award experience section",
                })}
              </DescriptionList.Item>
            </DescriptionList.Root>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
      <AddExperienceForm applicationId={application.id} />
    </>
  );
};

export const Component = () => (
  <ApplicationApi PageComponent={ApplicationCareerTimelineAdd} />
);

Component.displayName = "ApplicationCareerTimelineAddPage";
