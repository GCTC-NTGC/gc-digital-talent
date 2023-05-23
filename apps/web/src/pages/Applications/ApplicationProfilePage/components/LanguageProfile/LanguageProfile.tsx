import React from "react";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";
import LanguageIcon from "@heroicons/react/24/outline/LanguageIcon";

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
import SectionTrigger from "../SectionTrigger";
import { dataToFormValues, formValuesToSubmitData } from "./utils";
import FormActions from "../FormActions";
import { FormValues } from "./types";
import NullDisplay from "./NullDisplay";
import Display from "./Display";
import FormFields from "./FormFields";
import useSectionInfo from "../../hooks/useSectionInfo";

const LanguageProfile = ({
  user,
  application,
  onUpdate,
  isUpdating,
}: SectionProps) => {
  const intl = useIntl();
  const isNull = hasAllEmptyFields(user);
  const emptyRequired = hasEmptyRequiredFields(user);
  const { labels, isEditing, setIsEditing, icon, title } = useSectionInfo({
    section: "language",
    isNull,
    emptyRequired,
    fallbackIcon: LanguageIcon,
  });

  const missingLanguageRequirements = getMissingLanguageRequirements(
    user as Applicant,
    application?.pool,
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

  return (
    <ToggleSection.Root
      id="language-section"
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
          poolAdvertisement={application?.pool}
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
