import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";
import { useMutation } from "urql";

import { Button, Separator, ToggleSection } from "@gc-digital-talent/ui";
import {
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
  ExecInterest,
  formMessages,
  getExecCoachingInterest,
  getExecCoachingStatus,
  getExecInterest,
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
  EmployeeProfileCareerDevelopmentOptionsFragment,
} from "@gc-digital-talent/graphql";
import { useAuthorization } from "@gc-digital-talent/auth";
import { UnauthorizedError, unpackMaybes } from "@gc-digital-talent/helpers";
import { toast } from "@gc-digital-talent/toast";

import { hasAllEmptyFields } from "~/validators/employeeProfile/careerDevelopment";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
import employeeProfileMessages from "~/messages/employeeProfileMessages";

import Display from "./Display";
import {
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

export type FormValues = Pick<
  UpdateEmployeeProfileInput,
  | "organizationTypeInterest"
  | "moveInterest"
  | "mentorshipInterest"
  | "execCoachingInterest"
> & {
  mentorshipStatus?: string | null;
  execInterest?: string | null;
  execCoachingStatus?: string | null;
};

interface CareerDevelopmentSectionProps {
  employeeProfileQuery: FragmentType<
    typeof EmployeeProfileCareerDevelopment_Fragment
  >;
  careerDevelopmentOptions: EmployeeProfileCareerDevelopmentOptionsFragment;
}

const CareerDevelopmentSection = ({
  employeeProfileQuery,
  careerDevelopmentOptions,
}: CareerDevelopmentSectionProps) => {
  const intl = useIntl();
  const { userAuthInfo } = useAuthorization();
  const [{ fetching }, executeMutation] = useMutation(
    UpdateEmployeeProfileCareerDevelopment_Mutation,
  );

  const employeeProfile = getFragment(
    EmployeeProfileCareerDevelopment_Fragment,
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
        defaultMessage: "Failed updating career development preferences",
        id: "CKxLR/",
        description:
          "Message displayed when a user fails to update the employee profile information",
      }),
    );
  };

  const dataToFormValues = (initialData: EmployeeProfile): FormValues => ({
    organizationTypeInterest:
      initialData.organizationTypeInterest?.map((x) => x.value) ?? [],
    moveInterest: initialData.moveInterest?.map((x) => x.value) ?? [],
    mentorshipStatus: mentorshipStatusToFormValues(
      initialData.mentorshipStatus,
    ),
    mentorshipInterest:
      initialData.mentorshipInterest?.map((x) => x.value) ?? [],
    execInterest: initialData.execInterest
      ? ExecInterest.INTERESTED
      : ExecInterest.NOT_INTERESTED,
    execCoachingStatus: execCoachingStatusToFormValues(
      initialData.execCoachingStatus,
    ),
    execCoachingInterest:
      initialData.execCoachingInterest?.map((x) => x.value) ?? [],
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(employeeProfile),
  });
  const { handleSubmit } = methods;

  const handleSave = async ({
    organizationTypeInterest,
    moveInterest,
    mentorshipStatus,
    mentorshipInterest,
    execInterest,
    execCoachingStatus,
    execCoachingInterest,
  }: FormValues) => {
    if (!userAuthInfo?.id) {
      throw new UnauthorizedError();
    }

    return executeMutation({
      id: userAuthInfo?.id,
      employeeProfile: {
        organizationTypeInterest,
        moveInterest,
        mentorshipStatus: mentorshipStatusToData(mentorshipStatus),
        mentorshipInterest,
        execInterest: execInterest === ExecInterest.INTERESTED,
        execCoachingStatus: execCoachingStatusToData(execCoachingStatus),
        execCoachingInterest,
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
          methods.reset(
            {
              organizationTypeInterest,
              moveInterest,
              mentorshipStatus,
              mentorshipInterest,
              execInterest,
              execCoachingStatus,
              execCoachingInterest,
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
      "This section of your profile allows you to express interest in a variety of specific options related to recruitment, mentorship, and promotional opportunities.",
    id: "Uj7TE2",
    description:
      "Describes the career development preferences of employee profile",
  });

  const organizationTypeInterestOptions: CheckboxOption[] = unpackMaybes(
    careerDevelopmentOptions?.organizationTypeInterest,
  ).map(({ value }) => ({
    value,
    label: intl.formatMessage(getOrganizationTypeInterest(value)),
  }));

  const moveInterestOptions: CheckboxOption[] = unpackMaybes(
    careerDevelopmentOptions?.moveInterest,
  ).map(({ value }) => ({
    value,
    label: intl.formatMessage(getMoveInterest(value)),
  }));

  const mentorshipStatusOptions: Radio[] = [
    { value: MentorshipStatus.NOT_PARTICIPATING },
    ...unpackMaybes(careerDevelopmentOptions?.mentorship),
    { value: MentorshipStatus.MENTEE_AND_MENTOR },
  ].map(({ value }) => ({
    value,
    label: intl.formatMessage(getMentorshipStatus(value)),
  }));

  const mentorshipInterestOptions: Radio[] = unpackMaybes(
    careerDevelopmentOptions?.mentorship,
  ).map(({ value }) => ({
    value,
    label: intl.formatMessage(getMentorshipInterest(value)),
  }));

  const execCoachingStatusOptions: Radio[] = [
    { value: ExecCoachingStatus.NOT_PARTICIPATING },
    ...unpackMaybes(careerDevelopmentOptions?.execCoaching),
    { value: ExecCoachingStatus.LEARNING_AND_COACHING },
  ].map(({ value }) => ({
    value,
    label: intl.formatMessage(getExecCoachingStatus(value)),
  }));

  const execCoachingInterestOptions: Radio[] = unpackMaybes(
    careerDevelopmentOptions?.execCoaching,
  ).map(({ value }) => ({
    value,
    label: intl.formatMessage(getExecCoachingInterest(value)),
  }));

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
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              <div
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-gap="base(x1)"
              >
                <Checklist
                  idPrefix="organizationTypeInterest"
                  legend={intl.formatMessage(
                    employeeProfileMessages.organizationTypeInterest,
                  )}
                  name="organizationTypeInterest"
                  id="organizationTypeInterest"
                  items={organizationTypeInterestOptions}
                />
                <Checklist
                  idPrefix="moveInterest"
                  legend={intl.formatMessage(
                    employeeProfileMessages.moveInterest,
                  )}
                  name="moveInterest"
                  id="moveInterest"
                  items={moveInterestOptions}
                />
                <Separator data-h2-margin="base(0)" />
                <RadioGroup
                  idPrefix="mentorshipStatus"
                  name="mentorshipStatus"
                  legend={intl.formatMessage(
                    employeeProfileMessages.mentorshipStatus,
                  )}
                  items={mentorshipStatusOptions}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
                <Checklist
                  idPrefix="mentorshipInterest"
                  name="mentorshipInterest"
                  legend={intl.formatMessage(
                    employeeProfileMessages.mentorshipInterest,
                  )}
                  items={mentorshipInterestOptions}
                />
                <RadioGroup
                  idPrefix="execInterest"
                  name="execInterest"
                  legend={intl.formatMessage(
                    employeeProfileMessages.execInterest,
                  )}
                  items={[
                    ExecInterest.NOT_INTERESTED,
                    ExecInterest.INTERESTED,
                  ].map((value) => ({
                    value,
                    label: intl.formatMessage(getExecInterest(value)),
                  }))}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  context={intl.formatMessage(
                    employeeProfileMessages.execInterestContext,
                  )}
                />
                <RadioGroup
                  idPrefix="execCoachingStatus"
                  name="execCoachingStatus"
                  legend={intl.formatMessage(
                    employeeProfileMessages.execCoachingStatus,
                  )}
                  items={execCoachingStatusOptions}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
                <Checklist
                  idPrefix="execCoachingInterest"
                  name="execCoachingInterest"
                  legend={intl.formatMessage(
                    employeeProfileMessages.execCoachingInterest,
                  )}
                  items={execCoachingInterestOptions}
                  context={intl.formatMessage(
                    employeeProfileMessages.execCoachingInterestContext,
                  )}
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
            </form>
          </FormProvider>
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default CareerDevelopmentSection;
