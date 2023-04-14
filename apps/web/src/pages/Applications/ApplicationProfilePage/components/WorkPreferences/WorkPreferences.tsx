import React from "react";
import { HandThumbUpIcon } from "@heroicons/react/24/outline";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";

import { ToggleSection } from "@gc-digital-talent/ui";
import { BasicForm } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";

import profileMessages from "~/messages/profileMessages";

import { SectionProps } from "../../types";
import { getSectionIcon } from "../../utils";
import { getLabels, dataToFormValues, formValuesToSubmitData } from "./utils";
import { FormValues } from "./types";
import SectionTrigger from "../SectionTrigger";
import FormActions from "../FormActions";
import FormFields from "./FormFields";
import NullDisplay from "./NullDisplay";
import Display from "./Display";

const WorkPreferences = ({ user, onUpdate, isUpdating }: SectionProps) => {
  const intl = useIntl();
  const labels = getLabels(intl);
  const isNull = false;
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
          {isNull ? <NullDisplay /> : <Display user={user} />}
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
            <FormFields labels={labels} />
            <FormActions isUpdating={isUpdating} />
          </BasicForm>
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default WorkPreferences;
