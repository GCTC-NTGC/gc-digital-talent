import React from "react";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";
import { BuildingLibraryIcon } from "@heroicons/react/24/outline";

import { Button, ToggleSection } from "@gc-digital-talent/ui";
import { BasicForm } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import { notEmpty } from "@gc-digital-talent/helpers";

import profileMessages from "~/messages/profileMessages";
import { useGetProfileFormOptionsQuery } from "~/api/generated";

import { SectionProps } from "../../types";
import { getSectionIcon } from "../../utils";
import SectionTrigger from "../SectionTrigger";
import { dataToFormValues, formValuesToSubmitData, getLabels } from "./utils";
import { FormValues } from "./types";
import FormFields from "./FormFields";
import FormActions from "../FormActions";

const GovernmentInformation = ({
  user,
  onUpdate,
  isUpdating,
}: SectionProps) => {
  const intl = useIntl();
  const labels = getLabels(intl);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const icon = getSectionIcon({
    isEditing,
    error: false,
    completed: false,
    fallback: BuildingLibraryIcon,
  });
  const [{ data }] = useGetProfileFormOptionsQuery();
  const classifications = data?.classifications.filter(notEmpty) || [];
  const departments = data?.departments.filter(notEmpty) || [];

  const handleSubmit: SubmitHandler<FormValues> = async (formValues) => {
    await onUpdate(user.id, formValuesToSubmitData(formValues, classifications))
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Government information updated successfully!",
            id: "dVc2uY",
            description:
              "Message displayed when a user successfully updates their government employee information.",
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
          <BasicForm
            labels={labels}
            onSubmit={handleSubmit}
            options={{
              mode: "onBlur",
              defaultValues: dataToFormValues(user),
            }}
          >
            <FormFields
              labels={labels}
              departments={departments}
              classifications={classifications}
            />
            <FormActions isUpdating={isUpdating} />
          </BasicForm>
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default GovernmentInformation;
