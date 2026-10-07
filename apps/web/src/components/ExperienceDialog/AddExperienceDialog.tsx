import type { ReactNode } from "react";
import { useIntl } from "react-intl";
import PlusCircleIcon from "@heroicons/react/24/solid/PlusCircleIcon";

import { Button, Dialog, Heading, Link } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";
import type { ExperienceType } from "~/types/experience";
import experienceMessages from "~/messages/experienceMessages";

interface ExperienceTypeDetails {
  title: string;
  description: string;
  linkText: string;
}

interface AddExperienceDialogProps {
  trigger: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AddExperienceDialog = ({
  trigger,
  defaultOpen,
  open,
  onOpenChange,
}: AddExperienceDialogProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const experienceTypes: Record<ExperienceType, ExperienceTypeDetails> = {
    work: {
      title: intl.formatMessage(experienceMessages.work),
      description: intl.formatMessage(experienceMessages.workDescription),
      linkText: intl.formatMessage(experienceMessages.addWork),
    },
    education: {
      title: intl.formatMessage(experienceMessages.education),
      description: intl.formatMessage(experienceMessages.educationDescription),
      linkText: intl.formatMessage(experienceMessages.addEducation),
    },
    community: {
      title: intl.formatMessage(experienceMessages.community),
      description: intl.formatMessage(experienceMessages.communityDescription),
      linkText: intl.formatMessage(experienceMessages.addCommunity),
    },
    personal: {
      title: intl.formatMessage(experienceMessages.personal),
      description: intl.formatMessage(experienceMessages.personalDescription),
      linkText: intl.formatMessage(experienceMessages.addPersonal),
    },
    award: {
      title: intl.formatMessage(experienceMessages.award),
      description: intl.formatMessage(experienceMessages.awardDescription),
      linkText: intl.formatMessage(experienceMessages.addAward),
    },
  };

  return (
    <Dialog.Root
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
    >
      <Dialog.Trigger>{trigger}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          {intl.formatMessage(experienceMessages.addNewExperience)}
        </Dialog.Header>
        <Dialog.Body>
          <div className="flex flex-col gap-y-9">
            {Object.entries(experienceTypes).map(([type, details]) => (
              <div key={type}>
                <Heading rank="h3" size="h6" className="mt-0 mb-3 font-bold">
                  {details.title}
                </Heading>
                <p className="mb-3 text-gray-600 dark:text-gray-100">
                  {details.description}
                </p>
                <Link
                  href={paths.createExperience()}
                  icon={PlusCircleIcon}
                  className="font-bold"
                >
                  {details.linkText}
                </Link>
              </div>
            ))}
          </div>
          <Dialog.Footer>
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

export default AddExperienceDialog;
