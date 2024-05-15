import * as React from "react";
import { useIntl } from "react-intl";
import PencilSquareIcon from "@heroicons/react/20/solid/PencilSquareIcon";

import { Button, Dialog } from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { Skill, Experience, Scalars } from "@gc-digital-talent/graphql";

import ExperienceSkillForm from "./ExperienceSkillForm";

type FormValues = {
  experience?: Scalars["ID"]["output"];
  skill?: Scalars["ID"]["output"];
  details?: string;
};

const deriveDefaultValues = (
  skill?: Skill,
  experience?: Experience,
): FormValues => {
  const details = experience?.skills?.find(
    (experienceSkill) => experienceSkill.id === skill?.id,
  )?.experienceSkillRecord?.details;
  return {
    skill: skill?.id || undefined,
    experience: experience?.id || undefined,
    details: details || undefined,
  };
};

interface ExperienceSkillFormDialogProps {
  onSave?: () => void;
  skill?: Skill;
  experience?: Experience;
  availableExperiences?: Experience[];
  trigger?: React.ReactNode;
}

const ExperienceSkillFormDialog = ({
  skill,
  experience,
  trigger,
  availableExperiences,
  onSave,
}: ExperienceSkillFormDialogProps) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const intl = useIntl();
  let experiences = availableExperiences ?? [];
  if (experience) {
    experiences = !availableExperiences
      ? [experience]
      : availableExperiences.filter(
          (availableExperience) => availableExperience.id !== experience.id,
        );
  }

  const handleSuccess = () => {
    if (onSave) {
      onSave();
    }
    setIsOpen(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        {trigger || (
          <Button icon={PencilSquareIcon} color="tertiary" mode="inline">
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
            experiences={experiences}
            defaultValues={deriveDefaultValues(skill, experience)}
            onSuccess={handleSuccess}
          />
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ExperienceSkillFormDialog;
