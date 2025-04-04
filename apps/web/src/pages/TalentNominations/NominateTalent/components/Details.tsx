import RectangleGroupIcon from "@heroicons/react/24/outline/RectangleGroupIcon";
import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";
import { useCallback, useEffect } from "react";

import {
  DevelopmentProgram,
  FragmentType,
  getFragment,
  graphql,
  Maybe,
  Scalars,
  TalentNominationLateralMovementOption,
  TalentNominationStep,
  TalentNominationUserReview,
  UpdateTalentNominationInput,
} from "@gc-digital-talent/graphql";
import {
  Checklist,
  Input,
  localizedEnumToOptions,
  RadioGroup,
  Select,
} from "@gc-digital-talent/forms";
import {
  commonMessages,
  errorMessages,
  getTalentNominationLateralMovementOption,
  uiMessages,
} from "@gc-digital-talent/i18n";
import { Heading, Well } from "@gc-digital-talent/ui";
import { unpackMaybes, workEmailDomainRegex } from "@gc-digital-talent/helpers";

import EmployeeSearchInput from "~/components/EmployeeSearchInput/EmployeeSearchInput";
import { fragmentToEmployee } from "~/components/EmployeeSearchInput/utils";
import ClassificationInput from "~/components/ClassificationInput/ClassificationInput";

import { BaseFormValues } from "../types";
import useCurrentStep from "../useCurrentStep";
import UpdateForm, { SubmitDataTransformer } from "./UpdateForm";
import SubHeading from "./SubHeading";
import messages from "../messages";
import EmployeeSearchWell from "./EmployeeSearchWell";
import labels from "../labels";

const DetailsFieldsOptions_Fragment = graphql(/* GraphQL */ `
  fragment DetailsFieldsOptions on Query {
    advancementReferenceReviewOptions: localizedEnumStrings(
      enumName: "TalentNominationUserReview"
    ) {
      value
      label {
        localized
      }
    }
    talentNominationLateralMovementOptions: localizedEnumStrings(
      enumName: "TalentNominationLateralMovementOption"
    ) {
      value
      label {
        localized
      }
    }
    classifications {
      ...ClassificationInput
    }
    departments {
      id
      name {
        localized
      }
    }
  }
`);

const DetailsEmployee_Fragment = graphql(/* GraphQL */ `
  fragment DetailsEmployee on BasicGovEmployeeProfile {
    ...EmployeeSearchResult
  }
`);

type NominationOption =
  | "advancement"
  | "lateralMovement"
  | "developmentProgram";

interface FormValues extends BaseFormValues {
  nominationOptions: Maybe<NominationOption>[];
  advancementReference: Maybe<Scalars["UUID"]["input"]>;
  advancementReferenceReview?: TalentNominationUserReview;
  advancementReferenceFallbackWorkEmail: Maybe<string>;
  advancementReferenceFallbackName: Maybe<string>;
  advancementReferenceFallbackClassification: Scalars["UUID"]["input"];
  advancementReferenceFallbackClassificationGroup: Maybe<string>;
  advancementReferenceFallbackClassificationLevel: Maybe<string>;
  advancementReferenceFallbackDepartment: Scalars["UUID"]["input"];
  lateralMovementOptions: Maybe<TalentNominationLateralMovementOption[]>;
  lateralMovementOptionsOther: Maybe<string>;
  developmentPrograms: Scalars["UUID"]["input"][];
  developmentProgramOptionsOther: Maybe<string>;
}

type DetailsFieldsOptionsFragmentType = FragmentType<
  typeof DetailsFieldsOptions_Fragment
>;

interface DetailsFieldsProps {
  developmentProgramOptions: DevelopmentProgram[];
  optionsQuery?: DetailsFieldsOptionsFragmentType;
  employeeQuery?: FragmentType<typeof DetailsEmployee_Fragment>;
}

const DetailsFields = ({
  optionsQuery,
  employeeQuery,
  developmentProgramOptions,
}: DetailsFieldsProps) => {
  const intl = useIntl();

  const options = getFragment(DetailsFieldsOptions_Fragment, optionsQuery);
  const advancementReferenceData = getFragment(
    DetailsEmployee_Fragment,
    employeeQuery,
  );

  const { watch, resetField: baseReset } = useFormContext<FormValues>();
  const [
    nominationOptions,
    advancementReference,
    lateralMovementOptions,
    developmentPrograms,
  ] = watch([
    "nominationOptions",
    "advancementReference",
    "lateralMovementOptions",
    "developmentPrograms",
  ]);

  const noOptionsSelected = nominationOptions?.length === 0;

  const advancement = nominationOptions.includes("advancement");
  const advancementReferenceUnset = typeof advancementReference === "undefined";
  const advancementReferenceNotFound = advancementReference === null;

  const lateralMovement = nominationOptions?.includes("lateralMovement");
  const lateralMovementOptionOther = lateralMovementOptions?.includes(
    TalentNominationLateralMovementOption.Other,
  );

  const developmentProgram = nominationOptions.includes("developmentProgram");
  const developmentProgramOptionOther = developmentPrograms.includes("other");

  const resetField = useCallback(
    (name: keyof FormValues) =>
      baseReset(name, { defaultValue: null, keepDirty: false }),
    [baseReset],
  );

  useEffect(() => {
    if (advancementReference) {
      resetField("advancementReferenceFallbackName");
      resetField("advancementReferenceFallbackWorkEmail");
      resetField("advancementReferenceFallbackDepartment");
      resetField("advancementReferenceFallbackClassification");
      resetField("advancementReferenceFallbackClassificationGroup");
      resetField("advancementReferenceFallbackClassificationLevel");
    } else {
      resetField("advancementReferenceReview");
    }
  }, [advancementReference, resetField]);
  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x1)"
    >
      <Checklist
        idPrefix="nominationOptions"
        name="nominationOptions"
        legend={intl.formatMessage({
          defaultMessage: "Nomination options",
          id: "khfdlt",
          description:
            "Label for the nomination options checklist on the details step",
        })}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        items={[
          {
            value: "advancement",
            label: intl.formatMessage(labels.advancement),
            contentBelow: intl.formatMessage({
              defaultMessage:
                "The employee consistently and effectively demonstrates expected behaviours related to advanced skill and merit, as well as the potential and desire for a more senior role. Promotion may be the best approach to maximize their contribution to the organization and the public service.",
              id: "QaifFj",
              description:
                "Description for the advancement nomination option on the details step",
            }),
          },
          {
            value: "lateralMovement",
            label: intl.formatMessage(labels.lateralMovement),
            contentBelow: intl.formatMessage({
              defaultMessage:
                "The employee demonstrates the expected behaviours related to skill and merit and has maximized professional development in their current position. Lateral opportunities would allow them to gain broader experience, enhance skills, satisfy current aspirations, and maintain engagement. An employee must have valid second language evaluation (SLE) results to be assessed as ready for lateral movement.",
              id: "ogWY8Q",
              description:
                "Description for the lateral movement nomination option on the details step",
            }),
          },
          {
            value: "developmentProgram",
            label: intl.formatMessage(labels.developmentProgram),
            contentBelow: intl.formatMessage({
              defaultMessage:
                "The employee would benefit from a development or learning opportunity to help prepare them for their next role.",
              id: "5MFMo5",
              description:
                "Description for the development program nomination option on the details step",
            }),
          },
        ]}
      />
      {noOptionsSelected ? (
        <Well data-h2-text-align="base(center)">
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Please select one or more nomination options to continue.",
              id: "PwB71+",
              description:
                "Null message displayed when no nomination options are selected on details step",
            })}
          </p>
        </Well>
      ) : (
        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(column)"
          data-h2-gap="base(x1)"
        >
          {advancement && (
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-gap="base(x1)"
            >
              <div>
                <Heading level="h3" size="h6">
                  {intl.formatMessage({
                    defaultMessage: "Advancement options",
                    id: "e0v7Fl",
                    description:
                      "Title for advancement options section in nominations details step",
                  })}
                </Heading>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Provide a secondary senior leader reference who can confirm the candidate's readiness for promotion.",
                    id: "fhpWug",
                    description:
                      "Description for advancement options section in nominations details step",
                  })}
                </p>
              </div>
              <EmployeeSearchInput
                id="advancementReference"
                name="advancementReference"
                employeeOption={fragmentToEmployee(advancementReferenceData)}
                label={intl.formatMessage(labels.referencesWorkEmail)}
                errorSeverities={{ NO_PROFILE: "warning" }}
              />
              {!advancementReferenceUnset && !advancementReferenceNotFound && (
                <>
                  <EmployeeSearchWell />
                  <RadioGroup
                    idPrefix="advancementReferenceReview"
                    id="advancementReferenceReview"
                    name="advancementReferenceReview"
                    legend={intl.formatMessage({
                      defaultMessage:
                        "Review incorrect or out of date information",
                      id: "9rQMYw",
                      description:
                        "Label for review of reference's information",
                    })}
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                    items={localizedEnumToOptions(
                      options?.advancementReferenceReviewOptions,
                      intl,
                      [
                        TalentNominationUserReview.Correct,
                        TalentNominationUserReview.Incorrect,
                        TalentNominationUserReview.OutOfDate,
                      ],
                    )}
                  />
                </>
              )}
              {!advancementReferenceUnset && advancementReferenceNotFound && (
                <>
                  <div
                    data-h2-display="base(grid)"
                    data-h2-grid-template-columns="l-tablet(1fr 1fr)"
                    data-h2-gap="base(x1)"
                  >
                    <Input
                      type="text"
                      id="advancementReferenceFallbackName"
                      name="advancementReferenceFallbackName"
                      rules={{
                        required: intl.formatMessage(errorMessages.required),
                      }}
                      label={intl.formatMessage(labels.referencesName)}
                    />
                    <Input
                      type="email"
                      id="advancementReferenceFallbackWorkEmail"
                      name="advancementReferenceFallbackWorkEmail"
                      rules={{
                        required: intl.formatMessage(errorMessages.required),
                        pattern: {
                          value: workEmailDomainRegex,
                          message: intl.formatMessage(
                            errorMessages.notGovernmentEmail,
                          ),
                        },
                      }}
                      label={intl.formatMessage({
                        defaultMessage: "Reference's work email",
                        id: "5fMhLS",
                        description:
                          "Label for the text input for the reference's work email",
                      })}
                    />
                  </div>
                  <ClassificationInput
                    name="advancementReferenceFallbackClassification"
                    classificationsQuery={unpackMaybes(
                      options?.classifications,
                    )}
                    rules={{
                      group: {
                        required: intl.formatMessage(errorMessages.required),
                      },
                      level: {
                        required: intl.formatMessage(errorMessages.required),
                      },
                    }}
                  />
                  <Select
                    id="advancementReferenceFallbackDepartment"
                    name="advancementReferenceFallbackDepartment"
                    rules={{
                      required: intl.formatMessage(errorMessages.required),
                    }}
                    label={intl.formatMessage(labels.referencesDepartment)}
                    nullSelection={intl.formatMessage(
                      uiMessages.nullSelectionOption,
                    )}
                    options={unpackMaybes(options?.departments).map(
                      (department) => ({
                        value: department.id,
                        label: department.name.localized ?? "",
                      }),
                    )}
                  />
                </>
              )}
            </div>
          )}
          {lateralMovement && (
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-gap="base(x1)"
            >
              <div>
                <Heading level="h3" size="h6">
                  {intl.formatMessage(labels.lateralMovementOptions)}
                </Heading>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Indicate one or more lateral movement options that are recommended for the nominee.",
                    id: "2CzVQo",
                    description:
                      "Description for lateral movement options section in nominations details step",
                  })}
                </p>
              </div>
              <Checklist
                idPrefix="lateralMovementOptions"
                name="lateralMovementOptions"
                legend={intl.formatMessage(labels.lateralMovementOptions)}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                items={localizedEnumToOptions(
                  options?.talentNominationLateralMovementOptions,
                  intl,
                  [
                    TalentNominationLateralMovementOption.SmallDepartment,
                    TalentNominationLateralMovementOption.LargeDepartment,
                    TalentNominationLateralMovementOption.CentralDepartment,
                    TalentNominationLateralMovementOption.NewDepartment,
                    TalentNominationLateralMovementOption.ProgramExperience,
                    TalentNominationLateralMovementOption.PolicyExperience,
                    TalentNominationLateralMovementOption.Other,
                  ],
                ).map((item) => {
                  const other: string =
                    TalentNominationLateralMovementOption.Other;
                  if (item.value === other) {
                    return {
                      ...item,
                    };
                  }

                  return {
                    ...item,
                    contentBelow: intl.formatMessage(
                      getTalentNominationLateralMovementOption(item.value),
                    ),
                  };
                })}
              />
              {lateralMovementOptionOther && (
                <Input
                  type="text"
                  id="lateralMovementOptionsOther"
                  name="lateralMovementOptionsOther"
                  label={intl.formatMessage(labels.otherLateralMovement)}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
              )}
            </div>
          )}
          {developmentProgram && (
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
              data-h2-gap="base(x1)"
            >
              <div>
                <Heading level="h3" size="h6">
                  {intl.formatMessage({
                    defaultMessage: "Development program options",
                    id: "PZEAt8",
                    description:
                      "Title for development program options section in nominations details step",
                  })}
                </Heading>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Indicate one or more options that are recommended for the nominee.",
                    id: "lu11dr",
                    description:
                      "Description for development program options section in nominations details step",
                  })}
                </p>
              </div>
              <Checklist
                idPrefix="developmentPrograms"
                name="developmentPrograms"
                legend={intl.formatMessage({
                  defaultMessage: "Development program options",
                  id: "OTI+Kb",
                  description:
                    "Label for the development program options checklist on the details step",
                })}
                rules={{
                  required: intl.formatMessage(errorMessages.required),
                }}
                items={[
                  ...developmentProgramOptions.map((dp) => ({
                    value: dp.id,
                    label: dp.name?.localized ?? "",
                    contentBelow: dp.descriptionForNominations?.localized ?? "",
                  })),
                  {
                    value: "other",
                    label: intl.formatMessage(commonMessages.other),
                  },
                ]}
              />
              {developmentProgramOptionOther && (
                <Input
                  type="text"
                  id="developmentProgramOptionsOther"
                  name="developmentProgramOptionsOther"
                  label={intl.formatMessage(labels.otherDevelopmentProgram)}
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const NominateTalentDetails_Fragment = graphql(/* GraphQL */ `
  fragment NominateTalentDetails on TalentNomination {
    id
    talentNominationEvent {
      developmentPrograms {
        id
        name {
          localized
        }
        descriptionForNominations {
          localized
        }
      }
    }
    nominateForAdvancement
    advancementReference {
      id
      ...DetailsEmployee
    }
    advancementReferenceReview {
      value
    }
    advancementReferenceFallbackWorkEmail
    advancementReferenceFallbackName
    advancementReferenceFallbackClassification {
      id
      group
      level
    }
    advancementReferenceFallbackDepartment {
      id
    }
    nominateForLateralMovement
    nominateForDevelopmentPrograms
    lateralMovementOptions {
      value
    }
    lateralMovementOptionsOther
    developmentPrograms {
      id
      name {
        en
        fr
      }
    }
    developmentProgramOptionsOther
  }
`);

const transformSubmitData: SubmitDataTransformer<FormValues> = (values) => {
  const hasAdvancement = values.nominationOptions.includes("advancement");
  const hasLateralMovement =
    values.nominationOptions.includes("lateralMovement");
  const hasDevelopmentProgram =
    values.nominationOptions.includes("developmentProgram");

  const hasAdvancementReference = !!values.advancementReference;

  let advancementReference: UpdateTalentNominationInput["advancementReference"] =
    hasAdvancementReference ? { connect: values.advancementReference } : null;
  if (values.advancementReferenceFallbackWorkEmail) {
    advancementReference = { disconnect: true };
  }
  return {
    nominateForAdvancement: hasAdvancement ?? null,
    nominateForLateralMovement: hasLateralMovement ?? null,
    nominateForDevelopmentPrograms: hasDevelopmentProgram ?? null,
    advancementReference,
    advancementReferenceReview:
      hasAdvancement && hasAdvancementReference
        ? values.advancementReferenceReview
        : null,
    advancementReferenceFallbackWorkEmail:
      hasAdvancement && !hasAdvancementReference
        ? values.advancementReferenceFallbackWorkEmail
        : null,
    advancementReferenceFallbackName:
      hasAdvancement && !hasAdvancementReference
        ? values.advancementReferenceFallbackName
        : null,
    advancementReferenceFallbackClassification:
      hasAdvancement && !hasAdvancementReference
        ? { connect: values.advancementReferenceFallbackClassification }
        : { disconnect: true },
    advancementReferenceFallbackDepartment:
      hasAdvancement && !hasAdvancementReference
        ? { connect: values.advancementReferenceFallbackDepartment }
        : { disconnect: true },
    lateralMovementOptions: hasLateralMovement
      ? values.lateralMovementOptions
      : [],
    lateralMovementOptionsOther:
      hasLateralMovement &&
      values.lateralMovementOptions?.includes(
        TalentNominationLateralMovementOption.Other,
      )
        ? values.lateralMovementOptionsOther
        : null,
    developmentPrograms: hasDevelopmentProgram
      ? {
          sync: unpackMaybes(
            values.developmentPrograms.filter(
              (developmentProgram) => developmentProgram !== "other",
            ),
          ),
        }
      : { sync: [] },
    developmentProgramOptionsOther:
      hasDevelopmentProgram && values.developmentPrograms.includes("other")
        ? values.developmentProgramOptionsOther
        : null,
  };
};

interface DetailsProps {
  detailsQuery: FragmentType<typeof NominateTalentDetails_Fragment>;
  optionsQuery: DetailsFieldsOptionsFragmentType;
}

const Details = ({ detailsQuery, optionsQuery }: DetailsProps) => {
  const intl = useIntl();
  const { current } = useCurrentStep();

  const talentNomination = getFragment(
    NominateTalentDetails_Fragment,
    detailsQuery,
  );
  if (current !== TalentNominationStep.NominationDetails) {
    return null;
  }

  const preSubmitValidation = (values: FormValues) => {
    if (
      values.nominationOptions.includes("advancement") &&
      !values.advancementReference &&
      !values.advancementReferenceFallbackWorkEmail
    ) {
      return intl.formatMessage({
        defaultMessage: "To continue, please let us know who the reference is.",
        id: "dztCCI",
        description:
          "Error message when a reference has not been set for a nomination",
      });
    }

    return null;
  };

  let nominationOptions: Maybe<NominationOption>[] = [];
  if (talentNomination?.nominateForAdvancement) {
    nominationOptions = [...nominationOptions, "advancement"];
  }
  if (talentNomination?.nominateForLateralMovement) {
    nominationOptions = [...nominationOptions, "lateralMovement"];
  }
  if (talentNomination?.nominateForDevelopmentPrograms) {
    nominationOptions = [...nominationOptions, "developmentProgram"];
  }

  return (
    <UpdateForm<FormValues>
      submitDataTransformer={transformSubmitData}
      preSubmitValidation={preSubmitValidation}
      defaultValues={{
        nominationOptions,
        advancementReference:
          talentNomination?.advancementReference?.id ?? undefined,
        advancementReferenceReview:
          talentNomination?.advancementReferenceReview?.value,
        advancementReferenceFallbackWorkEmail:
          talentNomination?.advancementReferenceFallbackWorkEmail ?? undefined,
        advancementReferenceFallbackName:
          talentNomination?.advancementReferenceFallbackName ?? undefined,
        advancementReferenceFallbackClassification:
          talentNomination?.advancementReferenceFallbackClassification?.id,
        advancementReferenceFallbackClassificationGroup:
          talentNomination?.advancementReferenceFallbackClassification?.group,
        advancementReferenceFallbackClassificationLevel:
          talentNomination?.advancementReferenceFallbackClassification?.level.toString(),
        advancementReferenceFallbackDepartment:
          talentNomination?.advancementReferenceFallbackDepartment?.id,
        lateralMovementOptions:
          talentNomination?.lateralMovementOptions?.map((x) => x.value) ?? null,
        lateralMovementOptionsOther:
          talentNomination?.lateralMovementOptionsOther ?? "",
        developmentPrograms: [
          ...unpackMaybes(
            talentNomination?.developmentPrograms?.flatMap(
              (developmentProgram) => developmentProgram.id,
            ),
          ),
          talentNomination?.developmentProgramOptionsOther
            ? "other"
            : undefined,
        ],
        developmentProgramOptionsOther:
          talentNomination?.developmentProgramOptionsOther ?? "",
      }}
    >
      <SubHeading Icon={RectangleGroupIcon}>
        {intl.formatMessage(messages.nominationDetails)}
      </SubHeading>
      <p data-h2-margin="base(x1 0)">
        {intl.formatMessage({
          defaultMessage:
            "Now, we'll look at the details of the nomination you'd like to submit.",
          id: "z7m8Nt",
          description: "Subtitle for nomination details step",
        })}
      </p>
      <DetailsFields
        developmentProgramOptions={
          unpackMaybes(
            talentNomination?.talentNominationEvent?.developmentPrograms,
          ) ?? []
        }
        optionsQuery={optionsQuery}
        employeeQuery={talentNomination?.advancementReference ?? undefined}
      />
    </UpdateForm>
  );
};

export default Details;
