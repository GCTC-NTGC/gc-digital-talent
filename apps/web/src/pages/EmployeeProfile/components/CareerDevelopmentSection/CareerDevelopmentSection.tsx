import { useIntl } from "react-intl";
import { SubmitHandler, useForm } from "react-hook-form";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";
import { useMutation } from "urql";

import { Button, Separator, ToggleSection } from "@gc-digital-talent/ui";
import {
  BasicForm,
  CheckboxOption,
  Checklist,
  Radio,
  RadioGroup,
  Submit,
} from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  ExecCoachingStatus,
  formMessages,
  getExecCoachingInterest,
  getExecCoachingStatus,
  getMentorshipInterest,
  getMentorshipStatus,
  getMoveInterest,
  getOrganizationTypeInterest,
  MentorshipStatus,
} from "@gc-digital-talent/i18n";
import {
  graphql,
  FragmentType,
  getFragment,
  EmployeeProfile,
  UpdateEmployeeProfileInput,
} from "@gc-digital-talent/graphql";
import { boolToYesNo, unpackMaybes } from "@gc-digital-talent/helpers";
import { toast } from "@gc-digital-talent/toast";

import { hasAllEmptyFields } from "~/validators/employeeProfile/careerDevelopment";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";

import Display from "./Display";
import {
  getLabels,
  execCoachingStatusToData,
  execCoachingStatusToFormValues,
  mentorshipStatusToData,
  mentorshipStatusToFormValues,
} from "./utils";

export const EmployeeProfileCareerDevelopmentOptions_Fragment = graphql(
  /* GraphQL */ `
    fragment EmployeeProfileCareerDevelopmentOptions on Query {
      organizationTypeInterest: localizedEnumStrings(
        enumName: "OrganizationTypeInterest"
      ) {
        value
        label {
          en
          fr
          localized
        }
      }
      moveInterest: localizedEnumStrings(enumName: "MoveInterest") {
        value
        label {
          en
          fr
          localized
        }
      }
      mentorship: localizedEnumStrings(enumName: "Mentorship") {
        value
        label {
          en
          fr
          localized
        }
      }
      execCoaching: localizedEnumStrings(enumName: "ExecCoaching") {
        value
        label {
          en
          fr
          localized
        }
      }
    }
  `,
);

const EmployeeProfileCareerDevelopment_Fragment = graphql(/* GraphQL */ `
  fragment EmployeeProfileCareerDevelopment on EmployeeProfile {
    organizationTypeInterest {
      value
      label {
        en
        fr
        localized
      }
    }
    moveInterest {
      value
      label {
        en
        fr
        localized
      }
    }
    mentorshipStatus {
      value
      label {
        en
        fr
        localized
      }
    }
    mentorshipInterest {
      value
      label {
        en
        fr
        localized
      }
    }
    execInterest
    execCoachingStatus {
      value
      label {
        en
        fr
        localized
      }
    }
    execCoachingInterest {
      value
      label {
        en
        fr
        localized
      }
    }
  }
`);

const UpdateEmployeeProfileCareerDevelopment_Mutation = graphql(/* GraphQL */ `
  mutation UpdateEmployeeProfileCareerDevelopment(
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

const dataToFormValues = ({
  organizationTypeInterest,
  moveInterest,
  mentorshipStatus,
  mentorshipInterest,
  execInterest,
  execCoachingStatus,
  execCoachingInterest,
}: EmployeeProfile): FormValues => ({
  organizationTypeInterest: organizationTypeInterest?.map((x) => x.value) ?? [],
  moveInterest: moveInterest?.map((x) => x.value) ?? [],
  mentorshipStatus: mentorshipStatusToFormValues(mentorshipStatus),
  mentorshipInterest: mentorshipInterest?.map((x) => x.value) ?? [],
  execInterest: boolToYesNo(execInterest),
  execCoachingStatus: execCoachingStatusToFormValues(execCoachingStatus),
  execCoachingInterest: execCoachingInterest?.map((x) => x.value) ?? [],
});

export type FormValues = Pick<
  UpdateEmployeeProfileInput,
  | "organizationTypeInterest"
  | "moveInterest"
  | "mentorshipInterest"
  | "execCoachingInterest"
> & {
  mentorshipStatus?: string | null;
  execInterest?: "yes" | "no";
  execCoachingStatus?: string | null;
};

interface CareerDevelopmentSectionProps {
  userId: string;
  employeeProfileQuery: FragmentType<
    typeof EmployeeProfileCareerDevelopment_Fragment
  >;
  careerDevelopmentOptionsQuery: FragmentType<
    typeof EmployeeProfileCareerDevelopmentOptions_Fragment
  >;
}

const CareerDevelopmentSection = ({
  userId,
  employeeProfileQuery,
  careerDevelopmentOptionsQuery,
}: CareerDevelopmentSectionProps) => {
  const intl = useIntl();
  const [{ fetching }, executeMutation] = useMutation(
    UpdateEmployeeProfileCareerDevelopment_Mutation,
  );

  const employeeProfile = getFragment(
    EmployeeProfileCareerDevelopment_Fragment,
    employeeProfileQuery,
  );

  const careerDevelopmentOptions = getFragment(
    EmployeeProfileCareerDevelopmentOptions_Fragment,
    careerDevelopmentOptionsQuery,
  );

  const labels = getLabels(intl);
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
        defaultMessage: "Failed updating career development preferences",
        id: "CKxLR/",
        description:
          "Message displayed when a user fails to update the employee profile information",
      }),
    );
  };

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(employeeProfile),
  });

  const handleSave: SubmitHandler<FormValues> = async ({
    organizationTypeInterest,
    moveInterest,
    mentorshipStatus,
    mentorshipInterest,
    execInterest,
    execCoachingStatus,
    execCoachingInterest,
  }: FormValues) => {
    return executeMutation({
      id: userId,
      employeeProfile: {
        organizationTypeInterest: organizationTypeInterest ?? [],
        moveInterest: moveInterest ?? [],
        mentorshipStatus: mentorshipStatusToData(mentorshipStatus),
        mentorshipInterest: mentorshipInterest ?? [],
        execInterest: execInterest === "yes",
        execCoachingStatus: execCoachingStatusToData(execCoachingStatus),
        execCoachingInterest: execCoachingInterest ?? [],
      },
    })
      .then((result) => {
        if (result.data?.updateEmployeeProfile) {
          toast.success(
            intl.formatMessage({
              defaultMessage:
                "Career development preferences updated successfully!",
              id: "ECAM6A",
              description:
                "Message displayed when a user successfully updates employee profile information",
            }),
          );
          setIsEditing(false);
          methods.reset({
            organizationTypeInterest,
            moveInterest,
            mentorshipStatus,
            mentorshipInterest,
            execInterest,
            execCoachingStatus,
            execCoachingInterest,
          });
        } else {
          handleError();
        }
      })
      .catch(handleError);
  };

  const subtitle = intl.formatMessage({
    defaultMessage:
      "This section of your profile allows you to express interest in a variety of specific options related to recruitment, mentorship, and promotional opportunities.",
    id: "Uj7TE2",
    description:
      "Describes the career development preferences of employee profile",
  });

  return (
    <ToggleSection.Root
      id="career-development-form"
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
              defaultMessage: "Career development preferences",
              id: "Ey8cB4",
              description: "Title for career development preferences section",
            })}
          />
        }
        data-h2-font-weight="base(bold)"
      >
        {intl.formatMessage({
          defaultMessage: "Career development preferences",
          id: "Ey8cB4",
          description: "Title for career development preferences section",
        })}
      </ToggleSection.Header>
      <p>{subtitle}</p>
      <ToggleSection.Content>
        <ToggleSection.InitialContent>
          {isNull ? (
            <ToggleForm.NullDisplay />
          ) : (
            <Display
              employeeProfile={employeeProfile}
              careerDevelopmentOptions={careerDevelopmentOptions}
            />
          )}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          <BasicForm
            labels={labels}
            onSubmit={handleSave}
            options={{
              defaultValues: dataToFormValues(employeeProfile),
            }}
          >
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-gap="base(x1)"
            >
              <Checklist
                idPrefix="organizationTypeInterest"
                legend={labels.organizationTypeInterest}
                name="organizationTypeInterest"
                id="organizationTypeInterest"
                items={unpackMaybes(
                  careerDevelopmentOptions?.organizationTypeInterest,
                ).map(({ value }) => ({
                  value,
                  label: intl.formatMessage(getOrganizationTypeInterest(value)),
                }))}
              />
              <Checklist
                idPrefix="moveInterest"
                legend={labels.moveInterest}
                name="moveInterest"
                id="moveInterest"
                items={unpackMaybes(careerDevelopmentOptions?.moveInterest).map(
                  ({ value }) => ({
                    value,
                    label: intl.formatMessage(getMoveInterest(value)),
                  }),
                )}
              />
              <Separator data-h2-margin="base(0)" decorative />
              <RadioGroup
                idPrefix="mentorshipStatus"
                name="mentorshipStatus"
                legend={labels.mentorshipStatus}
                items={[
                  { value: MentorshipStatus.NOT_PARTICIPATING },
                  ...unpackMaybes(careerDevelopmentOptions?.mentorship),
                  { value: MentorshipStatus.MENTEE_AND_MENTOR },
                ].map(({ value }) => ({
                  value,
                  label: intl.formatMessage(getMentorshipStatus(value)),
                }))}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
              <Checklist
                idPrefix="mentorshipInterest"
                name="mentorshipInterest"
                legend={labels.mentorshipInterest}
                items={unpackMaybes(careerDevelopmentOptions?.mentorship).map(
                  ({ value }) => ({
                    value,
                    label: intl.formatMessage(getMentorshipInterest(value)),
                  }),
                )}
              />
              <RadioGroup
                idPrefix="execInterest"
                name="execInterest"
                legend={labels.execInterest}
                items={[
                  {
                    value: "no",
                    label: intl.formatMessage({
                      defaultMessage:
                        "I'm not interested in executive level opportunities.",
                      id: "0xmhEq",
                      description:
                        "The executive interest described as not interested.",
                    }),
                  },
                  {
                    value: "yes",
                    label: intl.formatMessage({
                      defaultMessage:
                        "I'd like to be considered for executive level opportunities.",
                      id: "PffQVS",
                      description:
                        "The executive interest described as interested.",
                    }),
                  },
                ]}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                context={labels.execInterestContext}
              />
              <RadioGroup
                idPrefix="execCoachingStatus"
                name="execCoachingStatus"
                legend={labels.execCoachingStatus}
                items={[
                  { value: ExecCoachingStatus.NOT_PARTICIPATING },
                  ...unpackMaybes(careerDevelopmentOptions?.execCoaching),
                  { value: ExecCoachingStatus.LEARNING_AND_COACHING },
                ].map(({ value }) => ({
                  value,
                  label: intl.formatMessage(getExecCoachingStatus(value)),
                }))}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
              />
              <Checklist
                idPrefix="execCoachingInterest"
                name="execCoachingInterest"
                legend={labels.execCoachingInterest}
                items={unpackMaybes(careerDevelopmentOptions?.execCoaching).map(
                  ({ value }) => ({
                    value,
                    label: intl.formatMessage(getExecCoachingInterest(value)),
                  }),
                )}
                context={labels.execCoachingInterestContext}
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
                    defaultMessage: "Save career development preferences",
                    id: "rBtIUo",
                    description:
                      "Text on a button to save career development preferences form",
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
          </BasicForm>
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default CareerDevelopmentSection;
