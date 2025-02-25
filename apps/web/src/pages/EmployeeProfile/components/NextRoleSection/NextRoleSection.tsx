import { useIntl } from "react-intl";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";
import { useMutation } from "urql";
import { ComponentProps } from "react";

import { Button, ToggleSection, Well } from "@gc-digital-talent/ui";
import {
  commonMessages,
  errorMessages,
  formMessages,
  getLocale,
  Locales,
  uiMessages,
} from "@gc-digital-talent/i18n";
import {
  graphql,
  FragmentType,
  getFragment,
  EmployeeProfile,
  TargetRole,
} from "@gc-digital-talent/graphql";
import { useAuthorization } from "@gc-digital-talent/auth";
import {
  notEmpty,
  UnauthorizedError,
  unpackMaybes,
} from "@gc-digital-talent/helpers";
import { toast } from "@gc-digital-talent/toast";
import {
  Checklist,
  Combobox,
  Input,
  localizedEnumToOptions,
  RadioGroup,
  Select,
  Submit,
  TextArea,
} from "@gc-digital-talent/forms";

import { hasAllEmptyFields } from "~/validators/employeeProfile/nextRole";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
import employeeProfileMessages from "~/messages/employeeProfileMessages";
import {
  getGroupOptions,
  getLevelOptions,
} from "~/components/Profile/components/GovernmentInformation/utils";
import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";

import Display from "./Display";

const EmployeeProfileNextRoleOptions_Fragment = graphql(/* GraphQL */ `
  fragment EmployeeProfileNextRoleOptions on Query {
    classifications {
      id
      group
      level
    }
    targetRoles: localizedEnumStrings(enumName: "TargetRole") {
      value
      label {
        en
        fr
      }
    }
    communities {
      id
      name {
        localized
      }
      workStreams {
        id
        name {
          localized
        }
      }
    }
    departments {
      id
      name {
        localized
      }
    }
  }
`);

const EmployeeProfileNextRole_Fragment = graphql(/* GraphQL */ `
  fragment EmployeeProfileNextRole on EmployeeProfile {
    nextRoleClassification {
      id
      group
      level
    }
    nextRoleTargetRole {
      value
      label {
        localized
      }
    }
    nextRoleJobTitle
    nextRoleCommunity {
      id
      key
      name {
        localized
      }
    }
    nextRoleWorkStreams {
      id
      name {
        localized
      }
    }
    nextRoleDepartments {
      id
      departmentNumber
      name {
        localized
      }
    }
    nextRoleAdditionalInformation
  }
`);

const UpdateEmployeeProfile_Mutation = graphql(/* GraphQL */ `
  mutation UpdateEmployeeProfileNextRole(
    $id: UUID!
    $employeeProfile: UpdateEmployeeProfileInput!
  ) {
    updateEmployeeProfile(id: $id, employeeProfile: $employeeProfile) {
      ...EmployeeProfileNextRole
    }
  }
`);

interface FormValues {
  classificationGroup: string | null | undefined;
  classificationLevel: string | null | undefined;
  targetRole: string | null | undefined;
  jobTitle: string | null | undefined;
  communityId: string | null | undefined;
  workStreamIds: string[] | null | undefined;
  departments: string[] | null | undefined;
  additionalInformation: string | null | undefined;
}

interface NextRoleSectionProps {
  employeeProfileQuery: FragmentType<typeof EmployeeProfileNextRole_Fragment>;
  optionsQuery: FragmentType<typeof EmployeeProfileNextRoleOptions_Fragment>;
}

const TEXT_AREA_MAX_WORDS_EN = 300;

const wordCountLimits: Record<Locales, number> = {
  en: TEXT_AREA_MAX_WORDS_EN,
  fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
} as const;

const NextRoleSection = ({
  employeeProfileQuery,
  optionsQuery,
}: NextRoleSectionProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const { userAuthInfo } = useAuthorization();
  const [{ fetching }, executeMutation] = useMutation(
    UpdateEmployeeProfile_Mutation,
  );

  const employeeProfile = getFragment(
    EmployeeProfileNextRole_Fragment,
    employeeProfileQuery,
  );
  const options = getFragment(
    EmployeeProfileNextRoleOptions_Fragment,
    optionsQuery,
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
        defaultMessage: "Failed updating next role information",
        id: "GndGRz",
        description:
          "Message displayed when a user fails to updates employee profile information",
      }),
    );
  };

  const dataToFormValues = (initialData: EmployeeProfile): FormValues => ({
    classificationGroup: initialData.nextRoleClassification?.group,
    classificationLevel: initialData.nextRoleClassification?.level.toString(),
    targetRole: initialData.nextRoleTargetRole?.value,
    jobTitle: initialData.nextRoleJobTitle,
    communityId: initialData.nextRoleCommunity?.id,
    workStreamIds: initialData.nextRoleWorkStreams?.map(
      (workStream) => workStream.id,
    ),
    departments: initialData.nextRoleDepartments?.map(
      (department) => department.id,
    ),
    additionalInformation: initialData.nextRoleAdditionalInformation,
  });

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(employeeProfile),
  });

  // hooks to watch, needed for conditional rendering
  const [watchClassificationGroup, watchCommunityId] = methods.watch([
    "classificationGroup",
    "communityId",
  ]);

  const { handleSubmit } = methods;

  const handleSave = async ({
    classificationGroup,
    classificationLevel,
    targetRole,
    jobTitle,
    community,
    workStreams,
    departments,
    additionalInformation,
  }: FormValues) => {
    if (!userAuthInfo?.id) {
      throw new UnauthorizedError();
    }

    // return executeMutation({
    //   id: userAuthInfo?.id,
    //   employeeProfile: {
    //     aboutYou,
    //     careerGoals,
    //     learningGoals,
    //     workStyle,
    //   },
    // })
    //   .then((result) => {
    //     if (result.data?.updateEmployeeProfile) {
    //       toast.success(
    //         intl.formatMessage({
    //           defaultMessage:
    //             "Goals and work style information updated successfully!",
    //           id: "voMSDe",
    //           description:
    //             "Message displayed when a user successfully updates employee profile information",
    //         }),
    //       );
    //       setIsEditing(false);
    //       methods.reset(
    //         {
    //           aboutYou,
    //           careerGoals,
    //           learningGoals,
    //           workStyle,
    //         },
    //         { keepDirty: true },
    //       );
    //     } else {
    //       handleError();
    //     }
    //   })
    //   .catch(handleError);
  };

  const subtitle = intl.formatMessage({
    defaultMessage:
      "Tell us about the next role you see yourself in. Sharing your preferences for your next job can help HR staff find the right position for you.",
    id: "IO+qSg",
    description: "Describes the next role section of employee profile",
  });

  const groupOptions = getGroupOptions(
    unpackMaybes(options.classifications),
    intl,
  );
  const levelOptions = getLevelOptions(
    unpackMaybes(options.classifications),
    watchClassificationGroup ?? undefined,
  ).sort((a, b) => a.value - b.value);
  const communityOptions: ComponentProps<typeof Select>["options"] =
    unpackMaybes(options.communities).map((community) => ({
      value: community.id,
      label:
        community.name?.localized ??
        intl.formatMessage(commonMessages.notProvided),
    }));
  const workStreamOptions: ComponentProps<typeof Checklist>["items"] =
    options.communities
      .find((community) => community?.id === watchCommunityId)
      ?.workStreams?.map((workStream) => ({
        value: workStream.id,
        label:
          workStream.name?.localized ??
          intl.formatMessage(commonMessages.notProvided),
      })) ?? [];
  workStreamOptions.sort((a, b) =>
    (a.label?.toString() ?? "").localeCompare(b.label?.toString() ?? ""),
  );
  const departmentOptions: ComponentProps<typeof Combobox>["options"] =
    unpackMaybes(options.departments)?.map((department) => ({
      value: department.id,
      label:
        department.name?.localized ??
        intl.formatMessage(commonMessages.notProvided),
    })) ?? [];
  departmentOptions.sort((a, b) =>
    (a.label?.toString() ?? "").localeCompare(b.label?.toString() ?? ""),
  );

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
              defaultMessage: "Your next role",
              id: "m6eIBH",
              description: "Title for the next role section",
            })}
          />
        }
        data-h2-font-weight="base(bold)"
      >
        {intl.formatMessage({
          defaultMessage: "Your next role",
          id: "m6eIBH",
          description: "Title for the next role section",
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
                <>
                  <p>
                    {intl.formatMessage(
                      employeeProfileMessages.targetClassification,
                    )}
                  </p>
                  <div
                    data-h2-display="base(flex)"
                    data-h2-flex-direction="base(column) p-tablet(row)"
                  >
                    <div
                      data-h2-padding="p-tablet(0, x2, 0, 0)"
                      data-h2-width="base(100%)"
                    >
                      <Select
                        id="classificationGroup"
                        label={intl.formatMessage({
                          defaultMessage: "Group",
                          id: "hgxH8y",
                          description:
                            "Label displayed for the classification form group field.",
                        })}
                        name="classificationGroup"
                        nullSelection={intl.formatMessage(
                          uiMessages.nullSelectionOptionGroup,
                        )}
                        rules={{
                          required: intl.formatMessage(errorMessages.required),
                        }}
                        options={groupOptions}
                      />
                    </div>
                    {notEmpty(watchClassificationGroup) && (
                      <div style={{ width: "100%" }}>
                        <Select
                          id="classificationLevel"
                          label={intl.formatMessage({
                            defaultMessage: "Level",
                            id: "yZqUAU",
                            description:
                              "Title displayed for the Classification table Level column.",
                          })}
                          name="classificationLevel"
                          rules={{
                            required: intl.formatMessage(
                              errorMessages.required,
                            ),
                          }}
                          nullSelection={intl.formatMessage(
                            uiMessages.nullSelectionOptionLevel,
                          )}
                          options={levelOptions}
                          doNotSort
                        />
                      </div>
                    )}
                  </div>
                </>
                <RadioGroup
                  idPrefix="targetRole"
                  name="targetRole"
                  legend={intl.formatMessage(
                    employeeProfileMessages.targetRole,
                  )}
                  items={localizedEnumToOptions(options?.targetRoles, intl, [
                    TargetRole.IndividualContributor,
                    TargetRole.Manager,
                    TargetRole.Director,
                    TargetRole.DirectorGeneral,
                    TargetRole.ExecutiveDirector,
                    TargetRole.AssistantDeputyMinister,
                    TargetRole.DeputyMinister,
                    TargetRole.Other,
                  ])}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
                <Input
                  id="jobTitle"
                  type="text"
                  label={intl.formatMessage(employeeProfileMessages.jobTitle)}
                  name="jobTitle"
                />
                <Select
                  id="communityId"
                  name="communityId"
                  label={intl.formatMessage(employeeProfileMessages.community)}
                  nullSelection={intl.formatMessage(
                    uiMessages.nullSelectionOption,
                  )}
                  options={communityOptions}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
                {watchCommunityId ? (
                  // Only show work streams if a community has been selected
                  <>
                    {workStreamOptions.length ? (
                      <Checklist
                        idPrefix="workStreamIds"
                        name="workStreamIds"
                        legend={intl.formatMessage(
                          employeeProfileMessages.workStreams,
                        )}
                        items={workStreamOptions}
                        rules={{
                          required: intl.formatMessage(errorMessages.required),
                        }}
                      />
                    ) : // no work streams
                    null}
                  </>
                ) : (
                  // no community selected
                  <Well data-h2-text-align="base(center)">
                    {intl.formatMessage({
                      defaultMessage:
                        "Please select a functional community to continue.",
                      id: "sZhjI3",
                      description:
                        "Message displayed when no functional community is selected",
                    })}
                  </Well>
                )}
                <Combobox
                  id="departments"
                  name="departments"
                  isMulti
                  label={intl.formatMessage(
                    employeeProfileMessages.departments,
                  )}
                  options={departmentOptions}
                />
                <TextArea
                  id="additionalInformation"
                  label={intl.formatMessage(
                    employeeProfileMessages.additionalInformationNextRole,
                  )}
                  name="additionalInformation"
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
                    aria-label={intl.formatMessage(formMessages.saveChanges)}
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

export default NextRoleSection;
