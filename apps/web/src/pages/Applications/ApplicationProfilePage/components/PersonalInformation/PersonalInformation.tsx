import React from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";

import { Button, ToggleSection } from "@gc-digital-talent/ui";

import { SectionProps } from "../../types";
import { getSectionIcon } from "../../utils";
import SectionTrigger from "../SectionTrigger";

const PersonalInformation = ({ user, onUpdate }: SectionProps) => {
  const intl = useIntl();
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const icon = getSectionIcon({
    isEditing,
    error: false,
    completed: false,
    fallback: UserIcon,
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
              defaultMessage: "Edit personal and contact information",
              id: "WE8ZUX",
              description:
                "Button text to start editing personal and contact information",
            })}
          </SectionTrigger>
        }
      >
        {intl.formatMessage({
          defaultMessage: "Personal and contact information",
          id: "fyEFN7",
          description:
            "Heading for the personal info section on the application profile",
        })}
      </ToggleSection.Header>

      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          <div data-h2-text-align="base(center)">
            <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x1)">
              {intl.formatMessage({
                defaultMessage:
                  "This section covers basic information about you and your contact preferences.",
                id: "Kg8PlJ",
                description:
                  "Descriptive text explaining the personal information section of the application profile",
              })}
            </p>
            <p>
              <ToggleSection.Open>
                <Button mode="inline">
                  {intl.formatMessage({
                    defaultMessage:
                      "Get started<hidden> on your personal and contact information</hidden>",
                    id: "LqCaFZ",
                    description:
                      "Call to action to begin editing personal and contact information",
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

export default PersonalInformation;
