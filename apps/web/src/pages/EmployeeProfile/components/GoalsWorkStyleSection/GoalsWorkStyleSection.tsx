import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";
import { useMutation } from "urql";
import LockClosedIcon from "@heroicons/react/24/outline/LockClosedIcon";

import {
  Button,
  CardSeparator,
  Notice,
  ToggleSection,
} from "@gc-digital-talent/ui";
import { Submit, TextArea } from "@gc-digital-talent/forms";
import type { Locales } from "@gc-digital-talent/i18n";
import {
  commonMessages,
  formMessages,
  getLocale,
} from "@gc-digital-talent/i18n";
import type { FragmentType, EmployeeProfile } from "@gc-digital-talent/graphql";
import { graphql, getFragment } from "@gc-digital-talent/graphql";
import { toast } from "@gc-digital-talent/toast";
import { useAuthorization } from "@gc-digital-talent/auth";
import { UnauthorizedError } from "@gc-digital-talent/helpers";

import { hasAllEmptyFields } from "~/validators/employeeProfile/goalsWorkStyle";
import type { SectionIcon } from "~/hooks/useToggleSectionInfo";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";
import employeeProfileMessages from "~/messages/employeeProfileMessages";

import Display from "./Display";

export const EmployeeProfileGoalsWorkStyle_Fragment = graphql(/* GraphQL */ `
  fragment EmployeeProfileGoalsWorkStyle on EmployeeProfile {
    aboutYou
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
      userPublicProfile {
        id
      }
    }
  }
`);

interface FormValues {
  aboutYou?: string;
  learningGoals?: string;
  workStyle?: string;
}

interface GoalsWorkStyleSectionProps {
  employeeProfileQuery: FragmentType<
    typeof EmployeeProfileGoalsWorkStyle_Fragment
  >;
  isVerifiedGovEmployee: boolean;
}

const TEXT_AREA_MAX_WORDS_EN = 200;

const wordCountLimits: Record<Locales, number> = {
  en: TEXT_AREA_MAX_WORDS_EN,
  fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
} as const;

const GoalsWorkStyleSection = ({
  employeeProfileQuery,
  isVerifiedGovEmployee,
}: GoalsWorkStyleSectionProps) => {
  const intl = useIntl();
  const { userAuthInfo } = useAuthorization();
  const locale = getLocale(intl);
  const [{ fetching }, executeMutation] = useMutation(
    UpdateEmployeeProfile_Mutation,
  );

  const employeeProfile = getFragment(
    EmployeeProfileGoalsWorkStyle_Fragment,
    employeeProfileQuery,
  );
  const isNull = hasAllEmptyFields(employeeProfile);
  const {
    isEditing,
    setIsEditing,
    icon: verifiedIcon,
  } = useToggleSectionInfo({
    isNull,
    emptyRequired: false,
    fallbackIcon: QuestionMarkCircleIcon,
    optional: true,
  });

  const icon: SectionIcon = isVerifiedGovEmployee
    ? verifiedIcon
    : {
        icon: LockClosedIcon,
      };

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
    learningGoals: initialData.learningGoals ?? "",
    workStyle: initialData.workStyle ?? "",
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(employeeProfile),
  });
  const { handleSubmit } = methods;

  const handleSave = async ({
    aboutYou,
    learningGoals,
    workStyle,
  }: FormValues) => {
    if (!userAuthInfo?.id) {
      throw new UnauthorizedError();
    }
    return executeMutation({
      id: userAuthInfo.id,
      employeeProfile: {
        aboutYou,
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
        icon={icon.icon}
        color={icon.color}
        level="h3"
        size="h4"
        toggle={
          isVerifiedGovEmployee ? (
            <ToggleForm.LabelledTrigger
              sectionTitle={intl.formatMessage({
                defaultMessage: "Your goals and work style",
                id: "0c/3Iw",
                description: "Title for goals and work style section",
              })}
            />
          ) : undefined
        }
        className="font-bold"
      >
        {intl.formatMessage({
          defaultMessage: "Your goals and work style",
          id: "0c/3Iw",
          description: "Title for goals and work style section",
        })}
      </ToggleSection.Header>
      <p>{subtitle}</p>
      <ToggleSection.Content>
        {isVerifiedGovEmployee ? (
          <>
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
                  <div className="flex flex-col gap-y-6">
                    <TextArea
                      id="aboutYou"
                      label={intl.formatMessage(
                        employeeProfileMessages.aboutYou,
                      )}
                      name="aboutYou"
                      wordLimit={wordCountLimits[locale]}
                    />
                    <CardSeparator space="none" />
                    <TextArea
                      id="learningGoals"
                      label={intl.formatMessage(
                        employeeProfileMessages.learningGoals,
                      )}
                      name="learningGoals"
                      wordLimit={wordCountLimits[locale]}
                    />
                    <CardSeparator space="none" />
                    <TextArea
                      id="workStyle"
                      label={intl.formatMessage(
                        employeeProfileMessages.workStyle,
                      )}
                      name="workStyle"
                      wordLimit={wordCountLimits[locale]}
                    />
                    <CardSeparator space="none" />
                    <div className="flex flex-wrap items-center gap-6">
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
                        <Button mode="inline" type="button" color="warning">
                          {intl.formatMessage(commonMessages.cancel)}
                        </Button>
                      </ToggleSection.Close>
                    </div>
                  </div>
                </form>
              </FormProvider>
            </ToggleSection.OpenContent>
          </>
        ) : (
          <Notice.Root>
            <Notice.Title>
              {intl.formatMessage({
                defaultMessage:
                  "This tool is available to Government of Canada employees",
                id: "xHQdue",
                description:
                  "Notice title on sections for employee profile page when not a verified employee.",
              })}
            </Notice.Title>
            <Notice.Content>
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "If you're a current Government of Canada employee, verify your work email and ensure your career experience is up to date to unlock employee tools.",
                  id: "TIuM+L",
                  description:
                    "Notice description on sections for employee profile page when not a verified employee.",
                })}
              </p>
            </Notice.Content>
          </Notice.Root>
        )}
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default GoalsWorkStyleSection;
