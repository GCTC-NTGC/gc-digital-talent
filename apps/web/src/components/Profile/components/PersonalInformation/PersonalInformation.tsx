import React from "react";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";
import UserIcon from "@heroicons/react/24/outline/UserIcon";

import { ToggleSection, Well } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { BasicForm } from "@gc-digital-talent/forms";
import { commonMessages } from "@gc-digital-talent/i18n";

import profileMessages from "~/messages/profileMessages";
import {
  hasAllEmptyFields,
  hasEmptyRequiredFields,
} from "~/validators/profile/about";
import ToggleForm from "~/components/ToggleForm/ToggleForm";

import { SectionProps } from "../../types";
import FormActions from "../FormActions";
import useSectionInfo from "../../hooks/useSectionInfo";
import { formValuesToSubmitData, dataToFormValues } from "./utils";
import { FormValues } from "./types";
import NullDisplay from "./NullDisplay";
import Display from "./Display";
import FormFields from "./FormFields";

const PersonalInformation = ({
  user,
  onUpdate,
  isUpdating,
  pool,
}: SectionProps) => {
  const intl = useIntl();
  const isNull = hasAllEmptyFields(user);
  const emptyRequired = hasEmptyRequiredFields(user);
  const { labels, isEditing, setIsEditing, icon, title } = useSectionInfo({
    section: "personal",
    isNull,
    emptyRequired,
    fallbackIcon: UserIcon,
  });

  const handleSubmit: SubmitHandler<FormValues> = async (formValues) => {
    return onUpdate(user.id, formValuesToSubmitData(formValues, user))
      .then((response) => {
        if (response) {
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
        }
      })
      .catch(() => {
        toast.error(intl.formatMessage(profileMessages.updatingFailed));
      });
  };

  return (
    <ToggleSection.Root
      id="personal-section"
      open={isEditing}
      onOpenChange={setIsEditing}
    >
      <ToggleSection.Header
        Icon={icon.icon}
        color={icon.color}
        level={pool ? "h3" : "h2"}
        size={pool ? "h4" : "h3"}
        data-h2-font-weight="base(400)"
        toggle={
          !isNull ? (
            <ToggleForm.Trigger
              aria-label={intl.formatMessage({
                defaultMessage: "Edit personal and contact information",
                id: "WE8ZUX",
                description:
                  "Button text to start editing personal and contact information",
              })}
            >
              {intl.formatMessage(commonMessages.editThisSection)}
            </ToggleForm.Trigger>
          ) : undefined
        }
      >
        {title ? intl.formatMessage(title) : null}
      </ToggleSection.Header>
      {pool && emptyRequired && (
        <Well color="error">
          <p>
            {intl.formatMessage({
              defaultMessage: "You are missing required personal information.",
              id: "QceO8G",
              description:
                "Error message displayed when a users personal information is incomplete",
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

export default PersonalInformation;
