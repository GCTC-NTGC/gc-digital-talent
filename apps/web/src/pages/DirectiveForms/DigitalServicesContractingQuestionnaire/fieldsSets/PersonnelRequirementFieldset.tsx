import React from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";
import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon";

import { Field, Input, Select } from "@gc-digital-talent/forms";
import {
  errorMessages,
  formMessages,
  getLocalizedName,
  getSkillLevel,
} from "@gc-digital-talent/i18n";
import {
  PersonnelLanguage,
  PersonnelScreeningLevel,
  PersonnelTeleworkOption,
  Skill,
} from "@gc-digital-talent/graphql";
import { Button } from "@gc-digital-talent/ui";

import SkillDialog from "~/components/SkillDialog/SkillDialog";
import { FormValues as SkillDialogFormValues } from "~/components/SkillDialog/types";

import { enumToOptions } from "../../util";
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

type PersonnelRequirementFieldsetProps = {
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
      resetField(name, { keepDirty: false });
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
    if (values.skill && values.level) {
      const newEntry: SkillRequirementFormValues = {
        skillId: values.skill,
        level: values.level,
      };
      setValue(`${fieldsetName}.skillRequirements`, [
        ...(selectedSkillRequirements ?? []),
        newEntry,
      ]);
    }
    return Promise.resolve();
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
        label={intl.formatMessage({
          defaultMessage: "Type of resource",
          id: "UW3Z2a",
          description:
            "Label for _type of resource_ fieldset in the _digital services contracting questionnaire_",
        })}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
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
            const skillName = skills.find((s) => s.id === requirement.skillId);
            const levelName = getSkillLevel(requirement.level);
            return (
              <div
                key={requirement.skillId}
                data-h2-display="base(flex)"
                data-h2-justify-content="base(space-between)"
              >
                {intl.formatMessage(
                  {
                    defaultMessage: "{skillName} at {skillLevel}",
                    id: "TPHO1i",
                    description:
                      "Display of skill requirement in the _digital services contracting questionnaire_",
                  },
                  {
                    skillName: getLocalizedName(skillName?.name, intl),
                    skillLevel: intl.formatMessage(levelName),
                  },
                )}
                <Button
                  onClick={() => removeSkill(requirement.skillId)}
                  icon={XMarkIcon}
                  color="error"
                  aria-label={intl.formatMessage({
                    defaultMessage: "Delete",
                    id: "IUQGA0",
                    description: "Link text to delete.",
                  })}
                />
              </div>
            );
          })}
          <SkillDialog
            skills={skills}
            context="library"
            onSave={handleSkillDialogSave}
          />
        </Field.Fieldset>
      </Field.Wrapper>
      <Select
        id={`${fieldsetName}.language`}
        name={`${fieldsetName}.language`}
        label={intl.formatMessage({
          defaultMessage: "Official language requirement",
          id: "gZKJeF",
          description:
            "Label for _official language requirement_ fieldset in the _digital services contracting questionnaire_",
        })}
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
          label={intl.formatMessage(formMessages.specifyOther)}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      ) : null}
      <Select
        id={`${fieldsetName}.security`}
        name={`${fieldsetName}.security`}
        label={intl.formatMessage({
          defaultMessage: "Security level",
          id: "zemp3H",
          description:
            "Label for _security level_ fieldset in the _digital services contracting questionnaire_",
        })}
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
          label={intl.formatMessage(formMessages.specifyOther)}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      ) : null}
      <Select
        id={`${fieldsetName}.telework`}
        name={`${fieldsetName}.telework`}
        label={intl.formatMessage({
          defaultMessage: "Telework allowed",
          id: "DeQTkE",
          description:
            "Label for _telework option_ fieldset in the _digital services contracting questionnaire_",
        })}
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
        label={intl.formatMessage({
          defaultMessage: "Quantity",
          id: "5yv4Ko",
          description:
            "Label for _quantity of personnel_ field in the _digital services contracting questionnaire_",
        })}
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
