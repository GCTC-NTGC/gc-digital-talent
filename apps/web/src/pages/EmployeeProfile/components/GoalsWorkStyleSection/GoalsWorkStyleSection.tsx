import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";
import { useMutation } from "urql";

import { Button, ToggleSection } from "@gc-digital-talent/ui";
import { RichTextInput, Submit } from "@gc-digital-talent/forms";
import {
  commonMessages,
  formMessages,
  getLocale,
  Locales,
} from "@gc-digital-talent/i18n";
import {
  graphql,
  FragmentType,
  getFragment,
  EmployeeProfile,
} from "@gc-digital-talent/graphql";
import { useAuthorization } from "@gc-digital-talent/auth";
import { UnauthorizedError } from "@gc-digital-talent/helpers";
import { toast } from "@gc-digital-talent/toast";

import { hasAllEmptyFields } from "~/validators/employeeProfile/goalsWorkStyle";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";
import employeeProfileMessages from "~/messages/employeeProfileMessages";

import Display from "./Display";

const EmployeeProfileGoalsWorkStyle_Fragment = graphql(/* GraphQL */ `
  fragment EmployeeProfileGoalsWorkStyle on EmployeeProfile {
    aboutYou
    careerGoals
    learningGoals
    workStyle
  }
`);

const UpdateEmployeeProfile_Mutation = graphql(/* GraphQL */ `
  mutation UpdateEmployeeProfile(
    $id: UUID!
    $employeeProfile: UpdateEmployeeProfileInput!
  ) {
    updateEmployeeProfile(id: $id, employeeProfile: $employeeProfile) {
      aboutYou
      careerGoals
      learningGoals
      workStyle
    }
  }
`);

interface FormValues {
  aboutYou?: string;
  careerGoals?: string;
  learningGoals?: string;
  workStyle?: string;
}

interface GoalsWorkStyleSectionProps {
  employeeProfileQuery: FragmentType<
    typeof EmployeeProfileGoalsWorkStyle_Fragment
  >;
}

const TEXT_AREA_MAX_WORDS_EN = 100;

const wordCountLimits: Record<Locales, number> = {
  en: TEXT_AREA_MAX_WORDS_EN,
  fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
} as const;

const GoalsWorkStyleSection = ({
  employeeProfileQuery,
}: GoalsWorkStyleSectionProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const { userAuthInfo } = useAuthorization();
  const [{ fetching }, executeMutation] = useMutation(
    UpdateEmployeeProfile_Mutation,
  );

  const employeeProfile = getFragment(
    EmployeeProfileGoalsWorkStyle_Fragment,
    employeeProfileQuery,
  );
  const isNull = hasAllEmptyFields(employeeProfile);
  const { isEditing, setIsEditing, icon } = useToggleSectionInfo({
    isNull,
    emptyRequired: false,
    fallbackIcon: QuestionMarkCircleIcon,
    optional: true,
  });

  const handleError = () => {
    toast.error(
      intl.formatMessage({
        defaultMessage: "Failed updating goals and work style information",
        id: "pKTmqM",
        description:
          "Message displayed when a user fails to updates employee profile information",
      }),
    );
  };

  const dataToFormValues = (initialData: EmployeeProfile): FormValues => ({
    aboutYou: initialData.aboutYou ?? "",
    careerGoals: initialData.careerGoals ?? "",
    learningGoals: initialData.learningGoals ?? "",
    workStyle: initialData.workStyle ?? "",
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(employeeProfile),
  });
  const { handleSubmit } = methods;

  const handleSave = async ({
    aboutYou,
    careerGoals,
    learningGoals,
    workStyle,
  }: FormValues) => {
    if (!userAuthInfo?.id) {
      throw new UnauthorizedError();
    }

    return executeMutation({
      id: userAuthInfo?.id,
      employeeProfile: {
        aboutYou,
        careerGoals,
        learningGoals,
        workStyle,
      },
    })
      .then((result) => {
        if (result.data?.updateEmployeeProfile) {
          toast.success(
            intl.formatMessage({
              defaultMessage:
                "Goals and work style information updated successfully!",
              id: "voMSDe",
              description:
                "Message displayed when a user successfully updates employee profile information",
            }),
          );
          setIsEditing(false);
          methods.reset(
            {
              aboutYou,
              careerGoals,
              learningGoals,
              workStyle,
            },
            { keepDirty: true },
          );
        } else {
          handleError();
        }
      })
      .catch(handleError);
  };

  const subtitle = intl.formatMessage({
    defaultMessage:
      "This section allows you to express a bit about yourself and how you work, including your goals for the future and the environments that are most beneficial for how you do your best work.",
    id: "MptxTu",
    description:
      "Describes the goals and work style section of employee profile",
  });

  return (
    <ToggleSection.Root
      id="goals-work-style-form"
      open={isEditing}
      onOpenChange={setIsEditing}
    >
      <ToggleSection.Header
        Icon={icon.icon}
        color={icon.color}
        level="h3"
        size="h4"
        toggle={
          <ToggleForm.LabelledTrigger
            sectionTitle={intl.formatMessage({
              defaultMessage: "Your goals and work style",
              id: "0c/3Iw",
              description: "Title for goals and work style section",
            })}
          />
        }
        data-h2-font-weight="base(bold)"
      >
        {intl.formatMessage({
          defaultMessage: "Your goals and work style",
          id: "0c/3Iw",
          description: "Title for goals and work style section",
        })}
      </ToggleSection.Header>
      <p>{subtitle}</p>
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {isNull ? (
            <ToggleForm.NullDisplay />
          ) : (
            <Display employeeProfile={employeeProfile} />
          )}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              <div
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-gap="base(x1)"
              >
                <RichTextInput
                  id="aboutYou"
                  label={intl.formatMessage(employeeProfileMessages.aboutYou)}
                  name="aboutYou"
                  wordLimit={wordCountLimits[locale]}
                />
                <RichTextInput
                  id="careerGoals"
                  label={intl.formatMessage(
                    employeeProfileMessages.careerGoals,
                  )}
                  name="careerGoals"
                  wordLimit={wordCountLimits[locale]}
                />
                <RichTextInput
                  id="learningGoals"
                  label={intl.formatMessage(
                    employeeProfileMessages.learningGoals,
                  )}
                  name="learningGoals"
                  wordLimit={wordCountLimits[locale]}
                />
                <RichTextInput
                  id="workStyle"
                  label={intl.formatMessage(employeeProfileMessages.workStyle)}
                  name="workStyle"
                  wordLimit={wordCountLimits[locale]}
                />
                <div
                  data-h2-display="base(flex)"
                  data-h2-gap="base(x.5)"
                  data-h2-align-items="base(center)"
                  data-h2-flex-wrap="base(wrap)"
                >
                  <Submit
                    text={intl.formatMessage(formMessages.saveChanges)}
                    aria-label={intl.formatMessage({
                      defaultMessage: "Save goals and work style",
                      id: "PkE/Ir",
                      description:
                        "Text on a button to save goals and work style form",
                    })}
                    color="secondary"
                    mode="solid"
                    isSubmitting={fetching}
                  />
                  <ToggleSection.Close>
                    <Button mode="inline" type="button" color="quaternary">
                      {intl.formatMessage(commonMessages.cancel)}
                    </Button>
                  </ToggleSection.Close>
                </div>
              </div>
            </form>
          </FormProvider>
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default GoalsWorkStyleSection;
