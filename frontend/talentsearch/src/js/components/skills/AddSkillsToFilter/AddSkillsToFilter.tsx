import React from "react";

import type { Skill } from "@common/api/generated";
import SkillPicker from "@common/components/skills/SkillPicker";
import { useFieldArray, useFormContext } from "react-hook-form";
import { notEmpty } from "@common/helpers/util";

export interface AddSkillsToFilterProps {
  allSkills: Skill[];
}

const AddSkillsToFilter: React.FC<AddSkillsToFilterProps> = ({ allSkills }) => {
  const { control, watch } = useFormContext();
  const watchedSkills = watch("skills");
  const { replace } = useFieldArray({
    control,
    name: "skills",
  });
  const [addedSkillIds, setAddedSkillIds] = React.useState<string[]>(
    watchedSkills || [],
  );

  const addedSkills: Skill[] = React.useMemo(() => {
    return addedSkillIds
      .map((id) => allSkills.find((skill) => skill.id === id))
      .filter((skill) => typeof skill !== "undefined") as Skill[];
  }, [addedSkillIds, allSkills]);

  React.useEffect(() => {
    const newSkills = notEmpty(watchedSkills)
      ? watchedSkills.map((watchedSkill: string) => {
          const newSkill = allSkills.find((s) => s.id === watchedSkill);
          return newSkill?.id || undefined;
        })
      : [];
    setAddedSkillIds(newSkills.length > 0 ? newSkills : []);
  }, [watchedSkills, setAddedSkillIds, allSkills]);

  const handleChange = (skills: Skill[]) => {
    const skillIds = skills.map(({ id }) => id);
    replace(skillIds);
  };

  return (
    <div data-h2-margin="base(x1.5, 0)">
      <SkillPicker
        skills={allSkills || []}
        onChange={handleChange}
        selectedSkills={addedSkills}
      />
    </div>
  );
};

export default AddSkillsToFilter;
