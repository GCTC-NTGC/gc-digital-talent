import { useEffect } from "react";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";

import { Input, Select } from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  formMessages,
  getLocalizedName,
  getSkillLevelName,
} from "@gc-digital-talent/i18n";
import { Button, Separator } from "@gc-digital-talent/ui";
import {
  PersonnelLanguage,
  PersonnelScreeningLevel,
  PersonnelTeleworkOption,
  Skill,
  SkillCategory,
  SkillLevel,
} from "@gc-digital-talent/graphql";

import SkillDialog from "~/components/SkillBrowser/SkillBrowserDialog";
import { FormValues as SkillDialogFormValues } from "~/components/SkillBrowser/types";

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
import SignPost from "../../SignPost";

export interface PersonnelRequirementFieldsetProps {
  fieldsetName: string;
  skills: Skill[];
}

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

  const selectedSkillRequirements: SkillRequirementFormValues[] =
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
  useEffect(() => {
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

  const handleSkillDialogNew = (
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

  const handleSkillDialogEdit = (
    values: SkillDialogFormValues,
    index: number,
  ): Promise<void> => {
    if (values.skill && values.skillLevel) {
      const newEntry: SkillRequirementFormValues = {
        skillId: values.skill,
        level: values.skillLevel,
      };
      setValue(`${fieldsetName}.skillRequirements.${index}`, newEntry);
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
      data-h2-gap="base(x1)"
    >
      <Input
        id={`${fieldsetName}.resourceType`}
        name={`${fieldsetName}.resourceType`}
        type="text"
        label={labels["personnelRequirements.*.resourceType"]}
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
      <SignPost
        title={intl.formatMessage({
          defaultMessage: "Skill requirements",
          id: "tON7JL",
          description: "Title for skill requirements",
        })}
        introduction={intl.formatMessage({
          defaultMessage:
            "Please use the button provided to find and select all of the skills required for this role.",
          id: "OTuMuQ",
          description:
            "Introduction for _skills_ fieldset in the _digital services contracting questionnaire_",
        })}
      />
      {selectedSkillRequirements.map((requirement, index) => {
        const selectedSkillModel = skills.find(
          (s) => s.id === requirement.skillId,
        );
        const selectedSkillFamilyModel = selectedSkillModel?.families?.length
          ? selectedSkillModel?.families[0]
          : null;
        const skillLevel = selectedSkillModel
          ? getSkillLevelName(
              requirement.level,
              selectedSkillModel.category.value ?? SkillCategory.Technical,
            )
          : commonMessages.notFound;
        const skillName = getLocalizedName(selectedSkillModel?.name, intl);
        return (
          <div
            key={requirement.skillId}
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
          >
            <div>
              <div
                key={requirement.skillId}
                data-h2-display="base(flex)"
                data-h2-justify-content="base(flex-end)"
                data-h2-gap="base(x.75)"
              >
                <div data-h2-flex-grow="base(2)">
                  <p>{skillName}</p>
                  <p data-h2-color="base(black.light)">
                    {intl.formatMessage(
                      {
                        defaultMessage: "Skill level: {skillLevel}",
                        id: "cRtxUW",
                        description: "Skill level field label and name",
                      },
                      {
                        skillLevel: intl.formatMessage(skillLevel),
                      },
                    )}
                  </p>
                </div>
                <SkillDialog
                  skills={skills}
                  context="directive_forms"
                  onSave={(values: SkillDialogFormValues) =>
                    handleSkillDialogEdit(values, index)
                  }
                  trigger={{
                    label: intl.formatMessage(
                      {
                        defaultMessage: "Edit<hidden> {skillName}</hidden>",
                        id: "XRbVxf",
                        description:
                          "Button text to edit a personnel skill requirement",
                      },
                      {
                        skillName,
                      },
                    ),
                    icon: null,
                    mode: "inline",
                  }}
                  initialState={{
                    skill: requirement.skillId,
                    skillLevel: stringToEnum(SkillLevel, requirement.level),
                    category:
                      selectedSkillModel?.category.value ??
                      SkillCategory.Technical,
                    family: selectedSkillFamilyModel?.id,
                  }}
                />
                <Button
                  onClick={() => removeSkill(requirement.skillId)}
                  mode="inline"
                  color="error"
                >
                  {intl.formatMessage(
                    {
                      defaultMessage: "Remove<hidden> {skillName}</hidden>",
                      id: "QgX0vb",
                      description:
                        "Button text to delete a personnel skill requirement",
                    },
                    {
                      skillName,
                    },
                  )}
                </Button>
              </div>
              <Separator space="xs" />
            </div>
          </div>
        );
      })}
      <div data-h2-margin-top="base(x.5)">
        <SkillDialog
          skills={skills}
          context="directive_forms"
          onSave={handleSkillDialogNew}
          trigger={{ mode: "inline", icon: null }}
        />
      </div>
      <SignPost
        title={intl.formatMessage({
          defaultMessage: "Other requirements",
          id: "RbHGhj",
          description:
            "Title for _other requirements_ section in the _digital services contracting questionnaire_",
        })}
        introduction={intl.formatMessage({
          defaultMessage:
            "Please specify the following requirements for this role.",
          id: "LizQuG",
          description:
            "Introduction for _other requirements_ section in the _digital services contracting questionnaire_",
        })}
      />
      <Select
        id={`${fieldsetName}.language`}
        name={`${fieldsetName}.language`}
        label={labels["personnelRequirements.*.language"]}
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
          label={labels["personnelRequirements.*.languageOther"]}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      ) : null}
      <Select
        id={`${fieldsetName}.security`}
        name={`${fieldsetName}.security`}
        label={labels["personnelRequirements.*.security"]}
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
          label={labels["personnelRequirements.*.securityOther"]}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
        />
      ) : null}
      <Select
        id={`${fieldsetName}.telework`}
        name={`${fieldsetName}.telework`}
        label={labels["personnelRequirements.*.telework"]}
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
        label={labels["personnelRequirements.*.quantity"]}
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
