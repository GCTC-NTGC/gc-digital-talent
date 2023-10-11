import React from "react";
import { useIntl } from "react-intl";
import { FieldError, RegisterOptions, useFormContext } from "react-hook-form";
import get from "lodash/get";

import { getLocalizedName, uiMessages } from "@gc-digital-talent/i18n";
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
import NullFamilyMessage from "./NullFamilyMessage";

type SkillBrowserProps = BaseSkillBrowserProps & {
  name: string;
  isMulti?: boolean;
  rules?: RegisterOptions;
};

const SkillBrowser = ({
  skills,
  showCategory,
  name,
  rules = {},
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
  const [category, family, value] = watch([
    inputNames.category,
    inputNames.family,
    name,
  ]);

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
        <Combobox
          id="skill"
          name={name}
          isMulti={isMulti}
          trackUnsaved={false}
          total={filteredSkills.length}
          rules={rules}
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
      ) : (
        <>
          <NullFamilyMessage />
          <input type="hidden" {...register(name, rules)} />
          {skillError && <Field.Error>{skillError?.toString()}</Field.Error>}
        </>
      )}
    </>
  );
};

export default SkillBrowser;
