import { useIntl } from "react-intl";
import { ComponentProps } from "react";

import { Accordion } from "@gc-digital-talent/ui";
import {
  commonMessages,
  getSkillLevelDefinition,
  getSkillLevelName,
} from "@gc-digital-talent/i18n";
import {
  SkillCategory,
  SkillLevel,
  SkillProficiencyListOptionsFragment,
} from "@gc-digital-talent/graphql";

import SkillBrowserDialog from "../SkillBrowser/SkillBrowserDialog";
import { FormValues as SkillBrowserDialogFormValues } from "../SkillBrowser/types";

interface SkillProficiencyAccordionItemProps {
  skillId: string;
  skillName: string | null;
  skillLevel: SkillLevel | null;
  skillDefinition: string | null;
  skillCategory: SkillCategory | null;
  onEdit:
    | (({
        skillId,
        skillLevel,
      }: {
        skillId: string;
        skillLevel: SkillLevel;
      }) => Promise<void>)
    | null;
  onRemove: (() => void) | null;
  availableSkills: NonNullable<
    SkillProficiencyListOptionsFragment["skills"][number]
  >[];
  noToast?: boolean;
  withLevel?: boolean;
}

const SkillProficiencyAccordionItem = ({
  skillId,
  skillName,
  skillLevel,
  skillDefinition,
  skillCategory,
  onEdit,
  onRemove,
  availableSkills,
  noToast = false,
  withLevel = false,
}: SkillProficiencyAccordionItemProps) => {
  const intl = useIntl();

  const metadata: ComponentProps<typeof Accordion.MetaData>["metadata"] = [];

  const skillLevelName =
    !!skillLevel && !!skillCategory
      ? intl.formatMessage(getSkillLevelName(skillLevel, skillCategory))
      : null;

  if (skillLevelName) {
    const label = intl.formatMessage(
      {
        defaultMessage: "Level: {skillLevelName}",
        id: "0xMKNB",
        description: "A description of a skill level",
      },
      {
        skillLevelName,
      },
    );
    metadata.push({
      key: "skill-level",
      type: "text",
      children: <span>{label}</span>,
    });
  }

  const skillLevelDefinition =
    !!skillLevel && !!skillCategory
      ? intl.formatMessage(getSkillLevelDefinition(skillLevel, skillCategory))
      : null;

  if (onEdit) {
    metadata.push({
      key: "edit-level",
      type: "button-component",
      component: (
        <SkillBrowserDialog
          skills={availableSkills}
          initialState={
            {
              skill: skillId,
              details: skillDefinition ?? undefined,
              skillLevel: skillLevel ?? undefined,
              family: "all",
            } satisfies SkillBrowserDialogFormValues
          }
          onSave={async (value) => {
            if (value.skill && value.skillLevel) {
              await onEdit({
                skillId: value.skill,
                skillLevel: value.skillLevel,
              });
            }
          }}
          customTrigger={
            <Accordion.MetaDataButton>
              {withLevel
                ? intl.formatMessage({
                    defaultMessage: "Edit level",
                    id: "8zdTVe",
                    description: "Label to edit the skill with level",
                  })
                : intl.formatMessage({
                    defaultMessage: "Edit",
                    id: "duijly",
                    description: "Label to edit the skill without level",
                  })}
            </Accordion.MetaDataButton>
          }
          noToast={noToast}
          context={
            withLevel
              ? "skill-proficiency-list-with-level"
              : "skill-proficiency-list-without-level"
          }
        />
      ),
    });
  }
  if (onRemove) {
    metadata.push({
      key: "remove-skill",
      type: "button",
      color: "error",
      onClick: onRemove,
      children: (
        <span>
          {intl.formatMessage({
            defaultMessage: "Remove skill",
            id: "jQ+wCE",
            description: "Label to remove the skill",
          })}
        </span>
      ),
    });
  }

  return (
    <Accordion.Item value={skillId}>
      <Accordion.Trigger as="h3">{skillName}</Accordion.Trigger>
      <Accordion.MetaData metadata={metadata} />
      <Accordion.Content>
        <p className="mb-6">
          <p className="font-bold">
            {intl.formatMessage({
              defaultMessage: "Skill definition",
              id: "N44sQc",
              description: "Label for the definition of a specific skill",
            }) + intl.formatMessage(commonMessages.dividingColon)}
          </p>
          {skillDefinition}
        </p>

        <p>
          <p className="font-bold">
            {intl.formatMessage({
              defaultMessage: "Level definition",
              id: "fqa45V",
              description: "Label for the definition of a specific skill level",
            }) + intl.formatMessage(commonMessages.dividingColon)}
          </p>
          {skillLevelDefinition ?? intl.formatMessage(commonMessages.notFound)}
        </p>
      </Accordion.Content>
    </Accordion.Item>
  );
};

export default SkillProficiencyAccordionItem;
