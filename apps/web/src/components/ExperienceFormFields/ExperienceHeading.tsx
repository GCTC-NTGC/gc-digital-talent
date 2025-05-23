import { useState } from "react";
import { useIntl } from "react-intl";
import BookOpenIcon from "@heroicons/react/20/solid/BookOpenIcon";
import BriefcaseIcon from "@heroicons/react/20/solid/BriefcaseIcon";
import LightBulbIcon from "@heroicons/react/20/solid/LightBulbIcon";
import StarIcon from "@heroicons/react/20/solid/StarIcon";
import UserGroupIcon from "@heroicons/react/20/solid/UserGroupIcon";
import PencilSquareIcon from "@heroicons/react/24/outline/PencilSquareIcon";
import PlusCircleIcon from "@heroicons/react/24/outline/PlusCircleIcon";

import { Accordion, DescriptionList, Heading } from "@gc-digital-talent/ui";

import experienceMessages from "~/messages/experienceMessages";

type AccordionStates = "learn-more" | "";

interface ExperienceHeadingProps {
  edit?: boolean;
}

const ExperienceHeading = ({ edit }: ExperienceHeadingProps) => {
  const intl = useIntl();
  const [accordionState, setAccordionState] = useState<AccordionStates>("");

  return (
    <div>
      {edit ? (
        <>
          <Heading
            icon={PencilSquareIcon}
            color="secondary"
            data-h2-margin-top="base(0)"
            data-h2-display="base(flex)"
            size="h3"
            data-h2-font-weight="base(400)"
          >
            {intl.formatMessage({
              defaultMessage: "Edit an experience",
              id: "RzXSJ9",
              description:
                "Button to open modal to add a new experience to the profile",
            })}
          </Heading>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              defaultMessage:
                "This form allows you to edit a specific experience, its details, and linked skills. Don’t forget, work experiences should focus on describing your part-time, full-time, self-employment, fellowship, non-profit, or internship experiences.",
              id: "9Eh1nm",
              description:
                "Instructions on how to add an experience to your career timeline",
            })}
          </p>
        </>
      ) : (
        <>
          <Heading
            icon={PlusCircleIcon}
            color="secondary"
            data-h2-margin-top="base(0)"
            data-h2-display="base(flex)"
            size="h3"
            data-h2-font-weight="base(400)"
          >
            {intl.formatMessage(experienceMessages.addNewExperience)}
          </Heading>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              defaultMessage:
                "This form allows you to add a new experience to your career timeline. Get started by selecting the type of experience you'd like to add.",
              id: "EI0GEZ",
              description:
                "Instructions on how to add an experience to your career timeline",
            })}
          </p>
          <Accordion.Root
            type="single"
            size="sm"
            value={accordionState}
            onValueChange={(value: AccordionStates) => setAccordionState(value)}
            collapsible
          >
            <Accordion.Item value="learn-more">
              <Accordion.Trigger as="h3">
                {accordionState === "learn-more"
                  ? intl.formatMessage({
                      defaultMessage:
                        "Hide more information about the types of experience you can add to your career timeline",
                      id: "DxqFM1",
                      description:
                        "Button text to close accordion describing skill experience",
                    })
                  : intl.formatMessage({
                      defaultMessage: "Types of experience you can add",
                      id: "EJ09b7",
                      description:
                        "Button text to open section describing experience types",
                    })}
                {}
              </Accordion.Trigger>
              <Accordion.Content>
                <p>
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
                    Icon={BriefcaseIcon}
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
                    Icon={BookOpenIcon}
                    title={intl.formatMessage(experienceMessages.education)}
                  >
                    {intl.formatMessage({
                      defaultMessage:
                        "Diplomas, certificates, online courses, apprenticeships, licences, or other credentials received from educational institutions.",
                      id: "8BU+HQ",
                      description:
                        "Description for education experience section",
                    })}
                  </DescriptionList.Item>
                  <DescriptionList.Item
                    Icon={UserGroupIcon}
                    title={intl.formatMessage(experienceMessages.community)}
                  >
                    {intl.formatMessage({
                      defaultMessage:
                        "Activities in your community that have helped you grow, including volunteering and organizing ceremonies or events.",
                      id: "oN0FFl",
                      description:
                        "Description for community experience section",
                    })}
                  </DescriptionList.Item>
                  <DescriptionList.Item
                    Icon={LightBulbIcon}
                    title={intl.formatMessage(experienceMessages.personal)}
                  >
                    {intl.formatMessage({
                      defaultMessage:
                        "Other activities that have helped you grow and develop your skills, including hobbies, family activities, and extracurricular activities.",
                      id: "baSmVn",
                      description:
                        "Description for personal experience section",
                    })}
                  </DescriptionList.Item>
                  <DescriptionList.Item
                    Icon={StarIcon}
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
        </>
      )}
    </div>
  );
};

export default ExperienceHeading;
