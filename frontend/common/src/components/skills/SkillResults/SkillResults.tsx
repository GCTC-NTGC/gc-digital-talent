import React, { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { useIntl } from "react-intl";
import { getLocale } from "../../../helpers/localize";
import { Button } from "../..";
import { Skill } from "../../../api/generated";

export const SkillBlock: React.FunctionComponent<{
  skill: Skill;
  isAdded: boolean;
  onAddSkill: (id: string) => void;
  onRemoveSkill: (id: string) => void;
}> = ({ skill, isAdded, onAddSkill, onRemoveSkill }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const { id, name, description } = skill;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      data-h2-border="b(lightgray, top, solid, s)"
      data-h2-padding="b(top-bottom, s)"
    >
      <div
        data-h2-display="b(flex)"
        data-h2-flex-direction="b(row)"
        data-h2-justify-content="b(space-between)"
        data-h2-align-items="b(center)"
      >
        {isAdded ? (
          <span
            data-h2-font-color="b(lightpurple)"
            data-h2-font-weight="b(700)"
            data-h2-display="b(flex)"
            data-h2-align-items="b(flex-start)"
          >
            <CheckCircleIcon style={{ width: "1.125rem" }} />
            <span data-h2-padding="b(left, xxs)">{name[locale]}</span>
          </span>
        ) : (
          <span>{name[locale]}</span>
        )}
        <div>
          <Button
            color="primary"
            mode="inline"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen
              ? intl.formatMessage({
                  defaultMessage: "Hide definition",
                  description: "Text displayed when skill block is open.",
                })
              : intl.formatMessage({
                  defaultMessage: "See definition",
                  description: "Text displayed when skill block is open.",
                })}
          </Button>
          <Button
            color="primary"
            mode="inline"
            type="button"
            onClick={isAdded ? () => onRemoveSkill(id) : () => onAddSkill(id)}
          >
            {isAdded
              ? intl.formatMessage({
                  defaultMessage: "Remove skill",
                  description:
                    "Button label to remove skill on skill result block.",
                })
              : intl.formatMessage({
                  defaultMessage: "Add skill",
                  description:
                    "Button label to add skill on skill result block.",
                })}
          </Button>
        </div>
      </div>
      {isOpen && (
        <div>
          <p>{description?.[locale]}</p>
        </div>
      )}
    </div>
  );
};

export interface SkillResultsProps {
  title: string;
  skills: Skill[];
  addedSkills: Skill[];
  onAddSkill: (id: string) => void;
  onRemoveSkill: (id: string) => void;
}

export const SkillResults: React.FunctionComponent<SkillResultsProps> = ({
  title,
  skills,
  addedSkills,
  onAddSkill,
  onRemoveSkill,
}) => {
  const addedIds = addedSkills.map((skill) => skill?.id);
  return (
    <section>
      <h4>{title}</h4>
      {skills.map((skill) => {
        // Check if the poolCandidate has added the skill already.
        const isAdded = addedIds.includes(skill?.id);
        return (
          <SkillBlock
            key={skill?.id}
            skill={skill}
            isAdded={isAdded}
            onAddSkill={onAddSkill}
            onRemoveSkill={onRemoveSkill}
          />
        );
      })}
    </section>
  );
};

export default SkillResults;
