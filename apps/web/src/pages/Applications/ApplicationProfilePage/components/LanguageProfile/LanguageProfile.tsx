import React from "react";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";
import { LanguageIcon } from "@heroicons/react/24/outline";

import { ToggleSection } from "@gc-digital-talent/ui";
import { BasicForm, Checklist } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";

import profileMessages from "~/messages/profileMessages";

import { SectionProps } from "../../types";
import { getSectionIcon } from "../../utils";
import SectionTrigger from "../SectionTrigger";
import {
  dataToFormValues,
  formValuesToSubmitData,
  getConsideredLangItems,
  getLabels,
} from "./utils";
import ConsideredLanguages from "./ConsideredLanguages";
import FormActions from "../FormActions";
import { FormValues } from "./types";
import NullDisplay from "./NullDisplay";
import Display from "./Display";

const LanguageProfile = ({ user, onUpdate, isUpdating }: SectionProps) => {
  const intl = useIntl();
  const labels = getLabels(intl);
  const isNull = false;
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const icon = getSectionIcon({
    isEditing,
    error: false,
    completed: false,
    fallback: LanguageIcon,
  });

  const consideredLangOptions = getConsideredLangItems(intl);

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
    <ToggleSection.Root open={isEditing} onOpenChange={setIsEditing}>
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
        {intl.formatMessage({
          defaultMessage: "Language profile",
          id: "Rn3HMc",
          description:
            "Heading for the language profile section on the application profile",
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
              defaultValues: dataToFormValues(user),
            }}
          >
            <Checklist
              idPrefix="considered-position-languages"
              legend={labels.consideredPositionLanguages}
              name="consideredPositionLanguages"
              id="consideredPositionLanguages"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
              items={consideredLangOptions}
            />
            <ConsideredLanguages labels={labels} />
            <FormActions isUpdating={isUpdating} />
          </BasicForm>
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default LanguageProfile;
