import React from "react";
import { LanguageIcon } from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";

import { Button, ToggleSection } from "@gc-digital-talent/ui";

import { SectionProps } from "../../types";
import { getSectionIcon } from "../../utils";
import SectionTrigger from "../SectionTrigger";

const LanguageProfile = ({ user, onUpdate }: SectionProps) => {
  const intl = useIntl();
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const icon = getSectionIcon({
    isEditing,
    error: false,
    completed: false,
    fallback: LanguageIcon,
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
              defaultMessage: "Edit language profile",
              id: "fxPLAl",
              description: "Button text to start editing language profile",
            })}
          </SectionTrigger>
        }
      >
        {intl.formatMessage({
          defaultMessage: "Language profile",
          id: "Rn3HMc",
          description:
            "Heading for the language profile section on the application profile",
        })}
      </ToggleSection.Header>

      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          <div data-h2-text-align="base(center)">
            <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x1)">
              {intl.formatMessage({
                defaultMessage:
                  "This section asks about your first and second language proficiencies.",
                id: "N6kGOU",
                description:
                  "Descriptive text explaining the language profile section of the application profile",
              })}
            </p>
            <p>
              <ToggleSection.Open>
                <Button mode="inline">
                  {intl.formatMessage({
                    defaultMessage:
                      "Get started<hidden> on your language profile</hidden>",
                    id: "hBDz/h",
                    description:
                      "Call to action to begin editing language profile",
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

export default LanguageProfile;
