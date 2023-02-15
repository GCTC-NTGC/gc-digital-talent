import React from "react";
import { useIntl } from "react-intl";
import { useSearchParams } from "react-router-dom";
import {
  BookOpenIcon,
  BriefcaseIcon,
  LightBulbIcon,
  StarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { PlusIcon, ArrowLeftIcon } from "@heroicons/react/24/solid";

import Dialog from "@common/components/Dialog";
import { IconButton } from "@common/components/Button";
import { Link } from "@common/components";
import Heading from "@common/components/Heading";

import useRoutes from "~/hooks/useRoutes";
import { Scalars } from "~/api/generated";

type AddExperienceDialogProps = {
  applicantId: Scalars["UUID"];
  defaultOpen?: boolean;
};

interface ExperienceSection {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  buttonText: string;
  buttonPath: string;
}

const AddExperienceDialog = ({
  applicantId,
  defaultOpen = false,
}: AddExperienceDialogProps): JSX.Element => {
  const intl = useIntl();
  const paths = useRoutes();
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get("applicationId");
  const applicationParam = applicationId
    ? `?applicationId=${applicationId}`
    : ``;

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
      buttonPath: `${paths.createWork(applicantId)}${applicationParam}`,
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
      buttonPath: `${paths.createEducation(applicantId)}${applicationParam}`,
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
      buttonPath: `${paths.createCommunity(applicantId)}${applicationParam}`,
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
      buttonPath: `${paths.createPersonal(applicantId)}${applicationParam}`,
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
      buttonPath: `${paths.createAward(applicantId)}${applicationParam}`,
    },
  ];

  return (
    <Dialog.Root defaultOpen={defaultOpen}>
      <Dialog.Trigger>
        <IconButton color="blue" icon={PlusIcon}>
          {intl.formatMessage({
            defaultMessage: "Add a new experience",
            id: "bOAF9o",
            description:
              "Button to open modal to add a new experience to the profile",
          })}
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          color="black"
          subtitle={intl.formatMessage({
            defaultMessage:
              "Get started by selecting the type of experience you would like to add.",
            id: "h5MtHc",
            description: "Subtitle for the Add Experience dialog",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "Add a new experience to your resume",
            id: "yI5DFC",
            description: "Heading for the Add Experience dialog",
          })}
        </Dialog.Header>
        <div data-h2-margin="base(x1, 0)">
          {intl.formatMessage({
            defaultMessage:
              "Before you start describing your experience, first we would like to know what category it falls into. There are five options to choose from, you can add as many experiences to each category as you want.",
            id: "MhgtB6",
            description: "Instructions for the Add Experience dialog",
          })}
        </div>
        <div
          data-h2-margin="base(0, x0.5)"
          data-h2-flex-grid="base(stretch, x2, x1)"
        >
          {experienceSections.map((section) => (
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
                    <Heading level="h3" size="h6">
                      <span
                        data-h2-display="base(inline-block)"
                        data-h2-height="base(x1)"
                        data-h2-width="base(x1)"
                        data-h2-vertical-align="base(middle)"
                        data-h2-margin="base(0, x0.5, 0, 0)"
                      >
                        <section.icon />
                      </span>
                      {section.title}
                    </Heading>
                  </div>
                  <div data-h2-margin-bottom="base(x0.5)">
                    {section.description}
                  </div>
                </div>
                <Link
                  type="button"
                  color="blue"
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
            <IconButton color="purple" icon={ArrowLeftIcon}>
              {intl.formatMessage({
                defaultMessage: "Cancel and go back",
                id: "tiF/jI",
                description: "Close dialog button",
              })}
            </IconButton>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default AddExperienceDialog;
