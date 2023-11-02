import React from "react";
import { useIntl } from "react-intl";
import { useFieldArray, useFormContext } from "react-hook-form";

import { notEmpty } from "@gc-digital-talent/helpers";
import { Heading, Well } from "@gc-digital-talent/ui";

import SkillPicker from "~/components/SkillPicker";
import { Skill } from "~/api/generated";

interface AddSkillsToFilterProps {
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
      <Heading
        level="h3"
        size="h6"
        data-h2-margin="base(x3, 0, x1, 0)"
        id={linkId}
      >
        {intl.formatMessage({
          defaultMessage: "Skills selection",
          id: "eFvsOG",
          description: "Title for the skill filters on search page.",
        })}
      </Heading>
      <p data-h2-margin="base(x.5, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "Help us match you to the best candidates by sharing more information with our team on the exact skills you are looking for.",
          id: "R75HsV",
          description:
            "Describing the purpose of the skill filters on the Search page.",
        })}
      </p>
      <SkillPicker
        skills={allSkills || []}
        onUpdateSelectedSkills={handleChange}
        selectedSkills={addedSkills}
      />
      {addedSkills && addedSkills.length > 0 && (
        <Well
          color="primary"
          data-h2-margin="base(x1 0)"
          data-h2-padding="base(x.5)"
        >
          <p data-h2-font-size="base(caption)">
            {intl.formatMessage({
              defaultMessage:
                "<strong>Note:</strong> Results will include any candidate that matches <strong>1 or more</strong> of the selected skills",
              id: "kLGIuJ",
              description:
                "Context for skills selection filter in search form.",
            })}
          </p>
        </Well>
      )}
    </div>
  );
};

export default AddSkillsToFilter;
