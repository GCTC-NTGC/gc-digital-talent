import React from "react";
import { useIntl } from "react-intl";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

import Button from "../Button";

import useLocale from "../../hooks/useLocale";
import { getLocalizedName } from "../../helpers/localize";
import type { Skill } from "../../api/generated";

interface SkillBlockProps {
  skill: Skill;
  isAdded: boolean;
  onAddSkill: (id: string) => void;
  onRemoveSkill: (id: string) => void;
}

const SkillBlock = ({
  skill: { id, name, description },
  isAdded,
  onAddSkill,
  onRemoveSkill,
}: SkillBlockProps) => {
  const intl = useIntl();
  const locale = useLocale();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const definition = description ? description[locale] : null;

  return (
    <div>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column) l-tablet(row)"
        data-h2-align-items="base(flex-start) l-tablet(center)"
        data-h2-justify-content="base(space-between)"
        data-h2-gap="base(0, x.25) l-tablet(x.5, 0)"
      >
        <div data-h2-flex-grow="base(1)">
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
                {getLocalizedName(name, intl)}
              </span>
            </span>
          ) : (
            <span data-h2-display="base(block)">
              {getLocalizedName(name, intl)}
            </span>
          )}
        </div>
        <div
          data-h2-display="base(flex)"
          data-h2-justify-content="base(flex-end)"
          data-h2-gap="base(x.5, 0)"
          style={{ flexShrink: 0 }}
        >
          <div>
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
          <div>
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
        </div>
      </div>
      <div aria-live="polite">
        {definition && isOpen && (
          <div
            data-h2-padding="base(x.75)"
            data-h2-border="base(all, 1px, solid, dt-primary)"
            data-h2-color="base(dt-primary)"
            data-h2-background-color="base(dt-primary.15)"
            data-h2-margin="base(x.25, 0)"
            data-h2-radius="base(s)"
          >
            <p data-h2-font-size="base(caption)">{definition}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillBlock;
