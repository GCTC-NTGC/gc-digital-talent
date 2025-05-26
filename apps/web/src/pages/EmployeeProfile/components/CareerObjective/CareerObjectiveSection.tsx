import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import QuestionMarkCircleIcon from "@heroicons/react/24/outline/QuestionMarkCircleIcon";
import { useMutation } from "urql";
import { ComponentProps, useEffect, useId } from "react";

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
  TargetRole,
  CSuiteRoleTitle,
} from "@gc-digital-talent/graphql";
import { useAuthorization } from "@gc-digital-talent/auth";
import {
  nodeToString,
  sortAlphaBy,
  UnauthorizedError,
  unpackMaybes,
} from "@gc-digital-talent/helpers";
import { toast } from "@gc-digital-talent/toast";
import {
  alphaSortOptions,
  Checkbox,
  Checklist,
  Combobox,
  Input,
  localizedEnumToOptions,
  RadioGroup,
  Select,
  Submit,
  TextArea,
} from "@gc-digital-talent/forms";

import { hasAllEmptyFields } from "~/validators/employeeProfile/careerObjective";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import ToggleForm from "~/components/ToggleForm/ToggleForm";
import employeeProfileMessages from "~/messages/employeeProfileMessages";
import {
  getGroupOptions,
  getLevelOptions,
} from "~/components/Profile/components/GovernmentInformation/utils";
import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";

import Display from "./Display";
import messages from "../../messages";

const EmployeeProfileCareerObjectiveOptions_Fragment = graphql(/* GraphQL */ `
  fragment EmployeeProfileCareerObjectiveOptions on Query {
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
    cSuiteRoleTitles: localizedEnumStrings(enumName: "CSuiteRoleTitle") {
      value
      label {
        localized
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

export const EmployeeProfileCareerObjective_Fragment = graphql(/* GraphQL */ `
  fragment EmployeeProfileCareerObjective on EmployeeProfile {
    careerObjectiveClassification {
      id
      group
      level
    }
    careerObjectiveTargetRole {
      value
      label {
        localized
      }
    }
    careerObjectiveTargetRoleOther
    careerObjectiveJobTitle
    careerObjectiveCommunity {
      id
      key
      name {
        localized
      }
      workStreams {
        id
      }
    }
    careerObjectiveCommunityOther
    careerObjectiveWorkStreams {
      id
      name {
        localized
      }
    }
    careerObjectiveDepartments {
      id
      departmentNumber
      name {
        localized
      }
    }
    careerObjectiveAdditionalInformation
    careerObjectiveIsCSuiteRole
    careerObjectiveCSuiteRoleTitle {
      value
      label {
        localized
      }
    }
  }
`);

const UpdateEmployeeProfile_Mutation = graphql(/* GraphQL */ `
  mutation UpdateEmployeeProfileCareerObjective(
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
  classificationGroup: string | null | undefined;
  classificationLevel: string | null | undefined;
  targetRole: string | null | undefined;
  targetRoleOther: string | null | undefined;
  jobTitle: string | null | undefined;
  communityId: string | null | undefined;
  communityOther: string | null | undefined;
  workStreamIds: string[] | null | undefined;
  departmentIds: string[] | null | undefined;
  additionalInformation: string | null | undefined;
  isCSuiteRole: boolean;
  cSuiteRoleTitle: string | null | undefined;
}

interface CareerObjectiveSectionProps {
  employeeProfileQuery: FragmentType<
    typeof EmployeeProfileCareerObjective_Fragment
  >;
  optionsQuery: FragmentType<
    typeof EmployeeProfileCareerObjectiveOptions_Fragment
  >;
}

const TEXT_AREA_MAX_WORDS_EN = 300;

const wordCountLimits: Record<Locales, number> = {
  en: TEXT_AREA_MAX_WORDS_EN,
  fr: Math.round(TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD),
} as const;

const OTHER_SELECTION_VALUE = "OTHER";

const CareerObjectiveSection = ({
  employeeProfileQuery,
  optionsQuery,
}: CareerObjectiveSectionProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const { userAuthInfo } = useAuthorization();
  const classificationDescriptionId = useId();
  const [{ fetching }, executeMutation] = useMutation(
    UpdateEmployeeProfile_Mutation,
  );

  const employeeProfile = getFragment(
    EmployeeProfileCareerObjective_Fragment,
    employeeProfileQuery,
  );
  const options = getFragment(
    EmployeeProfileCareerObjectiveOptions_Fragment,
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
        defaultMessage: "Failed updating career objective information",
        id: "vKzPT0",
        description:
          "Message displayed when a user fails to updates employee profile information",
      }),
    );
  };

  const dataToFormValues = (
    initialData: typeof employeeProfile,
  ): FormValues => {
    // community and communityOther have a bespoke touch
    const isCommunityOther =
      !initialData.careerObjectiveCommunity?.id &&
      !!initialData.careerObjectiveCommunityOther;

    return {
      classificationGroup: initialData.careerObjectiveClassification?.group,
      classificationLevel:
        initialData.careerObjectiveClassification?.level.toString(),
      targetRole: initialData.careerObjectiveTargetRole?.value,
      targetRoleOther: initialData.careerObjectiveTargetRoleOther,
      jobTitle: initialData.careerObjectiveJobTitle,
      communityId: isCommunityOther
        ? OTHER_SELECTION_VALUE
        : initialData.careerObjectiveCommunity?.id,
      communityOther: initialData.careerObjectiveCommunityOther,
      workStreamIds: initialData.careerObjectiveWorkStreams?.map(
        (workStream) => workStream.id,
      ),
      departmentIds: initialData.careerObjectiveDepartments?.map(
        (department) => department.id,
      ),
      additionalInformation: initialData.careerObjectiveAdditionalInformation,
      isCSuiteRole: !!initialData.careerObjectiveIsCSuiteRole,
      cSuiteRoleTitle: initialData.careerObjectiveCSuiteRoleTitle?.value,
    };
  };

  const methods = useForm<FormValues>({
    defaultValues: dataToFormValues(employeeProfile),
  });

  // hooks to watch, needed for conditional rendering
  const [
    watchClassificationGroup,
    watchCommunityId,
    watchTargetRole,
    watchIsCSuiteRole,
  ] = methods.watch([
    "classificationGroup",
    "communityId",
    "targetRole",
    "isCSuiteRole",
  ]);

  /**
   * Reset fields in response to changes
   */
  useEffect(() => {
    // clear "other" field if role is not other
    if (watchTargetRole !== TargetRole.Other) {
      methods.resetField("targetRoleOther", {
        keepDirty: false,
        defaultValue: null,
      });
    }
    // method to reset work streams if community changes
    if (watchCommunityId !== employeeProfile.careerObjectiveCommunity?.id) {
      methods.resetField("workStreamIds", {
        keepDirty: false,
        defaultValue: [],
      });
    }
    // reset communityOther when switching communities
    if (watchCommunityId !== OTHER_SELECTION_VALUE) {
      methods.resetField("communityOther", {
        keepDirty: false,
        defaultValue: null,
      });
    }
    // reset cSuiteRoleTitle when toggling watchIsCSuiteRole
    if (watchIsCSuiteRole !== true) {
      methods.resetField("cSuiteRoleTitle", {
        keepDirty: false,
        defaultValue: null,
      });
    }
  }, [
    watchTargetRole,
    methods,
    watchCommunityId,
    employeeProfile.careerObjectiveCommunity?.id,
    watchIsCSuiteRole,
  ]);

  const { handleSubmit } = methods;

  const handleSave = async ({
    classificationGroup,
    classificationLevel,
    targetRole,
    targetRoleOther,
    jobTitle,
    communityId,
    communityOther,
    workStreamIds,
    departmentIds,
    additionalInformation,
    isCSuiteRole,
    cSuiteRoleTitle,
  }: FormValues) => {
    // should not be possible
    if (!userAuthInfo?.id) {
      throw new UnauthorizedError();
    }

    const selectedClassification = unpackMaybes(options.classifications).find(
      (classification) =>
        classification.group === classificationGroup &&
        classification.level.toString() === classificationLevel,
    );

    // community and communityOther have bespoke handling
    return executeMutation({
      id: userAuthInfo.id,
      employeeProfile: {
        careerObjectiveClassification: selectedClassification?.id
          ? {
              connect: selectedClassification.id,
            }
          : {
              disconnect: true,
            },
        careerObjectiveTargetRole: targetRole as TargetRole,
        careerObjectiveTargetRoleOther: targetRoleOther,
        careerObjectiveJobTitle: jobTitle,
        careerObjectiveCommunity:
          communityId && communityId !== OTHER_SELECTION_VALUE
            ? {
                connect: communityId,
              }
            : {
                disconnect: true,
              },
        careerObjectiveCommunityOther: communityOther,
        careerObjectiveWorkStreams: {
          sync: communityId === OTHER_SELECTION_VALUE ? [] : workStreamIds,
        },
        careerObjectiveDepartments: {
          sync: departmentIds,
        },
        careerObjectiveAdditionalInformation: additionalInformation,
        careerObjectiveIsCSuiteRole: isCSuiteRole,
        careerObjectiveCSuiteRoleTitle: cSuiteRoleTitle as CSuiteRoleTitle,
      },
    })
      .then((result) => {
        if (result.data?.updateEmployeeProfile) {
          toast.success(
            intl.formatMessage({
              defaultMessage:
                "Career objective information updated successfully!",
              id: "bju7JB",
              description:
                "Message displayed when a user successfully updates employee profile information",
            }),
          );
          setIsEditing(false);
          methods.reset(
            {
              classificationGroup,
              classificationLevel,
              targetRole,
              targetRoleOther,
              jobTitle,
              communityId,
              communityOther,
              workStreamIds,
              departmentIds,
              additionalInformation,
              isCSuiteRole,
              cSuiteRoleTitle,
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
      "Describe your ultimate career objective. Your input can help staff working on talent management identify the right next step for you, whether it's a lateral move, a development opportunity, or an advancement.",
    id: "FYCNAa",
    description: "Describes the career objective section of employee profile",
  });

  const groupOptions = getGroupOptions(
    unpackMaybes(options.classifications),
    intl,
  );
  const levelOptions = getLevelOptions(
    unpackMaybes(options.classifications),
    watchClassificationGroup ?? undefined,
  ).sort((a, b) => a.value - b.value);

  // append the special OTHER selection to the end of fetched communities
  let communityOptions: ComponentProps<typeof Select>["options"] = unpackMaybes(
    options.communities,
  ).map((community) => ({
    value: community.id,
    label:
      community.name?.localized ??
      intl.formatMessage(commonMessages.notProvided),
  }));
  communityOptions = alphaSortOptions(communityOptions);
  communityOptions = [
    ...communityOptions,
    {
      value: OTHER_SELECTION_VALUE,
      label: intl.formatMessage(messages.otherCommunity),
    },
  ];

  const workStreamOptions: ComponentProps<typeof Checklist>["items"] =
    options.communities
      .find((community) => community?.id === watchCommunityId)
      ?.workStreams?.map((workStream) => ({
        value: workStream.id,
        label:
          workStream.name?.localized ??
          intl.formatMessage(commonMessages.notProvided),
      })) ?? [];
  workStreamOptions.sort(sortAlphaBy((ws) => nodeToString(ws.label)));
  const departmentOptions: ComponentProps<typeof Combobox>["options"] =
    unpackMaybes(options.departments)?.map((department) => ({
      value: department.id,
      label:
        department.name?.localized ??
        intl.formatMessage(commonMessages.notProvided),
    })) ?? [];
  departmentOptions.sort(
    sortAlphaBy((department) => nodeToString(department.label)),
  );
  const cSuiteRoleTitleOptions: ComponentProps<typeof Select>["options"] =
    unpackMaybes(options.cSuiteRoleTitles).map((cSuiteRoleTitle) => ({
      value: cSuiteRoleTitle.value,
      label:
        cSuiteRoleTitle?.label?.localized ??
        intl.formatMessage(commonMessages.notProvided),
    }));

  return (
    <ToggleSection.Root
      id="career-objective-form"
      open={isEditing}
      onOpenChange={setIsEditing}
    >
      <ToggleSection.Header
        icon={icon.icon}
        color={icon.color}
        level="h3"
        size="h4"
        toggle={
          <ToggleForm.LabelledTrigger
            sectionTitle={intl.formatMessage({
              defaultMessage: "Your career objective",
              id: "vvnsjr",
              description: "Title for the career objective section",
            })}
          />
        }
        data-h2-font-weight="base(bold)"
      >
        {intl.formatMessage({
          defaultMessage: "Your career objective",
          id: "vvnsjr",
          description: "Title for the career objective section",
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
                {/* Classification subsection */}
                <div
                  data-h2-display="base(flex)"
                  data-h2-flex-direction="base(column)"
                  data-h2-gap="base(x.5)"
                >
                  <p id={classificationDescriptionId}>
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
                        label={intl.formatMessage(commonMessages.group)}
                        name="classificationGroup"
                        nullSelection={intl.formatMessage(
                          uiMessages.nullSelectionOptionGroup,
                        )}
                        options={groupOptions}
                        disabled={fetching}
                        aria-describedby={classificationDescriptionId}
                      />
                    </div>
                    {watchClassificationGroup ? (
                      <div style={{ width: "100%" }}>
                        <Select
                          id="classificationLevel"
                          label={intl.formatMessage(commonMessages.level)}
                          name="classificationLevel"
                          nullSelection={intl.formatMessage(
                            uiMessages.nullSelectionOptionLevel,
                          )}
                          options={levelOptions}
                          doNotSort
                          disabled={fetching}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
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
                    TargetRole.SeniorDirector,
                    TargetRole.ExecutiveDirector,
                    TargetRole.DirectorGeneral,
                    TargetRole.AssistantDeputyMinister,
                    TargetRole.DeputyMinister,
                    TargetRole.Other,
                  ])}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  disabled={fetching}
                />
                {watchTargetRole === TargetRole.Other ? (
                  <Input
                    id="targetRoleOther"
                    type="text"
                    label={intl.formatMessage(
                      employeeProfileMessages.targetRoleOther,
                    )}
                    name="targetRoleOther"
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                    disabled={fetching}
                  />
                ) : null}
                <Checkbox
                  boundingBox
                  boundingBoxLabel={intl.formatMessage(
                    employeeProfileMessages.seniorManagementStatus,
                  )}
                  id="isCSuiteRole"
                  label={intl.formatMessage(
                    employeeProfileMessages.isChiefDeputyCSuiteRole,
                  )}
                  name="isCSuiteRole"
                />
                {watchIsCSuiteRole && (
                  <Select
                    id="cSuiteRoleTitle"
                    name="cSuiteRoleTitle"
                    label={intl.formatMessage(
                      employeeProfileMessages.cSuiteRoleTitle,
                    )}
                    nullSelection={intl.formatMessage(
                      uiMessages.nullSelectionOption,
                    )}
                    options={cSuiteRoleTitleOptions}
                    doNotSort
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                    disabled={fetching}
                  />
                )}
                <Input
                  id="jobTitle"
                  type="text"
                  label={intl.formatMessage(employeeProfileMessages.jobTitle)}
                  name="jobTitle"
                  disabled={fetching}
                />
                <Select
                  id="communityId"
                  name="communityId"
                  label={intl.formatMessage(employeeProfileMessages.community)}
                  nullSelection={intl.formatMessage(
                    uiMessages.nullSelectionOption,
                  )}
                  options={communityOptions}
                  doNotSort
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                  disabled={fetching}
                />
                {watchCommunityId === OTHER_SELECTION_VALUE ? (
                  <Input
                    id="communityOther"
                    name="communityOther"
                    type="text"
                    label={intl.formatMessage(messages.otherCommunity)}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                    disabled={fetching}
                  />
                ) : null}
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
                        disabled={fetching}
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
                  id="departmentIds"
                  name="departmentIds"
                  isMulti
                  label={intl.formatMessage(
                    employeeProfileMessages.departments,
                  )}
                  options={departmentOptions}
                  disabled={fetching}
                />
                <TextArea
                  id="additionalInformation"
                  label={intl.formatMessage(
                    employeeProfileMessages.additionalInformationCareerObjective,
                  )}
                  name="additionalInformation"
                  wordLimit={wordCountLimits[locale]}
                  disabled={fetching}
                />
                <div
                  data-h2-display="base(flex)"
                  data-h2-gap="base(x1)"
                  data-h2-align-items="base(center)"
                  data-h2-flex-wrap="base(wrap)"
                >
                  <Submit
                    text={intl.formatMessage(formMessages.saveChanges)}
                    aria-label={intl.formatMessage({
                      defaultMessage: "Save your career objective",
                      id: "v+AFQT",
                      description:
                        "Text on a button to your career objective form",
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

export default CareerObjectiveSection;
