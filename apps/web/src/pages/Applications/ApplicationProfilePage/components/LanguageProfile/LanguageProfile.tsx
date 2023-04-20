import React from "react";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";
import { LanguageIcon } from "@heroicons/react/24/outline";

import { ToggleSection, Well } from "@gc-digital-talent/ui";
import { BasicForm } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";

import MissingLanguageRequirements from "~/components/MissingLanguageRequirements";
import profileMessages from "~/messages/profileMessages";
import {
  hasEmptyRequiredFields,
  hasAllEmptyFields,
} from "~/validators/profile/languageInformation";
import { getMissingLanguageRequirements } from "~/utils/languageUtils";
import { Applicant } from "~/api/generated";

import { SectionProps } from "../../types";
import { getSectionIcon, getSectionTitle } from "../../utils";
import SectionTrigger from "../SectionTrigger";
import { dataToFormValues, formValuesToSubmitData, getLabels } from "./utils";
import FormActions from "../FormActions";
import { FormValues } from "./types";
import NullDisplay from "./NullDisplay";
import Display from "./Display";
import { useProfileFormContext } from "../ProfileFormContext";
import FormFields from "./FormFields";

const LanguageProfile = ({
  user,
  application,
  onUpdate,
  isUpdating,
}: SectionProps) => {
  const intl = useIntl();
  const labels = getLabels(intl);
  const isNull = hasAllEmptyFields(user);
  const emptyRequired = hasEmptyRequiredFields(user);
  const { toggleDirty } = useProfileFormContext();
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const title = getSectionTitle("language");
  const icon = getSectionIcon({
    isEditing,
    error: !isNull && emptyRequired,
    completed: !isNull && !emptyRequired,
    fallback: LanguageIcon,
  });

  const missingLanguageRequirements = getMissingLanguageRequirements(
    user as Applicant,
    application?.poolAdvertisement,
  );

  const handleSubmit: SubmitHandler<FormValues> = async (formValues) => {
    await onUpdate(user.id, formValuesToSubmitData(formValues))
      .then(() => {
        toast.success(
          intl.formatMessage({
            defaultMessage: "Language profile updated successfully!",
            id: "43VEQA",
            description:
              "Message displayed when a user successfully updates their language profile.",
          }),
        );
        setIsEditing(false);
      })
      .catch(() => {
        toast.error(intl.formatMessage(profileMessages.updatingFailed));
      });
  };

  const handleOpenChange = (newIsEditing: boolean) => {
    setIsEditing(newIsEditing);
    if (!newIsEditing) {
      toggleDirty("language", false);
    }
  };

  return (
    <ToggleSection.Root
      id="language-section"
      open={isEditing}
      onOpenChange={handleOpenChange}
    >
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
        {intl.formatMessage(title)}
      </ToggleSection.Header>
      {emptyRequired && (
        <Well color="error">
          <p>
            {intl.formatMessage({
              defaultMessage: "You are missing required language information.",
              id: "F4RHJu",
              description:
                "Error message displayed when a users language information is incomplete",
            })}
          </p>
        </Well>
      )}
      {missingLanguageRequirements.length > 0 && (
        <MissingLanguageRequirements
          headingLevel="h3"
          applicant={user as Applicant}
          poolAdvertisement={application?.poolAdvertisement}
        />
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

export default LanguageProfile;
