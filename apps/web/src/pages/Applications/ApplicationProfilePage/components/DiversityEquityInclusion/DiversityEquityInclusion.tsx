import React from "react";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";

import { Button, ToggleSection } from "@gc-digital-talent/ui";

import { SectionProps } from "../../types";
import { getSectionIcon } from "../../utils";
import SectionTrigger from "../SectionTrigger";

const DiversityEquityInclusion = ({ user, onUpdate }: SectionProps) => {
  const intl = useIntl();
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const icon = getSectionIcon({
    isEditing,
    error: false,
    completed: false,
    fallback: UserCircleIcon,
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
              defaultMessage: "Edit diversity, equity, and inclusion",
              id: "UqkLAz",
              description: "Button text to start editing equity information",
            })}
          </SectionTrigger>
        }
      >
        {intl.formatMessage({
          defaultMessage: "Diversity, equity, and inclusion",
          id: "u1N0nT",
          description:
            "Heading for the diversity, equity, and inclusion section on the application profile",
        })}
      </ToggleSection.Header>

      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          <div data-h2-text-align="base(center)">
            <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x1)">
              {intl.formatMessage({
                defaultMessage:
                  "This optional section asks you whether you would like to identify as a part of an equity group.",
                id: "/3sMii",
                description:
                  "Descriptive text explaining the diversity, equity, and inclusion section of the application profile",
              })}
            </p>
            <p>
              <ToggleSection.Open>
                <Button mode="inline">
                  {intl.formatMessage({
                    defaultMessage:
                      "Get started<hidden> on diversity, equity, and inclusion</hidden>",
                    id: "o5SbFT",
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

export default DiversityEquityInclusion;
