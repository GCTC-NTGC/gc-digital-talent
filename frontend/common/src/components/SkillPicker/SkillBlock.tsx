import React from "react";
import { useIntl } from "react-intl";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

import Button from "../Button";
import Collapsible from "../Collapsible";

import useLocale from "../../hooks/useLocale";
import { getLocalizedName } from "../../helpers/localize";
import type { Skill } from "../../api/generated";

interface SkillLabelWrapperProps {
  children: React.ReactNode;
}

const SkillLabelWrapper = ({ children }: SkillLabelWrapperProps) => (
  <span
    data-h2-color="base(dt-primary)"
    data-h2-position="base(relative)"
    data-h2-display="base(flex)"
    data-h2-align-items="base(center)"
    data-h2-gap="base(0, x.25)"
    data-h2-font-weight="base(700)"
  >
    <CheckCircleIcon data-h2-width="base(x.75)" />
    <span>{children}</span>
  </span>
);

interface SkillLabelProps {
  children: React.ReactNode;
  isAdded: boolean;
}

const SkillLabel = ({ children, isAdded }: SkillLabelProps) => {
  const Wrapper = isAdded ? SkillLabelWrapper : React.Fragment;

  return (
    <Wrapper>
      <span>{children}</span>
    </Wrapper>
  );
};

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
  const { locale } = useLocale();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const definition = description ? description[locale] : null;
  const skillName = getLocalizedName(name, intl);

  const Wrapper = definition ? Collapsible.Root : "div";

  return (
    <Wrapper>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column) p-tablet(row)"
        data-h2-align-items="base(flex-start) p-tablet(center)"
        data-h2-justify-content="base(space-between)"
        data-h2-gap="base(x.25, 0) p-tablet(0, x.5)"
      >
        <SkillLabel isAdded={isAdded}>{skillName}</SkillLabel>
        <div
          data-h2-display="base(flex)"
          data-h2-justify-content="base(flex-end)"
          data-h2-gap="base(0, x.5)"
          style={{ flexShrink: 0 }}
        >
          <div>
            <Button
              color="primary"
              mode="inline"
              type="button"
              onClick={isAdded ? () => onRemoveSkill(id) : () => onAddSkill(id)}
            >
              {isAdded
                ? intl.formatMessage(
                    {
                      defaultMessage:
                        "Remove this skill<hidden>: {skillName}</hidden>",
                      id: "W6Jh6N",
                      description:
                        "Button label to remove the adjacent skill on skill result block.",
                    },
                    {
                      skillName,
                    },
                  )
                : intl.formatMessage(
                    {
                      defaultMessage:
                        "Add this skill<hidden>: {skillName}</hidden>",
                      id: "MO80Mu",
                      description:
                        "Button label to add the adjacent skill on skill result block.",
                    },
                    { skillName },
                  )}
            </Button>
          </div>
          <div>
            {definition ? (
              <Collapsible.Trigger asChild>
                <Button
                  color="primary"
                  mode="inline"
                  type="button"
                  onClick={() => setIsOpen((currentIsOpen) => !currentIsOpen)}
                >
                  {isOpen
                    ? intl.formatMessage(
                        {
                          defaultMessage:
                            "Hide definition<hidden> for {skillName}</hidden>",
                          id: "SGcina",
                          description:
                            "Text displayed when skill block is open.",
                        },
                        { skillName },
                      )
                    : intl.formatMessage(
                        {
                          defaultMessage:
                            "See definition<hidden> for {skillName}</hidden>",
                          id: "WtwED/",
                          description:
                            "Text displayed when skill block is closed.",
                        },
                        { skillName },
                      )}
                </Button>
              </Collapsible.Trigger>
            ) : (
              intl.formatMessage(
                {
                  defaultMessage:
                    "No definition provided<hidden> for {skillName}</hidden>",
                  id: "QXYMUG",
                  description:
                    "Message displayed when a skill has no definition",
                },
                { skillName },
              )
            )}
          </div>
        </div>
      </div>
      {definition && (
        <div aria-live="polite">
          <Collapsible.Content>
            <div
              data-h2-padding="base(x.75)"
              data-h2-border="base(1px solid dt-primary)"
              data-h2-color="base(dt-primary)"
              data-h2-background-color="base(dt-primary.15)"
              data-h2-margin="base(x.25, 0)"
              data-h2-radius="base(s)"
            >
              <p data-h2-font-size="base(caption)">{definition}</p>
            </div>
          </Collapsible.Content>
        </div>
      )}
    </Wrapper>
  );
};

export default SkillBlock;
