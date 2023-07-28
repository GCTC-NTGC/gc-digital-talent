import React from "react";
import { useIntl } from "react-intl";
import { useForm, FormProvider } from "react-hook-form";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";

import { Button, Dialog, IconType } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import { Scalars, Skill, SkillCategory } from "~/api/generated";

import SkillDetails from "./SkillDetails";
import SkillSelection from "./SkillSelection";
import { getSkillDialogMessages, showDetails } from "./utils";
import { SkillDialogContext } from "./types";

export interface FormValues {
  category?: SkillCategory | "all" | "";
  family?: Scalars["ID"];
  skill?: Scalars["ID"];
  details?: string;
}

const defaultFormValues: FormValues = {
  category: "all",
  family: "all",
  skill: "",
};

interface SkillDialogProps {
  skills: Skill[];
  context?: SkillDialogContext;
  showCategory?: boolean;
  defaultOpen?: boolean;
  trigger?: {
    label?: React.ReactNode;
    icon?: IconType;
  };
  onSave: (values: FormValues) => Promise<void>;
}

const SkillDialog = ({
  skills,
  onSave,
  context,
  showCategory,
  trigger,
  defaultOpen = false,
}: SkillDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = React.useState<boolean>(defaultOpen);
  const [selectedSkill, setSelectedSkill] = React.useState<Skill | null>(null);
  const methods = useForm<FormValues>({
    defaultValues: defaultFormValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleAddSkill = async (values: FormValues) => {
    await onSave(values).then(() => setIsOpen(false));
  };

  const handleOpenChange = (newIsOpen: boolean) => {
    if (!newIsOpen) {
      reset();
    }
    setIsOpen(newIsOpen);
  };

  const {
    title,
    subtitle,
    trigger: triggerMessage,
    submit,
  } = getSkillDialogMessages({
    context,
    intl,
  });

  const triggerProps = {
    children: trigger?.label || triggerMessage,
    icon: trigger?.icon || (context ? PlusCircleIcon : undefined),
  };

  const shouldShowDetails = showDetails(context);

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        <Button {...triggerProps} color="secondary" />
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header subtitle={subtitle}>{title}</Dialog.Header>
        <Dialog.Body>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleAddSkill)}>
              <SkillSelection
                {...{ showCategory, skills }}
                onSelectSkill={setSelectedSkill}
              />
              {selectedSkill && shouldShowDetails && <SkillDetails />}
              <Dialog.Footer data-h2-justify-content="base(flex-start)">
                <Button type="submit" color="secondary" disabled={isSubmitting}>
                  {isSubmitting
                    ? intl.formatMessage(commonMessages.saving)
                    : submit}
                </Button>
                <Dialog.Close>
                  <Button type="button" mode="inline" color="quaternary">
                    {intl.formatMessage({
                      defaultMessage: "Cancel",
                      id: "OVBFto",
                      description:
                        "Button text to cancel and close the skill dialog",
                    })}
                  </Button>
                </Dialog.Close>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default SkillDialog;
