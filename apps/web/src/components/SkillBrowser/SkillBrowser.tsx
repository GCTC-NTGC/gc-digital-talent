import { useId, useMemo, useEffect } from "react";
import { useIntl } from "react-intl";
import { RegisterOptions, useFormContext } from "react-hook-form";

import { getLocalizedName } from "@gc-digital-talent/i18n";
import { Combobox, Select } from "@gc-digital-talent/forms";
import { normalizeString } from "@gc-digital-talent/helpers";

import { BaseSkillBrowserProps } from "./types";
import skillBrowserMessages from "./messages";
import {
  INPUT_NAME,
  getFamilyOptions,
  getFilteredFamilies,
  getFilteredSkills,
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
  const id = useId();
  const { watch, resetField, setValue } = useFormContext();
  const inputNames = {
    category: `${id}-${INPUT_NAME.CATEGORY}`,
    family: `${id}-${INPUT_NAME.FAMILY}`,
  };
  const [family, skillValue] = watch([inputNames.family, name]);

  const filteredFamilies = useMemo(() => {
    return getFilteredFamilies({ skills }).sort((familyA, familyB) => {
      const a = normalizeString(getLocalizedName(familyA.name, intl));
      const b = normalizeString(getLocalizedName(familyB.name, intl));

      if (a === b) return 0;

      return a > b ? 1 : -1;
    });
  }, [skills, intl]);

  const filteredSkills = useMemo(() => {
    return getFilteredSkills({ skills, family }).sort((skillA, skillB) => {
      const a = normalizeString(getLocalizedName(skillA.name, intl));
      const b = normalizeString(getLocalizedName(skillB.name, intl));

      if (a === b) return 0;

      return a > b ? 1 : -1;
    });
  }, [family, skills, intl]);

  useEffect(() => {
    resetField("skill");
  }, [family, resetField]);

  useEffect(() => {
    resetField(inputNames.family);
  }, [inputNames.family, resetField]);

  useEffect(() => {
    if (skillValue?.length > 0 && !family) {
      setValue(inputNames.family, "all");
    }
  }, [skillValue, family, setValue, inputNames.family]);

  const familyOptions = getFamilyOptions(skills, intl);

  return (
    <div className="mb-6 grid gap-6 md:grid-cols-3">
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
            label: getLocalizedName(skillFamily.name, intl),
          })),
        ]}
      />
      <div className="md:col-span-2">
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
