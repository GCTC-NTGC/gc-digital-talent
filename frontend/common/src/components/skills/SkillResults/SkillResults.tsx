import React, { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
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

  const definition = description?.[locale];

  return (
    <div data-h2-padding="base(0, 0, x.25, 0)">
      <div
        data-h2-flex-grid="base(flex-start, x1, 0)"
        data-h2-align-items="base(center)"
      >
        <div data-h2-flex-item="base(1of2)">
          {isAdded ? (
            <span
              data-h2-color="base(dt-primary)"
              data-h2-position="base(relative)"
              data-h2-display="base(block)"
              data-h2-font-weight="base(700)"
            >
              <CheckCircleIcon
                data-h2-width="base(x.75)"
                data-h2-position="base(absolute)"
                data-h2-offset="base(1px, auto, auto, 0)"
              />
              <span
                data-h2-display="base(block)"
                data-h2-padding="base(0, 0, 0, x1)"
              >
                {name[locale]}
              </span>
            </span>
          ) : (
            <span
              data-h2-display="base(block)"
              data-h2-margin="base(0, 0, 0, x1)"
            >
              {name[locale]}
            </span>
          )}
        </div>
        <div data-h2-flex-item="base(1of4)" data-h2-text-align="base(center)">
          {definition ? (
            <Button
              color="primary"
              mode="inline"
              type="button"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen
                ? intl.formatMessage({
                    defaultMessage: "Hide definition",
                    id: "VDZ6zw",
                    description: "Text displayed when skill block is open.",
                  })
                : intl.formatMessage({
                    defaultMessage: "See definition",
                    id: "BjRuMw",
                    description: "Text displayed when skill block is open.",
                  })}
            </Button>
          ) : (
            intl.formatMessage({
              defaultMessage: "No definition provided",
              id: "YRhYqm",
              description: "Message displayed when a skill has no definition",
            })
          )}
        </div>
        <div data-h2-flex-item="base(1of4)" data-h2-text-align="base(center)">
          <Button
            color="primary"
            mode="inline"
            type="button"
            onClick={isAdded ? () => onRemoveSkill(id) : () => onAddSkill(id)}
          >
            {isAdded
              ? intl.formatMessage({
                  defaultMessage: "Remove skill",
                  id: "ItRgwA",
                  description:
                    "Button label to remove skill on skill result block.",
                })
              : intl.formatMessage({
                  defaultMessage: "Add skill",
                  id: "ZOQ9ih",
                  description:
                    "Button label to add skill on skill result block.",
                })}
          </Button>
        </div>
        {definition && isOpen && (
          <div data-h2-flex-item="base(1of1)">
            <div
              data-h2-padding="base(x.75)"
              data-h2-border="base(all, 1px, solid, dt-primary)"
              data-h2-color="base(dt-primary)"
              data-h2-background-color="base(dt-primary.15)"
              data-h2-margin="base(x.25, 0, x.25, x1)"
              data-h2-radius="base(s)"
            >
              <p data-h2-font-size="base(caption)">{definition}</p>
            </div>
          </div>
        )}
      </div>
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
    <section data-h2-margin="base(0, 0, x1, 0)">
      <p
        data-h2-font-size="base(copy, 1)"
        data-h2-border="base(top, 1px, solid, dt-gray)"
        data-h2-font-weight="base(700)"
        data-h2-padding="base(x1.5, 0, 0, 0)"
        data-h2-margin="base(x1.5, 0, x.65, 0)"
      >
        {title}
      </p>
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
