import React from "react";
import { useIntl } from "react-intl";
import { useForm, FormProvider } from "react-hook-form";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";

import { Button, ButtonProps, Dialog, IconType } from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";

import { Skill } from "~/api/generated";

import SkillDetails from "./SkillDetails";
import SkillSelection from "./SkillSelection";
import { getSkillDialogMessages, showDetails } from "./utils";
import { SkillDialogContext, FormValues } from "./types";

const defaultFormValues: FormValues = {
  category: "",
  family: "",
  skill: "",
};

interface SkillDialogProps {
  // All available skills
  skills: Skill[];
  // The context in which the dialog is being used
  context?: SkillDialogContext;
  // Determines if the category filter is shown or not
  showCategory?: boolean;
  // Currently selected skills (only needed if you want to display them in the selection)
  inLibrary?: Skill[];
  // Should the dialog be open on page load?
  defaultOpen?: boolean;
  // Customize the trigger text and icon
  trigger?: {
    label?: React.ReactNode;
    icon?: IconType;
    block?: ButtonProps["block"];
  };
  // Callback function when a skill is selected
  onSave: (values: FormValues) => Promise<void>;
}

const SkillDialog = ({
  skills,
  onSave,
  context,
  showCategory,
  trigger,
  inLibrary,
  defaultOpen = false,
}: SkillDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = React.useState<boolean>(defaultOpen);
  const [selectedSkill, setSelectedSkill] = React.useState<Skill | null>(null);
  const methods = useForm<FormValues>({
    defaultValues: defaultFormValues,
  });

  const {
    title,
    subtitle,
    trigger: triggerMessage,
    submit,
    selected,
  } = getSkillDialogMessages({
    context,
    intl,
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
    if (result)
      await onSave(values).then(() => {
        setIsOpen(false);
        toast.success(selected(getLocalizedName(selectedSkill?.name, intl)));
      });
  };

  const handleOpenChange = (newIsOpen: boolean) => {
    if (!newIsOpen) {
      reset();
    }
    setIsOpen(newIsOpen);
  };

  const triggerProps = {
    children: trigger?.label || triggerMessage,
    icon: trigger?.icon || (context ? PlusCircleIcon : undefined),
    block: trigger?.block || false,
  };

  React.useEffect(() => {
    if (watchSkill) {
      formTrigger("skill");
    }
  }, [watchSkill, formTrigger]);

  const shouldShowDetails = showDetails(context);

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
                {...{ showCategory, skills, inLibrary }}
                onSelectSkill={setSelectedSkill}
              />
              {selectedSkill && shouldShowDetails && (
                <SkillDetails context={context} />
              )}
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
