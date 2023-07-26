import React from "react";
import { useIntl } from "react-intl";
import { useForm, FormProvider } from "react-hook-form";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";

import { Button, Dialog, IconType } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import { Scalars, Skill, SkillCategory } from "~/api/generated";

import SkillDetails from "./SkillDetails";
import SkillSelection from "./SkillSelection";
import { getSkillDialogMessages } from "./utils";
import { SkillDialogContext } from "./types";

export interface FormValues {
  category?: SkillCategory | "";
  family?: Scalars["ID"];
  skill?: Scalars["ID"];
  details?: string;
}

const defaultFormValues: FormValues = {
  category: "",
  family: "",
  skill: "",
};

export interface SkillDialogProps {
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
    getValues,
    trigger: formTrigger,
    reset,
    watch,
    formState: { isSubmitting },
  } = methods;
  const watchSkill = watch("skill");

  // Option 1: Move SkillDialog component outside of parent form (reactdom NOT browserdom?) and use css to move trigger with all event mutations props.
  // Option 2: Change SkillDialog to not submit but instead run onSave function.
  const handleAddSkill = async (values: FormValues) => {
    const result = await formTrigger(["skill"]);
    if (result) await onSave(values).then(() => setIsOpen(false));
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

  React.useEffect(() => {
    if (watchSkill) {
      formTrigger("skill");
    }
  }, [watchSkill, formTrigger]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        <Button {...triggerProps} color="secondary" />
      </Dialog.Trigger>
      <Dialog.Content data-h2-position="base(absolute)">
        <Dialog.Header subtitle={subtitle}>{title}</Dialog.Header>
        <Dialog.Body>
          <FormProvider {...methods}>
            <form>
              <SkillSelection
                {...{ showCategory, skills }}
                onSelectSkill={setSelectedSkill}
              />
              {context === "library" && (
                <p data-h2-margin="base(x1 0)">
                  {intl.formatMessage({
                    defaultMessage:
                      "Once you've found a skill, we ask that you give an honest evaluation of your approximate experience level. This level will be provided to hiring managers alongside any official Government of Canada skill evaluations to help provide a more holistic understanding of your abilities.",
                    id: "bMY93S",
                    description: "Help text for providing a skill level",
                  })}
                </p>
              )}
              {selectedSkill && context === "library" && <SkillDetails />}
              <Dialog.Footer data-h2-justify-content="base(flex-start)">
                <Button
                  type="button"
                  color="secondary"
                  disabled={isSubmitting}
                  onClick={() => handleAddSkill(getValues())}
                >
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
