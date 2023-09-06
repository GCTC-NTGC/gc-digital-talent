import React from "react";
import { useIntl } from "react-intl";

import { Dialog } from "@gc-digital-talent/ui";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { Skill } from "@gc-digital-talent/graphql";

import { Experience, Scalars } from "~/api/generated";

import ExperienceSkillForm from "./ExperienceSkillForm";

type FormValues = {
  experience?: Scalars["ID"];
  skill?: Scalars["ID"];
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
  open: boolean;
  onOpenChange: (newOpen: boolean) => void;
  skill?: Skill;
  experience?: Experience;
  availableExperiences: Experience[];
}

const ExperienceSkillFormDialog = ({
  open,
  onOpenChange,
  skill,
  experience,
  availableExperiences,
}: ExperienceSkillFormDialogProps) => {
  const intl = useIntl();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage(
            {
              defaultMessage: "Link an experience to {skillName}",
              id: "KnvA3d",
            },
            {
              skillName: getLocalizedName(skill?.name, intl),
            },
          )}
        </Dialog.Header>
        <Dialog.Body>
          <ExperienceSkillForm
            experiences={availableExperiences}
            defaultValues={deriveDefaultValues(skill, experience)}
            onSuccess={() => onOpenChange(false)}
          />
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ExperienceSkillFormDialog;
