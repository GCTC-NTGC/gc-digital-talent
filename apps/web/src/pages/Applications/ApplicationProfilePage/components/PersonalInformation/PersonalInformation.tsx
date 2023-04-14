import React from "react";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";
import { UserIcon } from "@heroicons/react/24/outline";

import { Button, ToggleSection } from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import {
  BasicForm,
  Input,
  RadioGroup,
  Select,
  enumToOptions,
} from "@gc-digital-talent/forms";
import {
  errorMessages,
  getArmedForcesStatusesProfile,
  getCitizenshipStatusesProfile,
  getLanguage,
  getProvinceOrTerritory,
} from "@gc-digital-talent/i18n";

import profileMessages from "~/messages/profileMessages";
import { Language, ProvinceOrTerritory } from "~/api/generated";

import {
  getLabels,
  formValuesToSubmitData,
  dataToFormValues,
  armedForcesStatusOrdered,
  citizenshipStatusesOrdered,
} from "./utils";
import { FormValues } from "./types";
import { SectionProps } from "../../types";
import { getSectionIcon } from "../../utils";
import SectionTrigger from "../SectionTrigger";
import FormActions from "../FormActions";

const PersonalInformation = ({ user, onUpdate }: SectionProps) => {
  const intl = useIntl();
  const labels = getLabels(intl);
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
          <div data-h2-text-align="base(center)">
            <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x1)">
              {intl.formatMessage({
                defaultMessage:
                  "This section covers basic information about you and your contact preferences.",
                id: "Kg8PlJ",
                description:
                  "Descriptive text explaining the personal information section of the application profile",
              })}
            </p>
            <p>
              <ToggleSection.Open>
                <Button mode="inline">
                  {intl.formatMessage({
                    defaultMessage:
                      "Get started<hidden> on your personal and contact information</hidden>",
                    id: "LqCaFZ",
                    description:
                      "Call to action to begin editing personal and contact information",
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
            <div
              data-h2-display="base(grid)"
              data-h2-grid-template-columns="base(1fr 1fr)"
              data-h2-gap="base(0 x1)"
              data-h2-margin-top="base(-x1)"
            >
              <Input
                id="firstName"
                name="firstName"
                type="text"
                label={labels.firstName}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
              <Input
                id="lastName"
                name="lastName"
                type="text"
                label={labels.lastName}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
              <Input
                id="email"
                name="email"
                type="email"
                label={labels.email}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
              <Input
                id="telephone"
                name="telephone"
                type="tel"
                label={labels.telephone}
                placeholder={intl.formatMessage({
                  defaultMessage: "+123243234",
                  id: "FmN1eN",
                  description:
                    "Placeholder displayed on the About Me form telephone field.",
                })}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
              <Select
                id="currentProvince"
                name="currentProvince"
                label={labels.currentProvince}
                nullSelection={intl.formatMessage({
                  defaultMessage: "Select a province or territory...",
                  id: "M6PbPI",
                  description:
                    "Placeholder displayed on the About Me form province or territory field.",
                })}
                options={enumToOptions(ProvinceOrTerritory).map(
                  ({ value }) => ({
                    value,
                    label: intl.formatMessage(getProvinceOrTerritory(value)),
                  }),
                )}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
              <Input
                id="currentCity"
                name="currentCity"
                type="text"
                label={labels.currentCity}
                placeholder={intl.formatMessage({
                  defaultMessage: "Start writing here...",
                  id: "xq6TbG",
                  description:
                    "Placeholder displayed on the About Me form current city field.",
                })}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
            </div>
            <div
              data-h2-display="base(grid)"
              data-h2-gap="l-tablet(0 x1)"
              data-h2-grid-template-columns="l-tablet(1fr 1fr 1fr)"
            >
              <Select
                id="preferredLang"
                label={labels.preferredLang}
                name="preferredLang"
                rules={{ required: intl.formatMessage(errorMessages.required) }}
                nullSelection={intl.formatMessage({
                  defaultMessage: "Select a language...",
                  id: "wRxZQV",
                  description:
                    "Placeholder displayed on the About Me form preferred communication language",
                })}
                options={enumToOptions(Language).map(({ value }) => ({
                  value,
                  label: intl.formatMessage(getLanguage(value)),
                }))}
              />
              <Select
                id="preferredLanguageForInterview"
                label={labels.preferredLanguageForInterview}
                name="preferredLanguageForInterview"
                rules={{ required: intl.formatMessage(errorMessages.required) }}
                nullSelection={intl.formatMessage({
                  defaultMessage: "Select a language...",
                  id: "JCyvcW",
                  description:
                    "Placeholder displayed on the About Me form preferred interview language",
                })}
                options={enumToOptions(Language).map(({ value }) => ({
                  value,
                  label: intl.formatMessage(getLanguage(value)),
                }))}
              />
              <Select
                id="preferredLanguageForExam"
                label={labels.preferredLanguageForExam}
                name="preferredLanguageForExam"
                rules={{ required: intl.formatMessage(errorMessages.required) }}
                nullSelection={intl.formatMessage({
                  defaultMessage: "Select a language...",
                  id: "PBl2Rj",
                  description:
                    "Placeholder displayed on the About Me form preferred exam language",
                })}
                options={enumToOptions(Language).map(({ value }) => ({
                  value,
                  label: intl.formatMessage(getLanguage(value)),
                }))}
              />
            </div>
            <div data-h2-margin-bottom="base(x1)">
              <RadioGroup
                idPrefix="armedForcesStatus"
                legend={labels.armedForcesStatus}
                name="armedForcesStatus"
                id="armedForcesStatus"
                rules={{ required: intl.formatMessage(errorMessages.required) }}
                items={armedForcesStatusOrdered.map((status) => ({
                  value: status,
                  label: intl.formatMessage(
                    getArmedForcesStatusesProfile(status),
                  ),
                }))}
              />
            </div>
            <div data-h2-margin-bottom="base(x1)">
              <RadioGroup
                idPrefix="citizenship"
                legend={labels.citizenship}
                name="citizenship"
                id="citizenship"
                rules={{ required: intl.formatMessage(errorMessages.required) }}
                items={citizenshipStatusesOrdered.map((status) => ({
                  value: status,
                  label: intl.formatMessage(
                    getCitizenshipStatusesProfile(status),
                  ),
                }))}
                context={intl.formatMessage({
                  defaultMessage:
                    "Preference will be given to Canadian citizens and permanent residents of Canada",
                  id: "fI6Hjf",
                  description:
                    "Context text for required citizenship status section in About Me form, explaining preference",
                })}
              />
            </div>
            <FormActions />
          </BasicForm>
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default PersonalInformation;
