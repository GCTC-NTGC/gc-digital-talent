import React from "react";
import { useIntl } from "react-intl";
import { FieldError, useFormContext } from "react-hook-form";
import get from "lodash/get";

import {
  errorMessages,
  getLocalizedName,
  uiMessages,
} from "@gc-digital-talent/i18n";
import { Combobox, Field, Select } from "@gc-digital-talent/forms";

import { BaseSkillBrowserProps } from "./types";
import {
  INPUT_NAME,
  getCategoryOptions,
  getFamilyOptions,
  getFilteredFamilies,
  getFilteredSkills,
  getSkillFamilySkillCount,
} from "./utils";

type SkillBrowserProps = BaseSkillBrowserProps & {
  name: string;
  isMulti?: boolean;
};

const SkillBrowser = ({
  skills,
  showCategory,
  name,
  isMulti = true,
}: SkillBrowserProps) => {
  const intl = useIntl();
  const id = React.useId();
  const {
    watch,
    resetField,
    register,
    formState: { errors },
  } = useFormContext();
  const skillError = get(errors, name)?.message as FieldError;
  const inputNames = {
    category: `${id}-${INPUT_NAME.CATEGORY}`,
    family: `${id}-${INPUT_NAME.FAMILY}`,
  };
  const [category, family] = watch([inputNames.category, inputNames.family]);

  const filteredFamilies = React.useMemo(() => {
    return getFilteredFamilies({ skills, category });
  }, [skills, category]);

  const filteredSkills = React.useMemo(() => {
    return getFilteredSkills({ skills, family, category });
  }, [category, family, skills]);

  React.useEffect(() => {
    resetField("skill");
  }, [category, family, resetField]);

  React.useEffect(() => {
    resetField(inputNames.family);
  }, [category, inputNames.family, resetField]);

  const categoryOptions = getCategoryOptions(skills, intl);
  const familyOptions = getFamilyOptions(skills, intl, category);

  return (
    <>
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        data-h2-margin-bottom="base(x1)"
        {...(showCategory
          ? {
              "data-h2-grid-template-columns": "base(1fr) p-tablet(1fr 1fr)",
            }
          : {
              "data-h2-grid-template-columns": "base(1fr)",
            })}
      >
        {showCategory && (
          <Select
            id={inputNames.category}
            name={inputNames.category}
            nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
            trackUnsaved={false}
            label={intl.formatMessage({
              defaultMessage: "Skill category",
              id: "piZjS+",
              description: "Label for the skill category filter field",
            })}
            options={categoryOptions}
          />
        )}
        <Select
          id={inputNames.family}
          name={inputNames.family}
          nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
          trackUnsaved={false}
          label={intl.formatMessage({
            defaultMessage: "Skill family",
            id: "6ofORn",
            description: "Label for the skill family filter field",
          })}
          options={[
            ...familyOptions,
            ...filteredFamilies.map((skillFamily) => ({
              value: skillFamily.id,
              label: `${getLocalizedName(
                skillFamily.name,
                intl,
              )} (${getSkillFamilySkillCount(skills, skillFamily)})`,
            })),
          ]}
        />
      </div>
      {family && family !== "" ? (
        <div data-h2-margin="base(x1, 0)">
          <Combobox
            id="skill"
            name={name}
            isMulti={isMulti}
            rules={{ required: intl.formatMessage(errorMessages.required) }}
            trackUnsaved={false}
            total={filteredSkills.length}
            label={intl.formatMessage({
              defaultMessage: "Skill",
              id: "+K/smr",
              description: "Label for the skill select field",
            })}
            options={filteredSkills.map((currentSkill) => ({
              value: currentSkill.id,
              label: getLocalizedName(currentSkill.name, intl),
            }))}
          />
        </div>
      ) : (
        <>
          <input
            type="hidden"
            {...register(name, {
              required: intl.formatMessage({
                defaultMessage: "Select a skill family and skill to continue.",
                id: "jYPyWq",
                description:
                  "Error message when a user attempts to add a skill before selecting one",
              }),
            })}
          />
          {skillError && <Field.Error>{skillError?.toString()}</Field.Error>}
        </>
      )}
    </>
  );
};

export default SkillBrowser;
