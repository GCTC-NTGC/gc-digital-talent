import React from "react";
import { useIntl } from "react-intl";
import BookOpenIcon from "@heroicons/react/24/outline/BookOpenIcon";
import BriefcaseIcon from "@heroicons/react/24/outline/BriefcaseIcon";
import LightBulbIcon from "@heroicons/react/24/outline/LightBulbIcon";
import StarIcon from "@heroicons/react/24/outline/StarIcon";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import ArrowLeftIcon from "@heroicons/react/24/solid/ArrowLeftIcon";

import { Dialog, Button, IconType, Link } from "@gc-digital-talent/ui";
import { formMessages } from "@gc-digital-talent/i18n";
import { Scalars } from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import { ExperienceType } from "~/types/experience";

type AddExperienceDialogProps = {
  userId: Scalars["UUID"]["output"];
  defaultOpen?: boolean;
};

interface ExperienceSection {
  icon: IconType;
  title: string;
  description: string;
  buttonText: string;
  buttonPath: string;
  experienceType: ExperienceType;
}

const AddExperienceDialog = ({
  userId,
  defaultOpen = false,
}: AddExperienceDialogProps): JSX.Element => {
  const intl = useIntl();
  const paths = useRoutes();

  const experienceSections: ExperienceSection[] = [
    {
      icon: BriefcaseIcon,
      title: intl.formatMessage({
        defaultMessage: "Work experience",
        id: "giUfys",
        description: "Title for work experience section",
      }),
      description: intl.formatMessage({
        defaultMessage:
          "Share your experiences gained from full-time positions, part-time positions, self-employment, fellowships or internships.",
        id: "tVVb0b",
        description: "Description for work experience section",
      }),
      buttonText: intl.formatMessage({
        defaultMessage: "Add work experience",
        id: "WkD8tV",
        description: "Button text to add a work experience to the profile",
      }),
      buttonPath: paths.createWork(userId),
      experienceType: "work",
    },

    {
      icon: BookOpenIcon,
      title: intl.formatMessage({
        defaultMessage: "Education experience",
        id: "u6LIbY",
        description: "Title for education experience section",
      }),
      description: intl.formatMessage({
        defaultMessage:
          "Got credentials? Share your degree, certificates, online courses, trade apprenticeship, licences or alternative credentials. If you’ve learned something from a recognized educational provider, include your experiences here. ",
        id: "K5UiWg",
        description: "Description for work experience section",
      }),
      buttonText: intl.formatMessage({
        defaultMessage: "Add education experience",
        id: "6XQGne",
        description:
          "Button text to add an education experience to the profile",
      }),
      buttonPath: paths.createEducation(userId),
      experienceType: "education",
    },

    {
      icon: UserGroupIcon,
      title: intl.formatMessage({
        defaultMessage: "Volunteer and community experience",
        id: "Rz7WtH",
        description: "Title for community experience section",
      }),
      description: intl.formatMessage({
        defaultMessage:
          "Gained experience by being part of or giving back to a community? People learn skills from a wide range of experiences like volunteering or being part of non-profit organizations, Indigenous communities, or virtual collaborations. This could be anything from helping during events and ceremonies, DJ-ing at a friends wedding, to gaming and streaming.",
        id: "muduUA",
        description: "Description for community experience section",
      }),
      buttonText: intl.formatMessage({
        defaultMessage: "Add community experience",
        id: "AKRd34",
        description: "Button text to add a community experience to the profile",
      }),
      buttonPath: paths.createCommunity(userId),
      experienceType: "community",
    },

    {
      icon: LightBulbIcon,
      title: intl.formatMessage({
        defaultMessage: "Personal experience",
        id: "wTFUPE",
        description: "Title for personal experience section",
      }),
      description: intl.formatMessage({
        defaultMessage:
          "People are more than just education and work experiences. We want to make space for you to share your learning from other experiences.",
        id: "El/lyl",
        description: "Description for personal experience section",
      }),
      buttonText: intl.formatMessage({
        defaultMessage: "Add personal experience",
        id: "L6UnSl",
        description: "Button text to add a personal experience to the profile",
      }),
      buttonPath: paths.createPersonal(userId),
      experienceType: "personal",
    },

    {
      icon: StarIcon,
      title: intl.formatMessage({
        defaultMessage: "Award",
        id: "+ikQY0",
        description: "Title for award section",
      }),
      description: intl.formatMessage({
        defaultMessage:
          "Did you get recognized for going above and beyond? There are many ways to get recognized, awards are just one of them. ",
        id: "KmqF8d",
        description: "Description for award section",
      }),
      buttonText: intl.formatMessage({
        defaultMessage: "Add award",
        id: "CSg8cH",
        description: "Button text to add an award to the profile",
      }),
      buttonPath: paths.createAward(userId),
      experienceType: "award",
    },
  ];

  return (
    <Dialog.Root defaultOpen={defaultOpen}>
      <Dialog.Trigger>
        <Button color="secondary" icon={PlusCircleIcon}>
          {intl.formatMessage({
            defaultMessage: "Add a new experience",
            id: "bOAF9o",
            description:
              "Button to open modal to add a new experience to the profile",
          })}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "Get started by selecting the type of experience you would like to add.",
            id: "h5MtHc",
            description: "Subtitle for the Add Experience dialog",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Add a new experience to your career timeline",
            id: "YxJELj",
            description: "Heading for the Add Experience dialog",
          })}
        </Dialog.Header>
        <Dialog.Body>
          <div data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              defaultMessage:
                "Before you start describing your experience, first we would like to know what category it falls into. There are five options to choose from, you can add as many experiences to each category as you want.",
              id: "MhgtB6",
              description: "Instructions for the Add Experience dialog",
            })}
          </div>
          <div data-h2-flex-grid="base(stretch, x2, x1)">
            {experienceSections.map(({ icon: Icon, ...section }) => (
              <div
                key={section.title}
                data-h2-margin-bottom="base(x2)"
                data-h2-flex-item="base(1of1) p-tablet(1of2)"
              >
                <div
                  data-h2-display="base(flex)"
                  data-h2-flex-direction="base(column)"
                  data-h2-justify-content="base(space-between)"
                  data-h2-height="base(100%)"
                >
                  <div>
                    <div data-h2-margin="base(x0.5, 0)">
                      <h3
                        data-h2-font-weight="base(700)"
                        data-h2-font-size="base(normal)"
                        data-h2-display="base(flex)"
                        data-h2-align-items="base(center)"
                      >
                        <span
                          data-h2-display="base(inline-block)"
                          data-h2-height="base(x1)"
                          data-h2-width="base(x1)"
                          data-h2-vertical-align="base(middle)"
                          data-h2-margin="base(0, x0.5, 0, 0)"
                        >
                          <Icon />
                        </span>
                        {section.title}
                      </h3>
                    </div>
                    <div data-h2-margin-bottom="base(x0.5)">
                      {section.description}
                    </div>
                  </div>
                  <Link
                    mode="solid"
                    color="secondary"
                    state={{ experienceType: section.experienceType }}
                    href={section.buttonPath}
                    block
                  >
                    {section.buttonText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <Dialog.Footer>
            <Dialog.Close>
              <Button color="primary" icon={ArrowLeftIcon}>
                {intl.formatMessage(formMessages.cancelGoBack)}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AddExperienceDialog;
