import React from "react";
import { useIntl } from "react-intl";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

import Button from "../Button";
import Collapsible from "../Collapsible";
import Pill from "../Pill";

import useLocale from "../../hooks/useLocale";
import { getLocalizedName } from "../../helpers/localize";
import type { Skill, SkillCategory } from "../../api/generated";
import { notEmpty, uniqueItems } from "../../helpers/util";
import { getSkillCategory } from "../../constants/localizedConstants";

interface SkillLabelWrapperProps {
  children: React.ReactNode;
}

const SkillLabelWrapper = ({ children }: SkillLabelWrapperProps) => (
  <span
    data-h2-color="base(dt-primary)"
    data-h2-position="base(relative)"
    data-h2-display="base(flex)"
    data-h2-align-items="base(center)"
    data-h2-gap="base(x.25, 0)"
    data-h2-font-weight="base(700)"
  >
    <CheckCircleIcon data-h2-width="base(x.75)" />
    {children}
  </span>
);

interface SkillLabelProps {
  children: React.ReactNode;
  categories: Array<SkillCategory>;
  isAdded: boolean;
}

const SkillLabel = ({ children, categories, isAdded }: SkillLabelProps) => {
  const intl = useIntl();
  const Wrapper = isAdded ? SkillLabelWrapper : React.Fragment;

  return (
    <Wrapper>
      <span
        data-h2-display="base(flex)"
        data-h2-align-items="base(center)"
        data-h2-gap="base(x.5, 0)"
      >
        <span>{children}</span>
        {categories.map((category) => (
          <Pill
            color={isAdded ? "primary" : "neutral"}
            mode="outline"
            size="sm"
            data-h2-font-weight="base(400)"
            key={category}
          >
            {intl.formatMessage(getSkillCategory(category))}
          </Pill>
        ))}
      </span>
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
  skill: { id, name, description, families },
  isAdded,
  onAddSkill,
  onRemoveSkill,
}: SkillBlockProps) => {
  const intl = useIntl();
  const locale = useLocale();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const definition = description ? description[locale] : null;
  const skillName = getLocalizedName(name, intl);
  const allCategories = families
    ?.map((family) => family.category)
    .filter(notEmpty);
  const categories = uniqueItems<SkillCategory>(allCategories || []);

  const Wrapper = definition ? Collapsible.Root : "div";

  return (
    <Wrapper>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column) p-tablet(row)"
        data-h2-align-items="base(flex-start) p-tablet(center)"
        data-h2-justify-content="base(space-between)"
        data-h2-gap="base(0, x.25) p-tablet(x.5, 0)"
      >
        <SkillLabel categories={categories} isAdded={isAdded}>
          {skillName}
        </SkillLabel>
        <div
          data-h2-display="base(flex)"
          data-h2-justify-content="base(flex-end)"
          data-h2-gap="base(x.5, 0)"
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
                        "Remove skill<hidden> {skillName}</hidden>",
                      id: "p5GbCr",
                      description:
                        "Button label to remove skill on skill result block.",
                    },
                    {
                      skillName,
                    },
                  )
                : intl.formatMessage(
                    {
                      defaultMessage: "Add skill<hidden> {skillName}</hidden>",
                      id: "HB2yOT",
                      description:
                        "Button label to add skill on skill result block.",
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
                  onClick={() => setIsOpen(!isOpen)}
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
              data-h2-border="base(all, 1px, solid, dt-primary)"
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
