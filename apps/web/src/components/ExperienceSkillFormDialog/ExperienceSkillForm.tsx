import { useIntl } from "react-intl";
import { useForm, FormProvider } from "react-hook-form";

import { Dialog, Button, Heading, Well } from "@gc-digital-talent/ui";
import { Select, TextArea } from "@gc-digital-talent/forms";
import {
  errorMessages,
  formMessages,
  getLocale,
  Locales,
} from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import {
  Experience,
  FragmentType,
  getFragment,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";

import {
  deriveExperienceType,
  getExperienceName,
} from "~/utils/experienceUtils";
import { useExperienceMutations } from "~/hooks/useExperienceMutations";
import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";

const TEXT_AREA_MAX_WORDS_EN = 400;

const getSkillArgs = (
  skillId: Scalars["ID"]["output"],
  experience?: Omit<Experience, "user">,
  details?: string,
  remove?: boolean,
) => {
  const isExisting = experience?.skills?.find(
    (experienceSkill) => experienceSkill.id === skillId,
  );

  if (!remove) {
    const args = [{ id: skillId, details }];

    return isExisting ? { update: args } : { connect: args };
  }

  return {
    disconnect: [skillId],
  };
};

const ExperienceSkillFormExperience_Fragment = graphql(/** GraphQL */ `
  fragment ExperienceSkillFormExperience on Experience {
    id
    ... on AwardExperience {
      title
    }
    ... on CommunityExperience {
      title
      organization
    }
    ... on EducationExperience {
      type {
        value
      }
      areaOfStudy
      institution
    }
    ... on PersonalExperience {
      title
    }
    ... on WorkExperience {
      role
      organization
      cafForce {
        label {
          en
          fr
        }
      }
      employmentCategory {
        value
      }
      department {
        name {
          en
          fr
        }
      }
    }
  }
`);

type FormAction = "connect" | "remove";

interface FormValues {
  experience?: Scalars["ID"]["output"];
  skill?: Scalars["ID"]["output"];
  details?: string;
  action?: FormAction;
}

interface ExperienceSkillFormProps {
  defaultValues: FormValues;
  experiencesQuery: FragmentType<
    typeof ExperienceSkillFormExperience_Fragment
  >[];
  onSuccess: () => void;
}

const ExperienceSkillForm = ({
  defaultValues,
  onSuccess,
  experiencesQuery,
}: ExperienceSkillFormProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const methods = useForm<FormValues>({
    defaultValues,
  });
  const {
    register,
    setValue,
    formState: { isSubmitting },
  } = methods;
  const actionProps = register("action");
  const selectedExperienceId = methods.watch("experience");
  const experiences = getFragment(
    ExperienceSkillFormExperience_Fragment,
    experiencesQuery,
  );
  const selectedExperience = experiences.find(
    (exp) => exp.id === selectedExperienceId,
  );
  const experienceType = selectedExperience
    ? deriveExperienceType(selectedExperience)
    : "personal";
  const { executeMutation, getMutationArgs, executing } =
    useExperienceMutations("update", experienceType);

  const handleSubmit = async (formValues: FormValues) => {
    const args = getMutationArgs(
      formValues.experience ?? "",
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
      await executeMutation(args)
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

  const wordCountLimits: Record<Locales, number> = {
    en: TEXT_AREA_MAX_WORDS_EN,
    fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
  } as const;

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <input type="hidden" {...methods.register("skill")} />
        <Heading level="h2" size="h6" data-h2-margin="base(0 0 x1 0)">
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
            id: "baAj/Z",
            description: "Title for select an experience action",
          })}
          rules={{ required: intl.formatMessage(errorMessages.required) }}
          nullSelection={intl.formatMessage({
            defaultMessage: "Select an experience",
            id: "baAj/Z",
            description: "Title for select an experience action",
          })}
          options={experiences.map((experienceOption) => ({
            value: experienceOption.id,
            label: getExperienceName(experienceOption, intl),
          }))}
        />
        <Heading level="h2" size="h6" data-h2-margin="base(x2, 0, x.5, 0)">
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
        <Heading
          level="h3"
          size="h6"
          data-h2-font-size="base(copy)"
          data-h2-margin-top="base(x.5)"
        >
          {intl.formatMessage({
            defaultMessage: "How to best describe a skill experience",
            id: "1/Q9jX",
            description: "Title for instructions on how to describe a skill",
          })}
        </Heading>
        <ul data-h2-margin="base(x.5 0 x1 0)">
          <li>
            {intl.formatMessage({
              defaultMessage:
                "How did you demonstrate this skill in this role?",
              id: "3eeKdd",
              description: "Question for clarifying skill details",
            })}
          </li>
          <li>
            {intl.formatMessage({
              defaultMessage:
                "What tasks or activities did you do that relate to this skill?",
              id: "ac1z9L",
              description: "Question about related tasks to a skill",
            })}
          </li>
          <li>
            {intl.formatMessage({
              defaultMessage:
                "Were there any special techniques or approaches that you used?",
              id: "Ivvi/F",
              description: "Question about techniques used for a skill",
            })}
          </li>
          <li>
            {intl.formatMessage({
              defaultMessage:
                "How much responsibility did you have in this role?",
              id: "Qjpmm8",
              description: "Question for clarifying skill details",
            })}
          </li>
        </ul>
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
          <TextArea
            id="details"
            name="details"
            wordLimit={wordCountLimits[locale]}
            label={intl.formatMessage({
              defaultMessage: "Describe how you used this skill",
              id: "L7PqXn",
              description: "Label for skill experience details input",
            })}
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        )}
        <Dialog.Footer>
          <div
            data-h2-width="base(100%)"
            data-h2-display="base(flex)"
            data-h2-flex-wrap="base(wrap)"
            data-h2-flex-direction="base(row)"
            data-h2-gap="base(x1)"
          >
            <Button
              type="submit"
              mode="solid"
              color="secondary"
              disabled={isSubmitting}
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
            <Dialog.Close>
              <Button type="button" mode="inline" color="warning">
                {intl.formatMessage(formMessages.cancelGoBack)}
              </Button>
            </Dialog.Close>
            {defaultValues.experience && (
              <Button
                type="submit"
                mode="inline"
                color="error"
                disabled={executing || isSubmitting}
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
          </div>
        </Dialog.Footer>
      </form>
    </FormProvider>
  );
};

export default ExperienceSkillForm;
