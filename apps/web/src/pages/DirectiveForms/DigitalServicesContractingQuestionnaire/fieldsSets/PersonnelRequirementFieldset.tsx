import React from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";
import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";

import { Field, Input, Select } from "@gc-digital-talent/forms";
import {
  errorMessages,
  formMessages,
  getLocalizedName,
  getDirectiveFormSkillLevel as getSkillLevel,
} from "@gc-digital-talent/i18n";
import {
  PersonnelLanguage,
  PersonnelScreeningLevel,
  PersonnelTeleworkOption,
  Skill,
  SkillLevel,
} from "@gc-digital-talent/graphql";
import { Button } from "@gc-digital-talent/ui";

import SkillDialog from "~/components/SkillDialog/SkillDialog";
import { FormValues as SkillDialogFormValues } from "~/components/SkillDialog/types";

import { enumToOptions, stringToEnum } from "../../util";
import {
  getPersonnelLanguage,
  getPersonnelScreeningLevel,
  getPersonnelTeleworkOption,
  personnelLanguageSortOrder,
  personnelScreeningLevelSortOrder,
  personnelTeleworkOptionSortOrder,
} from "../../localizedConstants";
import {
  isSkillRequirementFormValues,
  SkillRequirementFormValues,
} from "../formValues";
import useLabels from "../useLabels";

export type PersonnelRequirementFieldsetProps = {
  fieldsetName: string;
  skills: Array<Skill>;
};

const PersonnelRequirementFieldset = ({
  fieldsetName,
  skills,
}: PersonnelRequirementFieldsetProps) => {
  const intl = useIntl();
  const { watch, resetField, register, setValue } = useFormContext();
  register(`${fieldsetName}.skillRequirements`);
  const labels = useLabels();

  // hooks to watch, needed for conditional rendering
  const [selectedSkillRequirementsUntyped, selectedLanguage, selectedSecurity] =
    watch([
      `${fieldsetName}.skillRequirements`,
      `${fieldsetName}.language`,
      `${fieldsetName}.security`,
    ]);

  const selectedSkillRequirements: Array<SkillRequirementFormValues> =
    Array.isArray(selectedSkillRequirementsUntyped) &&
    selectedSkillRequirementsUntyped.every((e) =>
      isSkillRequirementFormValues(e),
    )
      ? selectedSkillRequirementsUntyped
      : [];

  const isLanguageOther = selectedLanguage === PersonnelLanguage.Other;
  const isSecurityOther = selectedSecurity === PersonnelScreeningLevel.Other;
  /**
   * Reset un-rendered fields
   */
  React.useEffect(() => {
    const resetDirtyField = (name: string) => {
      resetField(name, { keepDirty: false, defaultValue: null });
    };

    // Reset all optional fields
    if (!isLanguageOther) {
      resetDirtyField(`${fieldsetName}.languageOther`);
    }
    if (!isSecurityOther) {
      resetDirtyField(`${fieldsetName}.securityOther`);
    }
  }, [resetField, isLanguageOther, fieldsetName, isSecurityOther]);

  const handleSkillDialogSave = (
    values: SkillDialogFormValues,
  ): Promise<void> => {
    if (values.skill && values.skillLevel) {
      const newEntry: SkillRequirementFormValues = {
        skillId: values.skill,
        level: values.skillLevel,
      };
      setValue(`${fieldsetName}.skillRequirements`, [
        ...(selectedSkillRequirements ?? []),
        newEntry,
      ]);
      return Promise.resolve();
    }
    return Promise.reject();
  };

  const removeSkill = (skillId: string) => {
    const newList = (selectedSkillRequirements ?? []).filter(
      (entry) => entry.skillId !== skillId,
    );
    setValue(`${fieldsetName}.skillRequirements`, newList);
  };

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x.5)"
    >
      <Input
        id={`${fieldsetName}.resourceType`}
        name={`${fieldsetName}.resourceType`}
        type="text"
        label={labels.resourceType}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        placeholder={intl.formatMessage({
          defaultMessage: "e.g., software developer",
          id: "rSlYQA",
          description:
            "Placeholder for _type of resource_ field in the _digital services contracting questionnaire_",
        })}
      />
      <Field.Wrapper>
        <Field.Fieldset>
          <Field.Legend>
            {intl.formatMessage({
              defaultMessage: "Qualification and level of expertise",
              id: "0X2Rd2",
              description:
                "Label for _skills_ fieldset in the _digital services contracting questionnaire_",
            })}
          </Field.Legend>
          {selectedSkillRequirements.map((requirement) => {
            const selectedSkillModel = skills.find(
              (s) => s.id === requirement.skillId,
            );
            const selectedSkillFamilyModel = selectedSkillModel?.families
              ?.length
              ? selectedSkillModel?.families[0]
              : null;
            const levelName = getSkillLevel(requirement.level);
            const displayName = intl.formatMessage(
              {
                defaultMessage: "{skillName} at {skillLevel}",
                id: "TPHO1i",
                description:
                  "Display of skill requirement in the _digital services contracting questionnaire_",
              },
              {
                skillName: getLocalizedName(selectedSkillModel?.name, intl),
                skillLevel: intl.formatMessage(levelName),
              },
            );
            return (
              <div
                key={requirement.skillId}
                data-h2-display="base(flex)"
                data-h2-justify-content="base(flex-end)"
                data-h2-gap="base(x0.5)"
              >
                <span data-h2-flex-grow="base(2)">{displayName}</span>
                <SkillDialog
                  skills={skills}
                  context="directive_forms"
                  onSave={handleSkillDialogSave}
                  trigger={{
                    label: intl.formatMessage(
                      {
                        defaultMessage: "Edit<hidden> {displayName}</hidden>",
                        id: "KVx/9C",
                        description:
                          "Button text to edit a personnel skill requirement",
                      },
                      {
                        displayName,
                      },
                    ),
                    icon: null,
                    mode: "text",
                  }}
                  initialState={{
                    skill: requirement.skillId,
                    skillLevel: stringToEnum(SkillLevel, requirement.level),
                    category: selectedSkillModel?.category,
                    family: selectedSkillFamilyModel?.id,
                  }}
                />
                <Button
                  onClick={() => removeSkill(requirement.skillId)}
                  icon={XMarkIcon}
                  mode="inline"
                  color="error"
                  aria-label={intl.formatMessage(
                    {
                      defaultMessage: "Delete {displayName}",
                      id: "XOTpWf",
                      description:
                        "Hidden button text to delete a personnel skill requirement",
                    },
                    {
                      displayName,
                    },
                  )}
                />
              </div>
            );
          })}
          <SkillDialog
            skills={skills}
            context="directive_forms"
            onSave={handleSkillDialogSave}
            trigger={{ block: true }}
          />
        </Field.Fieldset>
      </Field.Wrapper>
      <Select
        id={`${fieldsetName}.language`}
        name={`${fieldsetName}.language`}
        label={labels.language}
        nullSelection={intl.formatMessage(formMessages.defaultPlaceholder)}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        doNotSort
        options={enumToOptions(
          PersonnelLanguage,
          personnelLanguageSortOrder,
        ).map((option) => {
          return {
            value: option.value as string,
            label: intl.formatMessage(getPersonnelLanguage(option.value)),
          };
        })}
      />
      {isLanguageOther ? (
        <Input
          id={`${fieldsetName}.languageOther`}
          name={`${fieldsetName}.languageOther`}
          type="text"
          label={labels.languageOther}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      ) : null}
      <Select
        id={`${fieldsetName}.security`}
        name={`${fieldsetName}.security`}
        label={labels.security}
        nullSelection={intl.formatMessage(formMessages.defaultPlaceholder)}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        doNotSort
        options={enumToOptions(
          PersonnelScreeningLevel,
          personnelScreeningLevelSortOrder,
        ).map((option) => {
          return {
            value: option.value as string,
            label: intl.formatMessage(getPersonnelScreeningLevel(option.value)),
          };
        })}
      />
      {isSecurityOther ? (
        <Input
          id={`${fieldsetName}.securityOther`}
          name={`${fieldsetName}.securityOther`}
          type="text"
          label={labels.securityOther}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      ) : null}
      <Select
        id={`${fieldsetName}.telework`}
        name={`${fieldsetName}.telework`}
        label={labels.telework}
        nullSelection={intl.formatMessage(formMessages.defaultPlaceholder)}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        doNotSort
        options={enumToOptions(
          PersonnelTeleworkOption,
          personnelTeleworkOptionSortOrder,
        ).map((option) => {
          return {
            value: option.value as string,
            label: intl.formatMessage(getPersonnelTeleworkOption(option.value)),
          };
        })}
      />
      <Input
        id={`${fieldsetName}.quantity`}
        name={`${fieldsetName}.quantity`}
        type="number"
        label={labels.quantity}
        rules={{
          required: intl.formatMessage(errorMessages.required),
          min: {
            value: 1,
            message: intl.formatMessage(errorMessages.mustBeGreater, {
              value: 0,
            }),
          },
        }}
      />
    </div>
  );
};

export default PersonnelRequirementFieldset;
