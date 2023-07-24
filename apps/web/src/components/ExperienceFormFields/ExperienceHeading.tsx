import {
  Accordion,
  DefinitionList,
  Heading,
  StandardAccordionHeader,
} from "@gc-digital-talent/ui";
import BookOpenIcon from "@heroicons/react/20/solid/BookOpenIcon";
import BriefcaseIcon from "@heroicons/react/20/solid/BriefcaseIcon";
import LightBulbIcon from "@heroicons/react/20/solid/LightBulbIcon";
import StarIcon from "@heroicons/react/20/solid/StarIcon";
import UserGroupIcon from "@heroicons/react/20/solid/UserGroupIcon";
import PencilSquareIcon from "@heroicons/react/24/outline/PencilSquareIcon";
import PlusCircleIcon from "@heroicons/react/24/outline/PlusCircleIcon";
import * as React from "react";
import { useIntl } from "react-intl";
import { experienceTypeTitles } from "~/pages/Applications/ApplicationResumeAddPage/messages";

type AccordionStates = "learn-more" | "";

interface ExperienceHeadingProps {
  edit?: boolean;
}

const ExperienceHeading = ({ edit }: ExperienceHeadingProps) => {
  const intl = useIntl();
  const [accordionState, setAccordionState] =
    React.useState<AccordionStates>("");

  return (
    <div>
      {edit ? (
        <>
          <Heading data-h2-margin-top="base(0)" data-h2-display="base(flex)">
            <PencilSquareIcon
              data-h2-color="base(primary)"
              data-h2-width="base(x1.5)"
              data-h2-display="base(inline-block)"
              data-h2-vertical-align="base(middle)"
              data-h2-margin="base(0, x.25, 0, 0)"
            />
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
                "This form allows you to edit a specific experience, its details, and linked skills. Don’t forget, work experiences should focus on describing  your part-time, full-time, self-employment, fellowship, non-profit, or internship experiences.",
              id: "AxMJL1",
              description:
                "Instructions on how to add an experience to your résumé",
            })}
          </p>
        </>
      ) : (
        <>
          <Heading data-h2-margin-top="base(0)" data-h2-display="base(flex)">
            <PlusCircleIcon
              data-h2-color="base(primary)"
              data-h2-width="base(x1.5)"
              data-h2-display="base(inline-block)"
              data-h2-vertical-align="base(middle)"
              data-h2-margin="base(0, x.25, 0, 0)"
            />
            {intl.formatMessage({
              defaultMessage: "Add a new experience",
              id: "bOAF9o",
              description:
                "Button to open modal to add a new experience to the profile",
            })}
          </Heading>
          <p data-h2-margin="base(x1, 0)">
            {intl.formatMessage({
              defaultMessage:
                "This form allows you to add a new experience to your résumé. Get started by selecting the type of experience you’d like to add. If you need more information about what a certain type can include, expand the information below to see examples.",
              id: "F5KhNJ",
              description:
                "Instructions on how to add an experience to your résumé",
            })}
          </p>
          <Accordion.Root
            type="single"
            mode="simple"
            value={accordionState}
            onValueChange={(value: AccordionStates) => setAccordionState(value)}
            collapsible
          >
            <Accordion.Item value="learn-more">
              <StandardAccordionHeader headingAs="h3">
                {accordionState === "learn-more"
                  ? intl.formatMessage({
                      defaultMessage:
                        "Hide more information about the types of experience you can add to your résumé",
                      id: "4wzX3f",
                      description:
                        "Button text to close accordion describing skill experience",
                    })
                  : intl.formatMessage({
                      defaultMessage:
                        "Learn more about the types of experience you can add",
                      id: "h5OdMq",
                      description:
                        "Button text to open section describing experience types",
                    })}
                {}
              </StandardAccordionHeader>
              <Accordion.Content>
                <p data-h2-margin-top="base(x1)">
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
                      description:
                        "Description for education experience section",
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
                      description:
                        "Description for community experience section",
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
                      description:
                        "Description for personal experience section",
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
        </>
      )}
    </div>
  );
};

export default ExperienceHeading;
