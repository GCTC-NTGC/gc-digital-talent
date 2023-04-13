import React from "react";
import { BuildingLibraryIcon } from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";

import { Button, ToggleSection } from "@gc-digital-talent/ui";

import { SectionProps } from "../../types";
import { getSectionIcon } from "../../utils";
import SectionTrigger from "../SectionTrigger";

const GovernmentInformation = ({ user, onUpdate }: SectionProps) => {
  const intl = useIntl();
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const icon = getSectionIcon({
    isEditing,
    error: false,
    completed: false,
    fallback: BuildingLibraryIcon,
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
              defaultMessage: "Edit government information",
              id: "Ysf8wI",
              description:
                "Button text to start editing government information",
            })}
          </SectionTrigger>
        }
      >
        {intl.formatMessage({
          defaultMessage: "Government employee information",
          id: "AwzZwe",
          description:
            "Heading for the government information section on the application profile",
        })}
      </ToggleSection.Header>

      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          <div data-h2-text-align="base(center)">
            <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x1)">
              {intl.formatMessage({
                defaultMessage:
                  "This section asks whether you are currently a Government of Canada employee and other related questions.",
                id: "CRXFbo",
                description:
                  "Descriptive text explaining the government information section of the application profile",
              })}
            </p>
            <p>
              <ToggleSection.Open>
                <Button mode="inline">
                  {intl.formatMessage({
                    defaultMessage:
                      "Get started<hidden> on your government employee information</hidden>",
                    id: "yXXj1D",
                    description:
                      "Call to action to begin editing government information",
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

export default GovernmentInformation;
