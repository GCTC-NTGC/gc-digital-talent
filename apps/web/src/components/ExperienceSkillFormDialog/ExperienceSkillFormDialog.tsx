import { useIntl } from "react-intl";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";
import type { ReactNode } from "react";
import { useState } from "react";

import { Button, Dialog } from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import type { FragmentType, LocalizedString } from "@gc-digital-talent/graphql";
import { graphql, getFragment } from "@gc-digital-talent/graphql";

import ExperienceSkillForm, {
  ExperienceSkillFormExperience_Fragment,
} from "./ExperienceSkillForm";

const ExperienceSkillFormDialogExperience_Fragment = graphql(/** GraphQL */ `
  fragment ExperienceSkillFormDialogExperience on Experience {
    id
    ...ExperienceSkillFormExperience
    ...ExperienceCard
  }
`);

interface FormValues {
  experience?: string;
  skill?: string;
  details?: string;
}

export interface SkillLink {
  id: string;
  name?: LocalizedString | null;
}

interface LinkedSkillRecord {
  details?: string | null;
}

interface LinkedSkill {
  id: string;
  experienceSkillRecord?: LinkedSkillRecord | null;
}

interface LinkableExperience {
  id: string;
  skills?: LinkedSkill[] | null;
}

const deriveDefaultValues = (
  skill?: SkillLink,
  experience?: LinkableExperience,
): FormValues => {
  const details = experience?.skills?.find(
    (experienceSkill) => experienceSkill.id === skill?.id,
  )?.experienceSkillRecord?.details;
  return {
    skill: skill?.id ?? undefined,
    experience: experience?.id ?? undefined,
    details: details ?? undefined,
  };
};

interface ExperienceSkillFormDialogProps {
  onSave?: () => void;
  skill?: SkillLink;
  experienceQuery?: FragmentType<typeof ExperienceSkillFormExperience_Fragment>;
  availableExperiencesQuery?: FragmentType<
    typeof ExperienceSkillFormDialogExperience_Fragment
  >[];
  trigger?: ReactNode;
}

const ExperienceSkillFormDialog = ({
  skill,
  experienceQuery,
  trigger,
  availableExperiencesQuery,
  onSave,
}: ExperienceSkillFormDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const intl = useIntl();
  const availableExperiences = getFragment(
    ExperienceSkillFormDialogExperience_Fragment,
    availableExperiencesQuery,
  );
  const experience = getFragment(
    ExperienceSkillFormExperience_Fragment,
    experienceQuery,
  );
  const experiences = experienceQuery
    ? (availableExperiences?.filter(
        (availableExperience) => availableExperience.id !== experience?.id,
      ) ?? [experienceQuery])
    : (availableExperiences ?? []);

  const handleSuccess = () => {
    if (onSave) {
      onSave();
    }
    setIsOpen(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        {trigger ?? (
          <Button icon={PencilSquareIcon} color="error" mode="inline">
            {intl.formatMessage(commonMessages.edit)}
          </Button>
        )}
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage(
            {
              defaultMessage: "Link an experience to {skillName}",
              id: "cP9CaK",
              description:
                "Instructional text for connecting an experience with a skill",
            },
            {
              skillName: getLocalizedName(skill?.name, intl),
            },
          )}
        </Dialog.Header>
        <Dialog.Body>
          <ExperienceSkillForm
            experiencesQuery={experiences}
            defaultValues={deriveDefaultValues(skill, experience)}
            onSuccess={handleSuccess}
          />
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ExperienceSkillFormDialog;
