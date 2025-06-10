import { useState } from "react";
import { IntlShape, useIntl } from "react-intl";
import { useQuery } from "urql";

import { Button, Dialog, Pending } from "@gc-digital-talent/ui";
import { Maybe, Skill, graphql, Scalars } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import SkillTree from "~/components/SkillTree/SkillTree";

const SkillMatchDialog_Query = graphql(/* GraphQL */ `
  query SkillMatchDialog_Query($id: UUID!) {
    user(id: $id) {
      experiences {
        ...SkillTreeExperience
      }
    }
  }
`);

interface SkillMatchDialogBodyProps {
  intl: IntlShape;
  filteredSkills: Skill[];
  userId: Scalars["ID"]["output"];
}

const SkillMatchDialogBody = ({
  intl,
  filteredSkills,
  userId,
}: SkillMatchDialogBodyProps) => {
  const [{ data, fetching, error }] = useQuery({
    query: SkillMatchDialog_Query,
    variables: {
      id: userId,
    },
  });

  return (
    <Pending fetching={fetching} error={error} inline>
      {filteredSkills.map((skill) => (
        <SkillTree
          key={skill.id}
          headingAs="h3"
          skill={skill}
          experiencesQuery={unpackMaybes(data?.user?.experiences)}
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
  userId: Scalars["ID"]["output"];
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

  const [isOpen, setOpen] = useState(false);

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
              <Button color="primary" mode="inline">
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
  userId: Scalars["ID"]["output"],
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
