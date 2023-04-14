import React from "react";
import { HandThumbUpIcon } from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";

import { Button, ToggleSection } from "@gc-digital-talent/ui";
import {
  BasicForm,
  RadioGroup,
  Checklist,
  enumToOptions,
  TextArea,
} from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import {
  OperationalRequirementV2,
  errorMessages,
  getOperationalRequirement,
  getWorkRegionsDetailed,
} from "@gc-digital-talent/i18n";

import profileMessages from "~/messages/profileMessages";
import { WorkRegion } from "~/api/generated";

import { SectionProps } from "../../types";
import { getSectionIcon } from "../../utils";
import { getLabels, dataToFormValues, formValuesToSubmitData } from "./utils";
import { FormValues } from "./types";
import SectionTrigger from "../SectionTrigger";
import WithEllipsisPrefix from "./WithEllipsisPrefix";
import FormActions from "../FormActions";

const WorkPreferences = ({ user, onUpdate, isUpdating }: SectionProps) => {
  const intl = useIntl();
  const labels = getLabels(intl);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const icon = getSectionIcon({
    isEditing,
    error: false,
    completed: false,
    fallback: HandThumbUpIcon,
  });

  const handleSubmit: SubmitHandler<FormValues> = async (formValues) => {
    await onUpdate(user.id, formValuesToSubmitData(formValues))
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Work preferences updated successfully!",
            id: "bt0WcN",
            description:
              "Message displayed when a user successfully updates their work preferences.",
          }),
        );
        setIsEditing(false);
      })
      .catch(() => {
        toast.error(intl.formatMessage(profileMessages.updatingFailed));
      });
  };

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
          <BasicForm
            labels={labels}
            onSubmit={handleSubmit}
            options={{
              mode: "onChange",
              defaultValues: dataToFormValues(user),
            }}
          >
            <RadioGroup
              idPrefix="required-work-preferences"
              legend={labels.wouldAcceptTemporary}
              name="wouldAcceptTemporary"
              id="wouldAcceptTemporary"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              items={[
                {
                  value: "true",
                  label: (
                    <WithEllipsisPrefix>
                      {intl.formatMessage({
                        defaultMessage:
                          "any duration. (short term, long term, or indeterminate duration)",
                        id: "uHx3G7",
                        description:
                          "Label displayed on Work Preferences form for any duration option",
                      })}
                    </WithEllipsisPrefix>
                  ),
                },
                {
                  value: "false",
                  label: intl.formatMessage({
                    defaultMessage:
                      "...indeterminate duration only. (permanent only)",
                    id: "sYqIp5",
                    description:
                      "Label displayed on Work Preferences form for indeterminate duration option.",
                  }),
                },
              ]}
            />
            <Checklist
              idPrefix="optional-work-preferences"
              legend={labels.acceptedOperationalRequirements}
              name="acceptedOperationalRequirements"
              id="acceptedOperationalRequirements"
              items={OperationalRequirementV2.map((value) => ({
                value,
                label: (
                  <WithEllipsisPrefix>
                    {intl.formatMessage(
                      getOperationalRequirement(value, "firstPerson"),
                    )}
                  </WithEllipsisPrefix>
                ),
              }))}
            />
            <Checklist
              idPrefix="work-location"
              legend={labels.locationPreferences}
              name="locationPreferences"
              id="locationPreferences"
              items={enumToOptions(WorkRegion).map(({ value }) => ({
                value,
                label: intl.formatMessage(getWorkRegionsDetailed(value)),
              }))}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <TextArea
              id="location-exemptions"
              label={labels.locationExemptions}
              name="locationExemptions"
              describedBy="location-exemption-description"
              placeholder={intl.formatMessage({
                defaultMessage: "Optionally, add a city or village here...",
                id: "OH5tTS",
                description:
                  "Location Exemptions field placeholder for work location preference form",
              })}
            />
            <div
              id="location-exemption-description"
              data-h2-margin="base(-x.75, 0 , x1, 0)"
            >
              <p data-h2-font-size="base(caption)">
                {intl.formatMessage({
                  defaultMessage:
                    "Indicate if there is a city that you would like to exclude from a region.",
                  id: "1CuGS6",
                  description:
                    "Explanation text for Location exemptions field in work location preference form",
                })}
              </p>
              <p
                data-h2-color="base(gray.dark)"
                data-h2-font-size="base(caption)"
              >
                {intl.formatMessage({
                  defaultMessage:
                    "E.g.: You want to be considered for the Quebec region, but not for Montréal.",
                  id: "2K7dVp",
                  description:
                    "Example for Location exemptions field in work location preference form",
                })}
              </p>
            </div>
            <FormActions isUpdating={isUpdating} />
          </BasicForm>
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default WorkPreferences;
