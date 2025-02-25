import { useIntl } from "react-intl";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";
import { useMutation } from "urql";
import { useEffect } from "react";

import { Button, Separator, ToggleSection } from "@gc-digital-talent/ui";
import {
  Checklist,
  localizedEnumToOptions,
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
  MentorshipStatus,
} from "@gc-digital-talent/i18n";
import {
  graphql,
  FragmentType,
  getFragment,
  EmployeeProfile,
  UpdateEmployeeProfileInput,
  TimeFrame,
  OrganizationTypeInterest,
} from "@gc-digital-talent/graphql";
import {
  boolToYesNo,
  UnauthorizedError,
  unpackMaybes,
} from "@gc-digital-talent/helpers";
import { toast } from "@gc-digital-talent/toast";
import { useAuthorization } from "@gc-digital-talent/auth";

import {
  hasAllEmptyFields,
  hasEmptyRequiredFields,
} from "~/validators/employeeProfile/careerDevelopment";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";

import Display from "./Display";
import {
  getLabels,
  execCoachingStatusToData,
  execCoachingStatusToFormValues,
  mentorshipStatusToData,
  mentorshipStatusToFormValues,
  EmployeeProfileCareerDevelopment_Fragment,
  EmployeeProfileCareerDevelopmentOptions_Fragment,
} from "./utils";

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
  lateralMoveInterest,
  lateralMoveTimeFrame,
  lateralMoveOrganizationType,
  promotionMoveInterest,
  promotionMoveTimeFrame,
  promotionMoveOrganizationType,
  mentorshipStatus,
  mentorshipInterest,
  execInterest,
  execCoachingStatus,
  execCoachingInterest,
}: EmployeeProfile): FormValues => ({
  lateralMoveInterest: boolToYesNo(lateralMoveInterest),
  lateralMoveTimeFrame: lateralMoveTimeFrame?.value,
  lateralMoveOrganizationType:
    lateralMoveOrganizationType?.map((x) => x.value) ?? [],
  promotionMoveInterest: boolToYesNo(promotionMoveInterest),
  promotionMoveTimeFrame: promotionMoveTimeFrame?.value,
  promotionMoveOrganizationType:
    promotionMoveOrganizationType?.map((x) => x.value) ?? [],
  mentorshipStatus: mentorshipStatusToFormValues(mentorshipStatus),
  mentorshipInterest: mentorshipInterest?.map((x) => x.value) ?? [],
  execInterest: boolToYesNo(execInterest),
  execCoachingStatus: execCoachingStatusToFormValues(execCoachingStatus),
  execCoachingInterest: execCoachingInterest?.map((x) => x.value) ?? [],
});

export type FormValues = Pick<
  UpdateEmployeeProfileInput,
  "mentorshipInterest" | "execCoachingInterest"
> & {
  lateralMoveInterest?: "yes" | "no";
  lateralMoveTimeFrame?: TimeFrame | null;
  lateralMoveOrganizationType?: OrganizationTypeInterest[] | null;
  promotionMoveInterest?: "yes" | "no";
  promotionMoveTimeFrame?: TimeFrame | null;
  promotionMoveOrganizationType?: OrganizationTypeInterest[] | null;
  mentorshipStatus?: string | null;
  execInterest?: "yes" | "no";
  execCoachingStatus?: string | null;
};

interface CareerDevelopmentSectionProps {
  employeeProfileQuery: FragmentType<
    typeof EmployeeProfileCareerDevelopment_Fragment
  >;
  careerDevelopmentOptionsQuery: FragmentType<
    typeof EmployeeProfileCareerDevelopmentOptions_Fragment
  >;
}

const CareerDevelopmentSection = ({
  employeeProfileQuery,
  careerDevelopmentOptionsQuery,
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

  const careerDevelopmentOptions = getFragment(
    EmployeeProfileCareerDevelopmentOptions_Fragment,
    careerDevelopmentOptionsQuery,
  );

  const labels = getLabels(intl);
  const isNull = hasAllEmptyFields(employeeProfile);
  const { isEditing, setIsEditing, icon } = useToggleSectionInfo({
    isNull,
    emptyRequired: hasEmptyRequiredFields(employeeProfile),
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
  const { watch, resetField, handleSubmit } = methods;

  const watchLateralMoveInterest = watch("lateralMoveInterest");
  const watchPromotionMoveInterest = watch("promotionMoveInterest");

  useEffect(() => {
    const resetDirtyField = (name: keyof FormValues) => {
      resetField(name, {
        keepDirty: false,
        defaultValue: null,
      });
    };

    if (watchLateralMoveInterest === "no") {
      resetDirtyField("lateralMoveTimeFrame");
      resetDirtyField("lateralMoveOrganizationType");
    }

    if (watchPromotionMoveInterest === "no") {
      resetDirtyField("promotionMoveTimeFrame");
      resetDirtyField("promotionMoveOrganizationType");
    }
  }, [resetField, watchLateralMoveInterest, watchPromotionMoveInterest]);

  const handleSave: SubmitHandler<FormValues> = async ({
    lateralMoveInterest,
    lateralMoveTimeFrame,
    lateralMoveOrganizationType,
    promotionMoveInterest,
    promotionMoveTimeFrame,
    promotionMoveOrganizationType,
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
      id: userAuthInfo.id,
      employeeProfile: {
        lateralMoveInterest: lateralMoveInterest === "yes",
        lateralMoveTimeFrame,
        lateralMoveOrganizationType: lateralMoveOrganizationType ?? null,
        promotionMoveInterest: promotionMoveInterest === "yes",
        promotionMoveTimeFrame,
        promotionMoveOrganizationType: promotionMoveOrganizationType ?? null,
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
            lateralMoveInterest,
            lateralMoveTimeFrame,
            lateralMoveOrganizationType,
            promotionMoveInterest,
            promotionMoveTimeFrame,
            promotionMoveOrganizationType,
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
              employeeProfileQuery={employeeProfileQuery}
              careerDevelopmentOptionsQuery={careerDevelopmentOptionsQuery}
            />
          )}
        </ToggleSection.InitialContent>
        <ToggleSection.OpenContent>
          {/* TODO: Add useForm prop to BasicForm to allow watch control in parent component */}
          {/* <BasicForm
            labels={labels}
            onSubmit={handleSave}
            options={{
              defaultValues: dataToFormValues(employeeProfile),
            }}
          > */}
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleSave)}>
              <div
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-gap="base(x1)"
              >
                <RadioGroup
                  idPrefix="lateralMoveInterest"
                  legend={labels.lateralMoveInterest}
                  name="lateralMoveInterest"
                  id="lateralMoveInterest"
                  items={[
                    {
                      value: "no",
                      label: intl.formatMessage({
                        defaultMessage:
                          "I’m not looking for lateral movement right now.",
                        id: "55IkTu",
                        description:
                          "The lateral move interest described as not interested.",
                      }),
                    },
                    {
                      value: "yes",
                      label: intl.formatMessage({
                        defaultMessage:
                          "I’m interested in receiving opportunities for jobs at, or equivalent to, my current group and level.",
                        id: "1TFJ+r",
                        description:
                          "The lateral move interest described as interested.",
                      }),
                    },
                  ]}
                />
                {watchLateralMoveInterest === "yes" && (
                  <>
                    <RadioGroup
                      idPrefix="lateralMoveTimeFrame"
                      name="lateralMoveTimeFrame"
                      legend={labels.lateralMoveTimeFrame}
                      items={localizedEnumToOptions(
                        careerDevelopmentOptions?.timeFrame,
                        intl,
                      )}
                      rules={{
                        required: intl.formatMessage(errorMessages.required),
                      }}
                    />
                    <Checklist
                      idPrefix="lateralMoveOrganizationType"
                      name="lateralMoveOrganizationType"
                      legend={labels.lateralMoveOrganizationType}
                      items={localizedEnumToOptions(
                        careerDevelopmentOptions?.organizationTypeInterest,
                        intl,
                      )}
                    />
                  </>
                )}
                <Separator data-h2-margin="base(0)" decorative />
                <RadioGroup
                  idPrefix="promotionMoveInterest"
                  legend={labels.promotionMoveInterest}
                  name="promotionMoveInterest"
                  id="promotionMoveInterest"
                  items={[
                    {
                      value: "no",
                      label: intl.formatMessage({
                        defaultMessage:
                          "I’m not looking for a promotion or advancement right now.",
                        id: "tXLRmG",
                        description:
                          "The promotion move interest described as not interested.",
                      }),
                    },
                    {
                      value: "yes",
                      label: intl.formatMessage({
                        defaultMessage:
                          "I’m interested in receiving opportunities for promotion and advancement.",
                        id: "2tAqF/",
                        description:
                          "The promotion move interest described as interested.",
                      }),
                    },
                  ]}
                />
                {watchPromotionMoveInterest === "yes" && (
                  <>
                    <RadioGroup
                      idPrefix="promotionMoveTimeFrame"
                      name="promotionMoveTimeFrame"
                      legend={labels.promotionMoveTimeFrame}
                      items={localizedEnumToOptions(
                        careerDevelopmentOptions?.timeFrame,
                        intl,
                      )}
                      rules={{
                        required: intl.formatMessage(errorMessages.required),
                      }}
                    />
                    <Checklist
                      idPrefix="promotionMoveOrganizationType"
                      name="promotionMoveOrganizationType"
                      legend={labels.promotionMoveOrganizationType}
                      items={localizedEnumToOptions(
                        careerDevelopmentOptions?.organizationTypeInterest,
                        intl,
                      )}
                    />
                  </>
                )}
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
                          "I'm not interested in executive-level opportunities.",
                        id: "vFV5N8",
                        description:
                          "The executive interest described as not interested.",
                      }),
                    },
                    {
                      value: "yes",
                      label: intl.formatMessage({
                        defaultMessage:
                          "I'd like to be considered for executive-level opportunities.",
                        id: "WoZ3pB",
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
                  items={unpackMaybes(
                    careerDevelopmentOptions?.execCoaching,
                  ).map(({ value }) => ({
                    value,
                    label: intl.formatMessage(getExecCoachingInterest(value)),
                  }))}
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
              {/* </BasicForm> */}
            </form>
          </FormProvider>
        </ToggleSection.OpenContent>
      </ToggleSection.Content>
    </ToggleSection.Root>
  );
};

export default CareerDevelopmentSection;
