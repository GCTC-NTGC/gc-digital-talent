import React from "react";
import { useIntl } from "react-intl";
import { RegisterOptions, useFormContext } from "react-hook-form";

import { getLocalizedName } from "@gc-digital-talent/i18n";
import { Combobox, Select } from "@gc-digital-talent/forms";
import { normalizeString } from "@gc-digital-talent/helpers";

import { BaseSkillBrowserProps } from "./types";
import skillBrowserMessages from "./messages";
import {
  INPUT_NAME,
  formatOption,
  getFamilyOptions,
  getFilteredFamilies,
  getFilteredSkills,
  getSkillFamilySkillCount,
} from "./utils";

type SkillBrowserProps = BaseSkillBrowserProps & {
  name: string;
  isMulti?: boolean;
  rules?: RegisterOptions;
};

const SkillBrowser = ({
  skills,
  name,
  rules = {},
  isMulti = true,
}: SkillBrowserProps) => {
  const intl = useIntl();
  const id = React.useId();
  const { watch, resetField, setValue } = useFormContext();
  const inputNames = {
    category: `${id}-${INPUT_NAME.CATEGORY}`,
    family: `${id}-${INPUT_NAME.FAMILY}`,
  };
  const [family, skillValue] = watch([inputNames.family, name]);

  const filteredFamilies = React.useMemo(() => {
    return getFilteredFamilies({ skills }).sort((familyA, familyB) => {
      const a = normalizeString(getLocalizedName(familyA.name, intl));
      const b = normalizeString(getLocalizedName(familyB.name, intl));

      if (a === b) return 0;

      return a > b ? 1 : -1;
    });
  }, [skills, intl]);

  const filteredSkills = React.useMemo(() => {
    return getFilteredSkills({ skills, family }).sort((skillA, skillB) => {
      const a = normalizeString(getLocalizedName(skillA.name, intl));
      const b = normalizeString(getLocalizedName(skillB.name, intl));

      if (a === b) return 0;

      return a > b ? 1 : -1;
    });
  }, [family, skills, intl]);

  React.useEffect(() => {
    resetField("skill");
  }, [family, resetField]);

  React.useEffect(() => {
    resetField(inputNames.family);
  }, [inputNames.family, resetField]);

  React.useEffect(() => {
    if (skillValue?.length > 0 && !family) {
      setValue(inputNames.family, "all");
    }
  }, [skillValue, family, setValue, inputNames.family]);

  const familyOptions = getFamilyOptions(skills, intl);

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-gap="base(x1)"
      data-h2-margin-bottom="base(x1)"
      data-h2-grid-template-columns="l-tablet(1fr 1fr 1fr)"
    >
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
      <div data-h2-grid-column="l-tablet(span 2)">
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
      </div>
    </div>
  );
};

export default SkillBrowser;
