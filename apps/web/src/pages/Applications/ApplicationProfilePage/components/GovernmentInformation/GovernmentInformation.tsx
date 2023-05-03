import React from "react";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";
import { BuildingLibraryIcon } from "@heroicons/react/24/outline";

import { ToggleSection, Well } from "@gc-digital-talent/ui";
import { BasicForm } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import { notEmpty } from "@gc-digital-talent/helpers";

import profileMessages from "~/messages/profileMessages";
import { useGetProfileFormOptionsQuery } from "~/api/generated";
import {
  hasEmptyRequiredFields,
  hasAllEmptyFields,
} from "~/validators/profile/governmentInformation";

import { SectionProps } from "../../types";
import SectionTrigger from "../SectionTrigger";
import { dataToFormValues, formValuesToSubmitData } from "./utils";
import { FormValues } from "./types";
import FormActions from "../FormActions";
import FormFields from "./FormFields";
import NullDisplay from "./NullDisplay";
import Display from "./Display";
import useSectionInfo from "../../hooks/useSectionInfo";

const GovernmentInformation = ({
  user,
  onUpdate,
  isUpdating,
}: SectionProps) => {
  const isNull = hasAllEmptyFields(user);
  const emptyRequired = hasEmptyRequiredFields(user);
  const intl = useIntl();
  const { labels, isEditing, setIsEditing, icon, title } = useSectionInfo({
    section: "government",
    isNull,
    emptyRequired,
    fallbackIcon: BuildingLibraryIcon,
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
    <ToggleSection.Root
      id="government-section"
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
              defaultMessage: "Edit government information",
              id: "Ysf8wI",
              description:
                "Button text to start editing government information",
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
              defaultMessage:
                "You are missing required government information.",
              id: "Rq14QK",
              description:
                "Error message displayed when a users government information is incomplete",
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
