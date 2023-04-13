import React from "react";
import { HandThumbUpIcon } from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";

import { Button, ToggleSection } from "@gc-digital-talent/ui";

import { SectionProps } from "../../types";
import { getSectionIcon } from "../../utils";
import SectionTrigger from "../SectionTrigger";

const WorkPreferences = ({ user, onUpdate }: SectionProps) => {
  const intl = useIntl();
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const icon = getSectionIcon({
    isEditing,
    error: false,
    completed: false,
    fallback: HandThumbUpIcon,
  });

  return (
    <ToggleSection.Root open={isEditing} onOpenChange={setIsEditing}>
      <ToggleSection.Header
        Icon={icon.icon}
        color={icon.color}
        level="h3"
        size="h5"
        toggle={
          <SectionTrigger>
            {intl.formatMessage({
              defaultMessage: "Edit work preferences",
              id: "w63YYp",
              description: "Button text to start editing work preferences",
            })}
          </SectionTrigger>
        }
      >
        {intl.formatMessage({
          defaultMessage: "Work preferences",
          id: "XTaRza",
          description:
            "Heading for the work preferences section on the application profile",
        })}
      </ToggleSection.Header>

      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          <div data-h2-text-align="base(center)">
            <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x1)">
              {intl.formatMessage({
                defaultMessage:
                  "This section asks about your preferences when it comes to job opportunities and work locations.",
                id: "ngYP95",
                description:
                  "Descriptive text explaining the work preferences section of the application profile",
              })}
            </p>
            <p>
              <ToggleSection.Open>
                <Button mode="inline">
                  {intl.formatMessage({
                    defaultMessage:
                      "Get started<hidden> on your Work preferences</hidden>",
                    id: "2W6Q3k",
                    description:
                      "Call to action to begin editing work preferences",
                  })}
                </Button>
              </ToggleSection.Open>
            </p>
          </div>
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <p>Form here</p>
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default WorkPreferences;
