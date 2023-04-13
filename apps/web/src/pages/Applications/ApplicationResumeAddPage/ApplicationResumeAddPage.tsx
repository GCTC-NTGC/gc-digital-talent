import React from "react";
import { useIntl } from "react-intl";
import {
  StarIcon,
  BriefcaseIcon,
  BookOpenIcon,
  UserGroupIcon,
  LightBulbIcon,
} from "@heroicons/react/20/solid";

import { Accordion, DefinitionList, Heading } from "@gc-digital-talent/ui";
import { ApplicationStep } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import { GetApplicationPageInfo } from "~/types/poolCandidate";

import ApplicationApi, { ApplicationPageProps } from "../ApplicationApi";
import AddExperienceForm from "./components/AddExperienceForm";
import { experienceTypeTitles } from "./messages";

export const getPageInfo: GetApplicationPageInfo = ({
  application,
  paths,
  intl,
}) => {
  const path = paths.applicationResumeAdd(application.id);
  return {
    title: intl.formatMessage({
      defaultMessage: "Add an experience to your résumé",
      id: "fBabZh",
      description: "Page title for the application résumé add experience page",
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
        url: paths.applicationResumeAdd(application.id),
        label: intl.formatMessage({
          defaultMessage: "Add Experience",
          id: "8hnUdh",
          description:
            "Breadcrumb link text for the application résumé add experience page",
        }),
      },
    ],
    link: {
      url: path,
    },
    prerequisites: [ApplicationStep.Welcome, ApplicationStep.ReviewYourProfile],
    stepSubmitted: null,
  };
};

const ApplicationResumeAdd = ({ application }: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const pageInfo = getPageInfo({ intl, paths, application });

  return (
    <>
      <Heading data-h2-margin-top="base(0)">{pageInfo.title}</Heading>
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "This form allows you to add a new experience to your résumé. Get started by selecting the type of experience you’d like to add. If you need more information about what a certain type can include, expand the information below to see examples.",
          id: "F5KhNJ",
          description:
            "Instructions on how to add an experience to your résumé",
        })}
      </p>
      <Accordion.Root type="multiple" mode="simple">
        <Accordion.Item value="learn-more">
          <Accordion.Trigger headerAs="h3">
            {intl.formatMessage({
              defaultMessage:
                "Learn more about the types of experience you can add",
              id: "h5OdMq",
              description:
                "Button text to open section describing experience types",
            })}
          </Accordion.Trigger>
          <Accordion.Content>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "We all have a variety of accomplishments and experiences that shape both our careers and skills. Please only share what you would be comfortable sharing with a coworker. On this platform, you can add the following to your résumé:",
                id: "0jNQ/I",
                description:
                  "Lead-in text for the list of experience type definitions",
              })}
            </p>
            <DefinitionList.Root>
              <DefinitionList.Item
                Icon={BriefcaseIcon}
                title={intl.formatMessage(experienceTypeTitles.work)}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "Share your part-time, full-time, self-employment, fellowship, non-profit, or internship experiences.",
                  id: "GNHnrr",
                  description: "Description for work experience section",
                })}
              </DefinitionList.Item>
              <DefinitionList.Item
                Icon={BookOpenIcon}
                title={intl.formatMessage(experienceTypeTitles.education)}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "Share your diplomas, certificates, online courses, apprenticeships, licenses, or alternative credentials received from educational institutions.",
                  id: "VW3KlZ",
                  description: "Description for education experience section",
                })}
              </DefinitionList.Item>
              <DefinitionList.Item
                Icon={UserGroupIcon}
                title={intl.formatMessage(experienceTypeTitles.community)}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "Share how participating in your community has helped you grow, including volunteering, ceremony, events, and virtual collaboration.",
                  id: "a1Cych",
                  description: "Description for community experience section",
                })}
              </DefinitionList.Item>
              <DefinitionList.Item
                Icon={LightBulbIcon}
                title={intl.formatMessage(experienceTypeTitles.personal)}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "Share how other life events have helped you grow and develop your skills, including family, hobbies, and extracurricular activities.",
                  id: "+5+rJS",
                  description: "Description for personal experience section",
                })}
              </DefinitionList.Item>
              <DefinitionList.Item
                Icon={StarIcon}
                title={intl.formatMessage(experienceTypeTitles.award)}
              >
                {intl.formatMessage({
                  defaultMessage:
                    "Share specific awards and recognition you've received for going above and beyond.",
                  id: "IWJ/Qi",
                  description: "Description for award experience section",
                })}
              </DefinitionList.Item>
            </DefinitionList.Root>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
      <AddExperienceForm applicationId={application.id} />
    </>
  );
};

const ApplicationResumeAddPage = () => (
  <ApplicationApi PageComponent={ApplicationResumeAdd} />
);

export default ApplicationResumeAddPage;
