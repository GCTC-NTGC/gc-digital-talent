import type { ReactNode } from "react";
import { useIntl } from "react-intl";

import { Button, Dialog, Link, Separator } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import { useExperienceInfo } from "~/utils/experienceUtils";

import SkillsContent from "../ExperienceCard/SkillsContent";
import type { ExperienceWithSkills } from "./types";

export interface ExperienceDialogBaseProps {
  trigger: ReactNode;
  // Override the edit path if needed
  editPath?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface ExperienceDialogProps extends ExperienceDialogBaseProps {
  experience: ExperienceWithSkills;
  children: ReactNode;
}

const ExperienceDialog = ({
  experience,
  trigger,
  editPath: editPathProp,
  defaultOpen,
  open,
  onOpenChange,
  children,
}: ExperienceDialogProps) => {
  const intl = useIntl();
  const { titleHtml, editPath } = useExperienceInfo(experience);
  const editHref = editPathProp ?? editPath;

  return (
    <Dialog.Root
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
    >
      <Dialog.Trigger>{trigger}</Dialog.Trigger>
      <Dialog.Content hasSubtitle>
        <Dialog.Header
          subtitle={intl.formatMessage({
            defaultMessage:
              "View this experience's details or edit its information.",
            id: "Dr9vKe",
            description: "Subtitle for the dialog displaying an experience",
          })}
        >
          {titleHtml}
        </Dialog.Header>
        <Dialog.Body>
          {children}
          <Separator space="sm" decorative />
          <SkillsContent skills={experience.skills} headingRank="h3" />
          <Dialog.Footer>
            {editHref && (
              <Link href={editHref} mode="solid" color="primary">
                {intl.formatMessage({
                  defaultMessage: "Edit experience",
                  id: "zfX1QQ",
                  description:
                    "Link text to edit the experience shown in the dialog",
                })}
              </Link>
            )}
            <Dialog.Close>
              <Button color="warning" mode="inline">
                {intl.formatMessage(commonMessages.cancel)}
              </Button>
            </Dialog.Close>
          </Dialog.Footer>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ExperienceDialog;
