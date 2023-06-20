import * as React from "react";
import { Experience, Maybe, Skill } from "@gc-digital-talent/graphql";
import { Button, Dialog } from "@gc-digital-talent/ui";
import { useIntl } from "react-intl";
import SkillTree from "~/pages/Applications/ApplicationSkillsPage/components/SkillTree";

interface SkillMatchDialogProps {
  filteredSkills: Skill[];
  experiences: Experience[];
  skillsCount: Maybe<number>;
}

const SkillMatchDialog = ({
  filteredSkills,
  experiences,
  skillsCount,
}: SkillMatchDialogProps) => {
  const intl = useIntl();

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button color="black" mode="inline">
          {intl.formatMessage(
            {
              defaultMessage: "{skillsCount}/{filteredSkillsTotal}",
              id: "npcY4+",
              description:
                "Title displayed on the candidate skill count column.",
            },
            { skillsCount, filteredSkillsTotal: filteredSkills.length },
          )}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage({
            defaultMessage: "Skills matched in detail",
            id: "qQZQj+",
            description:
              "Heading displayed on the candidate skill match dialog.",
          })}
        </Dialog.Header>
        <Dialog.Body>
          {filteredSkills.map((skill) => (
            <SkillTree
              key={skill.id}
              skill={skill}
              experiences={experiences}
              showDisclaimer
              disclaimerMessage={intl.formatMessage({
                defaultMessage:
                  "There are no experiences attached to this skill",
                id: "pJqoQF",
                description:
                  "Disclaimer displayed in the skill tree on the skill match dialog.",
              })}
              hideConnectButton
              hideEdit
            />
          ))}
          <Dialog.Footer data-h2-justify-content="base(flex-start)">
            <Dialog.Close>
              <Button color="secondary" mode="inline">
                {intl.formatMessage({
                  defaultMessage: "Close",
                  id: "GAYZpV",
                  description:
                    "Button text used to close an skills match dialog",
                })}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default SkillMatchDialog;

export function skillMatchDialogAccessor(
  filteredSkills: Skill[],
  experiences: Experience[],
  skillCount: Maybe<number>,
) {
  return (
    <SkillMatchDialog
      filteredSkills={filteredSkills}
      experiences={experiences}
      skillsCount={skillCount}
    />
  );
}
