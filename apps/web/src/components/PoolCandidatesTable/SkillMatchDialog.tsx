import * as React from "react";
import { Experience, Maybe, Skill } from "@gc-digital-talent/graphql";
import { Button, Dialog } from "@gc-digital-talent/ui";
import { useIntl } from "react-intl";
import SkillTree from "~/pages/Applications/ApplicationSkillsPage/components/SkillTree";

interface SkillMatchDialogProps {
  filteredSkills: Skill[];
  experiences: Experience[];
  skillsCount: Maybe<number>;
  poolCandidateName: string;
}

const SkillMatchDialog = ({
  filteredSkills,
  experiences,
  skillsCount,
  poolCandidateName,
}: SkillMatchDialogProps) => {
  const intl = useIntl();
  const filteredSkillsTotal = filteredSkills.length;

  if (filteredSkills.length === 0)
    return (
      <p
        aria-label={intl.formatMessage(
          {
            defaultMessage: "{poolCandidateName} has 0 of 0 skills",
            id: "4SNVtn",
            description:
              "Aria-label for the title displayed on the candidate skill count column.",
          },
          { poolCandidateName },
        )}
      >
        {intl.formatMessage({
          defaultMessage: "0 of 0",
          id: "gkLEbN",
          description:
            "Title displayed on the candidate skill count column when no skills are selected.",
        })}
      </p>
    );

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button
          color="black"
          mode="inline"
          aria-label={intl.formatMessage(
            {
              defaultMessage:
                "{poolCandidateName} has {skillsCount} of {filteredSkillsTotal} skills",
              id: "4QEl+4",
              description:
                "Aria-label for the title displayed on the candidate skill count column.",
            },
            {
              poolCandidateName,
              skillsCount,
              filteredSkillsTotal,
            },
          )}
        >
          {intl.formatMessage(
            {
              defaultMessage: "{skillsCount} of {filteredSkillsTotal}",
              id: "WFhX9m",
              description:
                "Title displayed on the candidate skill count column.",
            },
            { skillsCount, filteredSkillsTotal },
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
              headingAs="h3"
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

function skillMatchDialogAccessor(
  filteredSkills: Skill[],
  experiences: Experience[],
  skillCount: Maybe<number>,
  poolCandidateName: string,
) {
  return (
    <SkillMatchDialog
      filteredSkills={filteredSkills}
      experiences={experiences}
      skillsCount={skillCount}
      poolCandidateName={poolCandidateName}
    />
  );
}

export default skillMatchDialogAccessor;
