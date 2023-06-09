import React from "react";
import { useIntl } from "react-intl";
import { useForm, FormProvider } from "react-hook-form";

import {
  Dialog,
  Button,
  Heading,
  Accordion,
  StandardAccordionHeader,
  Well,
} from "@gc-digital-talent/ui";
import {
  Select,
  TextArea,
  WordCounter,
  countNumberOfWords,
} from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";

import { Experience, Scalars } from "~/api/generated";
import {
  deriveExperienceType,
  getExperienceName,
} from "~/utils/experienceUtils";
import { useExperienceMutations } from "~/hooks/useExperienceMutations";

const TEXT_AREA_MAX_WORDS = 160;

const getSkillArgs = (
  skillId: Scalars["ID"],
  experience?: Experience,
  details?: string,
  remove?: boolean,
) => {
  const isExisting = experience?.skills?.find(
    (experienceSkill) => experienceSkill.id === skillId,
  );

  if (!isExisting && !remove) {
    return {
      connect: [
        {
          id: skillId,
          details,
        },
      ],
    };
  }

  // Disconnect if we are removing
  if (remove) {
    return {
      disconnect: [skillId],
    };
  }

  // Massage data for an update to single experienceSkillRecord
  const newExperienceSkills = experience?.skills?.map(
    ({ id, experienceSkillRecord }) => ({
      id,
      details: id !== skillId ? experienceSkillRecord?.details : details,
    }),
  );

  return {
    sync: newExperienceSkills,
  };
};

type FormAction = "connect" | "remove";

type FormValues = {
  experience?: Scalars["ID"];
  skill?: Scalars["ID"];
  details?: string;
  action?: FormAction;
};

interface SkillFormProps {
  defaultValues: FormValues;
  experiences: Experience[];
  onSuccess: () => void;
}

const SkillForm = ({
  defaultValues,
  onSuccess,
  experiences,
}: SkillFormProps) => {
  const intl = useIntl();
  const methods = useForm<FormValues>({
    defaultValues,
  });
  const { register, setValue, watch } = methods;
  const actionProps = register("action");
  const selectedExperienceId = methods.watch("experience");
  const selectedExperience = experiences.find(
    (exp) => exp.id === selectedExperienceId,
  );
  const experienceType = selectedExperience
    ? deriveExperienceType(selectedExperience)
    : "";
  const { executeMutation, getMutationArgs } = useExperienceMutations(
    "update",
    experienceType,
  );
  const detailsValue = watch("details");

  const handleSubmit = (formValues: FormValues) => {
    const args = getMutationArgs(
      formValues.experience || "",
      formValues.skill
        ? {
            skills: getSkillArgs(
              formValues.skill,
              selectedExperience,
              formValues.details,
              formValues.action === "remove",
            ),
          }
        : {},
    );
    if (executeMutation) {
      executeMutation(args)
        .then((res) => {
          if (res.data) {
            toast.success(
              formValues.action === "remove"
                ? intl.formatMessage({
                    defaultMessage: "Successfully unlinked experience!",
                    id: "FpDMGu",
                    description:
                      "Success message displayed after unlinking an experience to a skill",
                  })
                : intl.formatMessage({
                    defaultMessage: "Successfully linked experience!",
                    id: "SEdLz1",
                    description:
                      "Success message displayed after linking an experience to a skill",
                  }),
            );
            onSuccess();
          }
        })
        .catch(() => {
          toast.error(
            intl.formatMessage({
              defaultMessage: "Error: linking experience failed",
              id: "a3epXH",
              description:
                "Message displayed to user after experience fails to be linked to a skill.",
            }),
          );
        });
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <input type="hidden" {...methods.register("skill")} />
        <Heading level="h2" size="h6" data-h2-margin-top="base(0)">
          {intl.formatMessage({
            defaultMessage: "Choose the experience you'd like to add",
            id: "dkYHTv",
            description: "Heading for the experience selection",
          })}
        </Heading>
        <Select
          id="experience"
          name="experience"
          disabled={!!defaultValues.experience}
          label={intl.formatMessage({
            defaultMessage: "Select an experience",
            id: "ODZmvO",
            description: "Label for the experience select input",
          })}
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          nullSelection={intl.formatMessage({
            defaultMessage: "Select an experience",
            id: "WP7NTc",
            description: "Placeholder for selecting an experience",
          })}
          options={experiences.map((experienceOption) => ({
            value: experienceOption.id,
            label: getExperienceName(experienceOption, intl),
          }))}
        />
        <Heading level="h2" size="h6">
          {intl.formatMessage({
            defaultMessage:
              "Describe how this skill applied to this experience",
            id: "3hYwWo",
            description: "Heading for the skill experience details section",
          })}
        </Heading>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "If you're unsure how to best describe your use of the skill, try answering some of the questions provided.",
            id: "R1yINv",
            description: "Instructions on how to describe a skill",
          })}
        </p>
        <div data-h2-margin="base(x1 0)">
          <Accordion.Root type="single" collapsible mode="simple">
            <Accordion.Item value="skillQuestions">
              <StandardAccordionHeader
                headingAs="h3"
                titleProps={{ "data-h2-font-size": "base(copy)" }}
              >
                {intl.formatMessage({
                  defaultMessage: "How to best describe a skill experience",
                  id: "1/Q9jX",
                  description:
                    "Title for instructions on how to describe a skill",
                })}
              </StandardAccordionHeader>
              <Accordion.Content>
                <ul>
                  <li>
                    {intl.formatMessage({
                      defaultMessage:
                        "What did you accomplish, create or deliver using this skill?",
                      id: "pV+oii",
                      description: "Question 1 for clarifying skill details",
                    })}
                  </li>
                  <li>
                    {intl.formatMessage({
                      defaultMessage:
                        "What tasks or activities did you do that relate to this skill?",
                      id: "3sXEjF",
                      description: "Question 2 for clarifying skill details",
                    })}
                  </li>
                  <li>
                    {intl.formatMessage({
                      defaultMessage:
                        "Were there any special techniques or approaches that you used?",
                      id: "e9fSNq",
                      description: "Question 3 for clarifying skill details",
                    })}
                  </li>
                  <li>
                    {intl.formatMessage({
                      defaultMessage:
                        "How much responsibility did you have in this role?",
                      id: "mQHftn",
                      description: "Question 4 for clarifying skill details",
                    })}
                  </li>
                </ul>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </div>
        {!selectedExperienceId ? (
          <Well>
            <p data-h2-text-align="base(center)">
              {intl.formatMessage({
                defaultMessage: "Please select an experience to continue.",
                id: "CYkH6C",
                description:
                  "Message displayed when a use has not selected an experience",
              })}
            </p>
          </Well>
        ) : (
          <>
            <TextArea
              id="details"
              name="details"
              rows={3}
              label={intl.formatMessage({
                defaultMessage: "Describe how you used this skill",
                id: "L7PqXn",
                description: "Label for skill experience details input",
              })}
              rules={{
                required: intl.formatMessage(errorMessages.required),
                validate: {
                  wordCount: (value: string) =>
                    countNumberOfWords(value) <= TEXT_AREA_MAX_WORDS ||
                    intl.formatMessage(errorMessages.overWordLimit, {
                      value: TEXT_AREA_MAX_WORDS,
                    }),
                },
              }}
            />
            <div
              data-h2-margin="base(-x.5, 0, 0, 0)"
              data-h2-text-align="base(right)"
            >
              <WordCounter
                text={detailsValue || ""}
                wordLimit={TEXT_AREA_MAX_WORDS}
              />
            </div>
          </>
        )}
        <Dialog.Footer>
          <Dialog.Close>
            <Button type="button" mode="inline" color="secondary">
              {intl.formatMessage({
                defaultMessage: "Cancel and go back",
                id: "tiF/jI",
                description: "Close dialog button",
              })}
            </Button>
          </Dialog.Close>
          {defaultValues.experience && (
            <Button
              type="submit"
              mode="inline"
              color="error"
              {...actionProps}
              onClick={() => setValue("action", "remove")}
            >
              {intl.formatMessage({
                defaultMessage: "Remove this experience",
                id: "1G1iMu",
                description:
                  "Button to remove the link between experience and skill",
              })}
            </Button>
          )}
          <Button
            type="submit"
            mode="solid"
            color="primary"
            {...actionProps}
            onClick={() => setValue("action", "connect")}
          >
            {defaultValues.experience
              ? intl.formatMessage({
                  defaultMessage: "Update this experience",
                  id: "AANjDd",
                  description:
                    "Button to submit the link experience to skill form",
                })
              : intl.formatMessage({
                  defaultMessage: "Add this experience",
                  id: "W+T8Mm",
                  description:
                    "Button to submit the link experience to skill form",
                })}
          </Button>
        </Dialog.Footer>
      </form>
    </FormProvider>
  );
};

export default SkillForm;
