import { useState } from "react";
import { IntlShape, useIntl } from "react-intl";
import { useQuery } from "urql";

import { Button, Dialog, Pending, Separator, Ul } from "@gc-digital-talent/ui";
import {
  Maybe,
  Skill,
  graphql,
  Scalars,
  getFragment,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import SkillTree, {
  SkillTreeExperience_Fragment,
} from "~/components/SkillTree/SkillTree";

const arrayIncludesForSorting = (
  skillIdToFind: string,
  skillsIdArray: string[],
): number => {
  return skillsIdArray.includes(skillIdToFind) ? 0 : 1;
};

const SkillMatchDialog_Query = graphql(/* GraphQL */ `
  query SkillMatchDialog_Query($id: UUID!) {
    user(id: $id) {
      experiences {
        ...SkillTreeExperience
      }
      userSkills {
        skill {
          id
        }
      }
    }
  }
`);

interface SkillMatchDialogBodyProps {
  intl: IntlShape;
  filteredSkills: Skill[];
  userId: Scalars["ID"]["output"];
  poolCandidateName: string;
}

const SkillMatchDialogBody = ({
  intl,
  filteredSkills,
  userId,
  poolCandidateName,
}: SkillMatchDialogBodyProps) => {
  const [{ data, fetching, error }] = useQuery({
    query: SkillMatchDialog_Query,
    variables: {
      id: userId,
    },
  });

  const experiencesUnpacked = unpackMaybes(data?.user?.experiences);
  const userSkillsUnpacked = unpackMaybes(data?.user?.userSkills);
  const experiencesFromFragment = getFragment(
    SkillTreeExperience_Fragment,
    experiencesUnpacked,
  );

  const userSkillsSkillIds = userSkillsUnpacked.map(
    (userSkill) => userSkill.skill.id,
  );

  // claimed skills come from user->userSkills
  // supported skills come from user->experiences[number].skills
  // unclaimed = filtered subtract claimed
  // filtered skills to render = filtered subtract unclaimed
  const claimedSkillsIds = filteredSkills
    .filter((skillToFind) => userSkillsSkillIds.includes(skillToFind.id))
    .map((skill) => skill.id);
  const supportedSkillsIds = filteredSkills
    .filter((skillToFind) =>
      experiencesFromFragment.some((experience) => {
        const experienceSkillIds = experience.skills
          ? experience.skills?.map((skill) => skill.id)
          : null;
        if (experienceSkillIds) {
          return experienceSkillIds.includes(skillToFind.id);
        }
        return false;
      }),
    )
    .map((skill) => skill.id);
  const unclaimedSkills = filteredSkills.filter(
    (skillToFind) => !userSkillsSkillIds.includes(skillToFind.id),
  );
  const filteredSkillsToRender = filteredSkills.filter((skillToFind) =>
    claimedSkillsIds.includes(skillToFind.id),
  );

  // sort by supported or not then alphabetically
  filteredSkillsToRender.sort((skillA, skillB) => {
    const aName = getLocalizedName(skillA.name, intl);
    const bName = getLocalizedName(skillB.name, intl);

    return (
      arrayIncludesForSorting(skillA.id, supportedSkillsIds) -
        arrayIncludesForSorting(skillB.id, supportedSkillsIds) ||
      aName.localeCompare(bName)
    );
  });

  return (
    <Pending fetching={fetching} error={error} inline>
      <>
        {filteredSkillsToRender.map((skill) => (
          <SkillTree
            key={skill.id}
            headingAs="h3"
            skill={skill}
            experiencesQuery={experiencesUnpacked}
            showDisclaimer
            disclaimerMessage={intl.formatMessage(
              {
                defaultMessage:
                  "{poolCandidateName} has added this skill to their skills portfolio, but it isn't linked to a career experience.",
                id: "EAy2CJ",
                description:
                  "Disclaimer in well for claimed skill special case rendering",
              },
              { poolCandidateName },
            )}
            hideConnectButton
            hideEdit
          />
        ))}
        {unclaimedSkills.length !== 0 && (
          <>
            <Separator className="mt-4" space="none" />
            <p className="mt-6 mb-2">
              {intl.formatMessage(
                {
                  defaultMessage:
                    "{poolCandidateName} has not claimed the following skills:",
                  id: "+huKPT",
                  description: "Lead in for list of unclaimed skills",
                },
                { poolCandidateName },
              )}
            </p>
            <Ul noIndent>
              {unclaimedSkills.map((skill) => (
                <li key={skill.id}>{getLocalizedName(skill.name, intl)}</li>
              ))}
            </Ul>
          </>
        )}
      </>
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
      <>
        <p className="sr-only">
          {intl.formatMessage(
            {
              defaultMessage: "{poolCandidateName} has 0 of 0 skills",
              id: "4SNVtn",
              description:
                "Aria-label for the title displayed on the candidate skill count column.",
            },
            { poolCandidateName },
          )}
        </p>
        <p aria-hidden="true">
          {intl.formatMessage({
            defaultMessage: "0 of 0",
            id: "gkLEbN",
            description:
              "Title displayed on the candidate skill count column when no skills are selected.",
          })}
        </p>
      </>
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
        <Dialog.Header
          subtitle={intl.formatMessage(
            {
              defaultMessage:
                "{poolCandidateName} meets {skillsCount} out of {filteredSkillsTotal} skills",
              id: "Fxs+ab",
              description: "Skills match subtitle with candidate's name",
            },
            {
              poolCandidateName,
              skillsCount,
              filteredSkillsTotal,
            },
          )}
        >
          {intl.formatMessage({
            defaultMessage: "Skills match",
            id: "+PVO13",
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
              poolCandidateName={poolCandidateName}
            />
          )}
          <Dialog.Footer className="justify-start">
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
