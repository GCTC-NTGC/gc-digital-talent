import React from "react";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";
import { UserIcon } from "@heroicons/react/24/outline";

import { ToggleSection } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { BasicForm } from "@gc-digital-talent/forms";

import profileMessages from "~/messages/profileMessages";

import { getLabels, formValuesToSubmitData, dataToFormValues } from "./utils";
import { FormValues } from "./types";
import { SectionProps } from "../../types";
import { getSectionIcon } from "../../utils";
import SectionTrigger from "../SectionTrigger";
import FormActions from "../FormActions";
import NullDisplay from "./NullDisplay";
import Display from "./Display";
import FormFields from "./FormFields";

const PersonalInformation = ({ user, onUpdate, isUpdating }: SectionProps) => {
  const intl = useIntl();
  const labels = getLabels(intl);
  const isNull = false;
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const icon = getSectionIcon({
    isEditing,
    error: false,
    completed: false,
    fallback: UserIcon,
  });

  const handleSubmit: SubmitHandler<FormValues> = async (formValues) => {
    await onUpdate(user.id, formValuesToSubmitData(formValues, user))
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage:
              "Personal and contact information updated successfully!",
            id: "J+MAUg",
            description:
              "Message displayed when a user successfully updates their personal and contact information.",
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

export default PersonalInformation;
