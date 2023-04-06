import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useIntl } from "react-intl";

import { Button, Dialog } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import { Scalars, Skill, SkillCategory } from "~/api/generated";

import SkillSelection from "./SkillSelection";

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
  onSave: (values: FormValues) => Promise<void>;
}

const AddSkillToExperienceDialog = ({ skills, onSave }: SkillDialogProps) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const methods = useForm<FormValues>({
    defaultValues: defaultFormValues,
  });

  const {
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = methods;

  const [skill] = watch(["skill"]);

  const handleAddSkill = async (values: FormValues) => {
    await onSave(values).then(() => setIsOpen(false));
  };

  const handleOpenChange = (newIsOpen: boolean) => {
    if (!newIsOpen) {
      reset();
    }
    setIsOpen(newIsOpen);
  };

  const title = intl.formatMessage({
    defaultMessage: "Find a skill",
    id: "mLmPpf",
    description: "Title for the find a skill dialog",
  });

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Trigger>
        <Button color="blue" mode="solid">
          {title}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>{title}</Dialog.Header>
        <Dialog.Body>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleAddSkill)}>
              <SkillSelection skills={skills} showStep={false} />
              <Dialog.Footer
                data-h2-justify-content="base(flex-start)"
                data-h2-align-items="base(flex-start)"
              >
                <div>
                  <Button
                    type="submit"
                    {...(skill
                      ? {
                          disabled: isSubmitting,
                          color: "blue",
                          mode: "solid",
                          "aria-describedby": undefined,
                        }
                      : {
                          disabled: true,
                          color: "black",
                          mode: "outline",
                          "aria-describedby": "skill-submit-help",
                        })}
                  >
                    {isSubmitting
                      ? intl.formatMessage(commonMessages.saving)
                      : intl.formatMessage({
                          defaultMessage: "Add this skill",
                          id: "pfaK3q",
                          description:
                            "Button text for the find a skill dialog submit button",
                        })}
                  </Button>
                  {!skill && (
                    <p
                      id="skill-submit-help"
                      data-h2-font-size="base(caption)"
                      data-h2-margin="base(x.5, 0, 0, 0)"
                    >
                      {intl.formatMessage({
                        id: "ZrUAVI",
                        defaultMessage: "Please, select a skill to continue",
                        description:
                          "Help text to explain why skill dialog submit button is disabled",
                      })}
                    </p>
                  )}
                </div>
                <Dialog.Close>
                  <Button
                    type="button"
                    mode="inline"
                    color="blue"
                    data-h2-padding="base(x.5, 0)"
                  >
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

export default AddSkillToExperienceDialog;
