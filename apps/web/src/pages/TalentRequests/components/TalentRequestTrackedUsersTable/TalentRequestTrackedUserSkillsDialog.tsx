import { useState } from "react";
import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { Button, Dialog, Pending, Ul } from "@gc-digital-talent/ui";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";

export const TrackedUserSkill_Fragment = graphql(/* GraphQL */ `
  fragment TrackedUserSkill on Skill {
    id
    name {
      localized
    }
  }
`);

const TrackedUserMatchedSkills_Query = graphql(/* GraphQL */ `
  query TrackedUserMatchedSkills($id: UUID!) {
    user(id: $id) {
      id
      userSkills {
        skill {
          id
        }
      }
    }
  }
`);

interface DialogBodyProps {
  skills: { id: string; name: string }[];
  userId: string;
  userName: string;
}

const DialogBody = ({ skills, userId, userName }: DialogBodyProps) => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: TrackedUserMatchedSkills_Query,
    variables: { id: userId },
  });

  const userSkillIds = unpackMaybes(data?.user?.userSkills).map(
    (userSkill) => userSkill.skill.id,
  );
  const matched = skills.filter((skill) => userSkillIds.includes(skill.id));
  const unmatched = skills.filter((skill) => !userSkillIds.includes(skill.id));

  return (
    <Pending fetching={fetching} error={error} inline>
      {matched.length > 0 && (
        <Ul noIndent>
          {matched.map((skill) => (
            <li key={skill.id}>{skill.name}</li>
          ))}
        </Ul>
      )}
      {unmatched.length > 0 && (
        <>
          <p className="mt-6 mb-2">
            {intl.formatMessage(
              {
                defaultMessage: "{userName} has not claimed:",
                id: 'nQTNFj',
                description:
                  "Lead-in for skills a tracked user has not claimed",
              },
              { userName },
            )}
          </p>
          <Ul noIndent>
            {unmatched.map((skill) => (
              <li key={skill.id}>{skill.name}</li>
            ))}
          </Ul>
        </>
      )}
    </Pending>
  );
};

interface TalentRequestTrackedUserSkillsDialogProps {
  skillsQuery: FragmentType<typeof TrackedUserSkill_Fragment>[];
  skillCount: number | null | undefined;
  userId: string;
  userName: string;
}

const TalentRequestTrackedUserSkillsDialog = ({
  skillsQuery,
  skillCount,
  userId,
  userName,
}: TalentRequestTrackedUserSkillsDialogProps) => {
  const intl = useIntl();
  const [isOpen, setOpen] = useState(false);

  const notAvailable = intl.formatMessage(commonMessages.notAvailable);
  const skills = getFragment(TrackedUserSkill_Fragment, skillsQuery).map(
    (skill) => ({ id: skill.id, name: skill.name?.localized ?? notAvailable }),
  );
  const total = skills.length;

  const countLabel = intl.formatMessage(
    {
      defaultMessage: "{skillCount} of {total}",
      id: '5jjG9G',
      description: "Title displayed on the candidate skill count column.",
    },
    { skillCount, total },
  );

  if (total === 0) {
    return <span>{countLabel}</span>;
  }

  return (
    <Dialog.Root onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button color="black" mode="inline">
          {countLabel}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header
          subtitle={intl.formatMessage(
            {
              defaultMessage: "{userName} matches {skillCount} of {total} skills",
              id: 'HkxwBt',
              description: "Subtitle for the tracked user skills match dialog",
            },
            { userName, skillCount, total },
          )}
        >
          {intl.formatMessage({
            defaultMessage: "Skills match",
            id: "+PVO13",
            description: "Heading displayed on the candidate skill match dialog.",
          })}
        </Dialog.Header>
        <Dialog.Body>
          {isOpen && (
            <DialogBody skills={skills} userId={userId} userName={userName} />
          )}
          <Dialog.Footer className="justify-start">
            <Dialog.Close>
              <Button color="primary" mode="inline">
                {intl.formatMessage(commonMessages.close)}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default TalentRequestTrackedUserSkillsDialog;
