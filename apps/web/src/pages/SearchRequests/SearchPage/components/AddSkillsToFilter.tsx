import React from "react";
import { useIntl } from "react-intl";
import { useFieldArray, useFormContext } from "react-hook-form";

import { notEmpty } from "@gc-digital-talent/helpers";

import SkillPicker from "~/components/SkillPicker";
import { Skill } from "~/api/generated";

export interface AddSkillsToFilterProps {
  allSkills: Skill[];
  linkId: string;
}

const AddSkillsToFilter = ({ allSkills, linkId }: AddSkillsToFilterProps) => {
  const intl = useIntl();
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
      .filter(notEmpty);
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
      <h3
        data-h2-font-size="base(h6, 1)"
        data-h2-font-weight="base(700)"
        data-h2-margin="base(x3, 0, x1, 0)"
        id={linkId}
      >
        {intl.formatMessage({
          defaultMessage: "Skills selection",
          id: "eFvsOG",
          description: "Title for the skill filters on search page.",
        })}
      </h3>
      <p data-h2-margin="base(x.5, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "Help us match you to the best candidates by sharing more information with our team on the exact skills you are looking for.",
          id: "R75HsV",
          description:
            "Describing the purpose of the skill filters on the Search page.",
        })}
      </p>
      {/* <p>
        {intl.formatMessage({
          defaultMessage:
            "Find candidates with the right skills for the job. Use the following tabs to find skills that are necessary for the job and select them to use them as filters for matching candidates.",
          id: "+cy2GO",
          description:
            "Describing how to use the skill filters on search page, paragraph one.",
        })}
      </p>
      <p data-h2-margin="base(x.5, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            " Why are there a limited number of skills? It’s important that applicants and managers are pulling from the same list of skills in order to create matches.",
          id: "BQ7cf/",
          description:
            "Describing how to use the skill filters on search page, paragraph two.",
        })}
      </p> */}
      <SkillPicker
        skills={allSkills || []}
        onUpdateSelectedSkills={handleChange}
        selectedSkills={addedSkills}
      />
    </div>
  );
};

export default AddSkillsToFilter;
