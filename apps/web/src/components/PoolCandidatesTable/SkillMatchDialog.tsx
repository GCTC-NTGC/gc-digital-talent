import * as React from "react";
import { IntlShape, useIntl } from "react-intl";

import { Button, Dialog, Pending } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";

import {
  Maybe,
  Skill,
  Scalars,
  useGetSkillMatchDialogDataQuery,
} from "~/api/generated";
import SkillTree from "~/components/SkillTree/SkillTree";

interface SkillMatchDialogBodyProps {
  intl: IntlShape;
  filteredSkills: Skill[];
  userId: Scalars["ID"];
}

const SkillMatchDialogBody = ({
  intl,
  filteredSkills,
  userId,
}: SkillMatchDialogBodyProps) => {
  const [{ data, fetching, error }] = useGetSkillMatchDialogDataQuery({
    variables: {
      id: userId,
    },
  });
  const experiences = data?.user?.experiences?.filter(notEmpty) ?? [];

  return (
    <Pending fetching={fetching} error={error} inline>
      {filteredSkills.map((skill) => (
        <SkillTree
          key={skill.id}
          headingAs="h3"
          skill={skill}
          experiences={experiences}
          showDisclaimer
          disclaimerMessage={intl.formatMessage({
            defaultMessage: "There are no experiences attached to this skill",
            id: "pJqoQF",
            description:
              "Disclaimer displayed in the skill tree on the skill match dialog.",
          })}
          hideConnectButton
          hideEdit
        />
      ))}
    </Pending>
  );
};

interface SkillMatchDialogProps {
  filteredSkills: Skill[];
  skillsCount: Maybe<number> | undefined;
  userId: Scalars["ID"];
  poolCandidateName: string;
}

const SkillMatchDialog = ({
  filteredSkills,
  skillsCount,
  userId,
  poolCandidateName,
}: SkillMatchDialogProps) => {
  const intl = useIntl();
  const filteredSkillsTotal = filteredSkills.length;

  const [isOpen, setOpen] = React.useState(false);

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
    <Dialog.Root onOpenChange={setOpen}>
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
          {isOpen && (
            <SkillMatchDialogBody
              intl={intl}
              filteredSkills={filteredSkills}
              userId={userId}
            />
          )}
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
  skillCount: Maybe<number> | undefined,
  userId: Scalars["ID"],
  poolCandidateName: string,
) {
  return (
    <SkillMatchDialog
      filteredSkills={filteredSkills}
      skillsCount={skillCount}
      userId={userId}
      poolCandidateName={poolCandidateName}
    />
  );
}

export default skillMatchDialogAccessor;
