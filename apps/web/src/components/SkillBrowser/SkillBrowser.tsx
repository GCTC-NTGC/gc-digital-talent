import React from "react";
import { useIntl } from "react-intl";
import { FieldError, RegisterOptions, useFormContext } from "react-hook-form";
import get from "lodash/get";

import { getLocalizedName } from "@gc-digital-talent/i18n";
import { Combobox, Field, Select } from "@gc-digital-talent/forms";
import { normalizeString } from "@gc-digital-talent/helpers";

import { BaseSkillBrowserProps } from "./types";
import skillBrowserMessages from "./messages";
import {
  INPUT_NAME,
  formatOption,
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
    setValue,
    register,
    formState: { errors },
  } = useFormContext();
  const skillError = get(errors, name)?.message as FieldError;
  const inputNames = {
    category: `${id}-${INPUT_NAME.CATEGORY}`,
    family: `${id}-${INPUT_NAME.FAMILY}`,
  };
  const [category, family, skillValue] = watch([
    inputNames.category,
    inputNames.family,
    name,
  ]);

  const filteredFamilies = React.useMemo(() => {
    return getFilteredFamilies({ skills, category }).sort(
      (familyA, familyB) => {
        const a = normalizeString(getLocalizedName(familyA.name, intl));
        const b = normalizeString(getLocalizedName(familyB.name, intl));

        if (a === b) return 0;

        return a > b ? 1 : -1;
      },
    );
  }, [skills, category, intl]);

  const filteredSkills = React.useMemo(() => {
    return getFilteredSkills({ skills, family, category }).sort(
      (skillA, skillB) => {
        const a = normalizeString(getLocalizedName(skillA.name, intl));
        const b = normalizeString(getLocalizedName(skillB.name, intl));

        if (a === b) return 0;

        return a > b ? 1 : -1;
      },
    );
  }, [category, family, skills, intl]);

  React.useEffect(() => {
    resetField("skill");
  }, [category, family, resetField]);

  React.useEffect(() => {
    resetField(inputNames.family);
  }, [category, inputNames.family, resetField]);

  React.useEffect(() => {
    if (skillValue?.length > 0 && !family) {
      setValue(inputNames.family, "all");
    }
  }, [skillValue, family, setValue, inputNames.family]);

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
            nullSelection={intl.formatMessage(
              skillBrowserMessages.skillCategoryPlaceholder,
            )}
            trackUnsaved={false}
            doNotSort
            label={intl.formatMessage(skillBrowserMessages.skillCategory)}
            options={categoryOptions}
          />
        )}
        <Select
          id={inputNames.family}
          name={inputNames.family}
          nullSelection={intl.formatMessage(
            skillBrowserMessages.skillFamilyPlaceholder,
          )}
          trackUnsaved={false}
          doNotSort
          label={intl.formatMessage(skillBrowserMessages.skillFamily)}
          options={[
            ...familyOptions,
            ...filteredFamilies.map((skillFamily) => ({
              value: skillFamily.id,
              label: formatOption(
                getLocalizedName(skillFamily.name, intl),
                getSkillFamilySkillCount(skills, skillFamily),
                intl,
              ),
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
          label={intl.formatMessage(skillBrowserMessages.skill)}
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
