import { useIntl } from "react-intl";
import { useForm, FormProvider } from "react-hook-form";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import { ReactNode, useEffect, useState } from "react";

import {
  Button,
  ButtonProps,
  Dialog,
  IconType,
  Link,
} from "@gc-digital-talent/ui";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import { Skill, SkillCategory } from "@gc-digital-talent/graphql";

import SkillDetails from "./SkillDetails";
import SkillSelection from "./SkillSelection";
import {
  defaultFormValues,
  getSkillBrowserDialogMessages,
  showDetails,
} from "./utils";
import { SkillBrowserDialogContext, FormValues } from "./types";
import SkillDetailsPool from "./SkillDetailsPool";
import useRoutes from "../../hooks/useRoutes";

interface SkillBrowserDialogProps {
  // All available skills
  skills: Skill[];
  // The context in which the dialog is being used
  context?: SkillBrowserDialogContext;
  // Currently selected skills (only needed if you want to display them in the selection)
  inLibrary?: Skill[];
  // Should the dialog be open on page load?
  defaultOpen?: boolean;
  // Customize the trigger text and icon
  trigger?: {
    id?: string;
    label?: ReactNode;
    icon?: IconType | null;
    mode?: ButtonProps["mode"];
    disabled?: boolean;
    block?: boolean;
  };
  // initial state (like when editing)
  initialState?: FormValues;
  noToast?: boolean;
  // Callback function when a skill is selected
  onSave: (values: FormValues) => Promise<void>;
  /** Custom trigger button which overrides default settings */
  customTrigger?: ReactNode;
}

const SkillBrowserDialog = ({
  skills,
  onSave,
  context,
  trigger,
  inLibrary,
  initialState,
  defaultOpen = false,
  noToast = false,
  customTrigger,
  ...rest
}: SkillBrowserDialogProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const [isOpen, setIsOpen] = useState<boolean>(defaultOpen);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const methods = useForm<FormValues>({
    defaultValues: initialState ?? defaultFormValues,
  });

  const {
    title,
    subtitle,
    trigger: triggerMessage,
    submit,
    selected,
  } = getSkillBrowserDialogMessages({
    context,
    intl,
  });

  const {
    trigger: formTrigger,
    reset,
    watch,
    formState: { isSubmitting },
  } = methods;
  const watchSkill = watch("skill");

  // Option 1: Move SkillBrowserDialog component outside of parent form (reactdom NOT browserdom?) and use css to move trigger with all event mutations props.
  // Option 2: Change SkillBrowserDialog to not submit but instead run onSave function.
  const handleAddSkill = async (values: FormValues) => {
    const result = await formTrigger(["skill"]);
    if (result)
      await onSave(values).then(() => {
        setIsOpen(false);
        reset();
        if (!noToast)
          toast.success(selected(getLocalizedName(selectedSkill?.name, intl)));
      });
  };

  const handleOpenChange = (newIsOpen: boolean) => {
    if (!newIsOpen) {
      reset();
    }
    setIsOpen(newIsOpen);
  };

  let derivedIcon: ButtonProps["icon"];
  if (trigger?.icon) {
    derivedIcon = trigger.icon; // an icon was specified
  } else if (trigger?.icon === null) {
    derivedIcon = undefined; // an icon was explicitly not set
  } else if (context) {
    derivedIcon = PlusCircleIcon; // with a context, there's a fallback
  } else {
    derivedIcon = undefined; // nothing requested, leave blank
  }

  const triggerProps = {
    id: trigger?.id,
    children: trigger?.label ?? triggerMessage,
    icon: derivedIcon,
    mode: trigger?.mode,
    disabled: trigger?.disabled,
    block: trigger?.block,
  };

  useEffect(() => {
    if (watchSkill) {
      void formTrigger("skill");
    }
  }, [watchSkill, formTrigger]);

  const skillInLibrary = !!inLibrary?.find(
    (librarySkill) => selectedSkill?.id === librarySkill.id,
  );
  const shouldShowDetails = showDetails(skillInLibrary, context);

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        {customTrigger ?? (
          <Button {...triggerProps} {...rest} color="secondary" />
        )}
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header subtitle={subtitle}>{title}</Dialog.Header>
        <Dialog.Body>
          <FormProvider {...methods}>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await methods.handleSubmit(handleAddSkill)(e);
                return false;
              }}
            >
              <SkillSelection
                {...{ skills, inLibrary }}
                onSelectSkill={setSelectedSkill}
              />
              {selectedSkill && shouldShowDetails && (
                <SkillDetails
                  category={
                    selectedSkill.category.value ?? SkillCategory.Technical
                  }
                />
              )}
              {selectedSkill && context === "pool" && (
                <SkillDetailsPool
                  category={
                    selectedSkill.category.value ?? SkillCategory.Technical
                  }
                />
              )}
              <Dialog.Footer>
                <Button type="submit" color="secondary">
                  {isSubmitting
                    ? intl.formatMessage(commonMessages.saving)
                    : submit}
                </Button>
                <Dialog.Close>
                  <Button type="button" mode="inline" color="warning">
                    {intl.formatMessage(commonMessages.cancel)}
                  </Button>
                </Dialog.Close>
                <Link
                  newTab
                  href={`${paths.skills()}#cant-find-a-skill`}
                  mode="inline"
                  data-h2-margin-left="base(auto)"
                >
                  {intl.formatMessage({
                    defaultMessage: "Can't find a skill?",
                    id: "4qdoau",
                    description:
                      "Link to suggestions on what to do if you can't find a skill in the skill browser.",
                  })}
                </Link>
              </Dialog.Footer>
            </form>
          </FormProvider>
        </Dialog.Body>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default SkillBrowserDialog;
