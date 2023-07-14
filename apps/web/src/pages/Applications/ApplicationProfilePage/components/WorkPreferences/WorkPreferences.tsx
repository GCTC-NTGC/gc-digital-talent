import React from "react";
import HandThumbUpIcon from "@heroicons/react/24/outline/HandThumbUpIcon";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";

import { ToggleSection, Well } from "@gc-digital-talent/ui";
import { BasicForm } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";

import profileMessages from "~/messages/profileMessages";
import {
  hasAllEmptyFields as hasAllEmptyLocationFields,
  hasEmptyRequiredFields as hasEmptyRequiredLocationFields,
} from "~/validators/profile/workLocation";
import {
  hasAllEmptyFields as hasAllEmptyPreferenceFields,
  hasEmptyRequiredFields as hasEmptyRequiredPreferenceFields,
} from "~/validators/profile/workPreferences";

import { SectionProps } from "../../types";
import { dataToFormValues, formValuesToSubmitData } from "./utils";
import { FormValues } from "./types";
import SectionTrigger from "../SectionTrigger";
import FormActions from "../FormActions";
import FormFields from "./FormFields";
import NullDisplay from "./NullDisplay";
import Display from "./Display";
import useSectionInfo from "../../hooks/useSectionInfo";

const WorkPreferences = ({ user, onUpdate, isUpdating }: SectionProps) => {
  const intl = useIntl();
  const isNull =
    hasAllEmptyLocationFields(user) && hasAllEmptyPreferenceFields(user);
  const emptyRequired =
    hasEmptyRequiredLocationFields(user) ||
    hasEmptyRequiredPreferenceFields(user);
  const { labels, isEditing, setIsEditing, icon, title } = useSectionInfo({
    section: "work",
    isNull,
    emptyRequired,
    fallbackIcon: HandThumbUpIcon,
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
    <ToggleSection.Root
      id="work-section"
      open={isEditing}
      onOpenChange={setIsEditing}
    >
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
        {intl.formatMessage(title)}
      </ToggleSection.Header>
      {emptyRequired && (
        <Well color="error">
          <p>
            {intl.formatMessage({
              defaultMessage: "You are missing required work preferences.",
              id: "h30KEc",
              description:
                "Error message displayed when a users work preferences is incomplete",
            })}
          </p>
        </Well>
      )}
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {isNull ? <NullDisplay /> : <Display user={user} />}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <BasicForm
            labels={labels}
            onSubmit={handleSubmit}
            options={{
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
