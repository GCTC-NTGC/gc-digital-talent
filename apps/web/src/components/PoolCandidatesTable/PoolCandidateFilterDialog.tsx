import { MessageDescriptor, useIntl } from "react-intl";

import {
  Checklist,
  Combobox,
  HiddenInput,
  RadioGroup,
  SwitchInput,
  Select,
} from "@gc-digital-talent/forms";
import {
  FragmentType,
  getFragment,
  graphql,
  WorkRegion,
  AssessmentStep,
  AssessmentStepType,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  getEmploymentEquityGroup,
  navigationMessages,
  narrowEnumType,
  sortLocalizedEnumOptions,
  ENUM_SORT_ORDER,
} from "@gc-digital-talent/i18n";
import { Heading } from "@gc-digital-talent/ui";

import adminMessages from "~/messages/adminMessages";
import applicationMessages from "~/messages/applicationMessages";

import FilterDialog, {
  CommonFilterDialogProps,
} from "../FilterDialog/FilterDialog";
import { FormValues } from "./types";
import PoolFilterInput from "../PoolFilterInput/PoolFilterInput";
import tableMessages from "./tableMessages";
import { candidateSuspendedFilterToCustomOptions } from "./helpers";

const PoolCandidateFilterDialog_Query = graphql(/* GraphQL */ `
  fragment PoolCandidateFilterDialog on Query {
    classifications {
      group
      level
    }
    skills {
      id
      name {
        localized
      }
    }
    communities {
      id
      name {
        localized
      }
    }
    departments {
      id
      name {
        localized
      }
    }
    workStreams {
      id
      name {
        localized
      }
    }
    expiryFilters: localizedEnumOptions(enumName: "CandidateExpiryFilter") {
      ... on LocalizedCandidateExpiryFilter {
        value
        label {
          localized
        }
      }
    }
    statuses: localizedEnumOptions(enumName: "ApplicationStatus") {
      ... on LocalizedApplicationStatus {
        value
        label {
          localized
        }
      }
    }
    flexibleWorkLocations: localizedEnumOptions(
      enumName: "FlexibleWorkLocation"
    ) {
      ... on LocalizedFlexibleWorkLocation {
        value
        label {
          localized
        }
      }
    }
    languageAbilities: localizedEnumOptions(enumName: "LanguageAbility") {
      ... on LocalizedLanguageAbility {
        value
        label {
          localized
        }
      }
    }
    operationalRequirements: localizedEnumOptions(
      enumName: "OperationalRequirement"
    ) {
      ... on LocalizedOperationalRequirement {
        value
        label {
          localized
        }
      }
    }
    placements: localizedEnumOptions(enumName: "PlacementType") {
      ... on LocalizedPlacementType {
        value
        label {
          localized
        }
      }
    }
    priorityWeights: localizedEnumOptions(enumName: "PriorityWeight") {
      ... on LocalizedPriorityWeight {
        value
        label {
          localized
        }
      }
    }
    publishingGroups: localizedEnumOptions(enumName: "PublishingGroup") {
      ... on LocalizedPublishingGroup {
        value
        label {
          localized
        }
      }
    }
    removalReasons: localizedEnumOptions(enumName: "CandidateRemovalReason") {
      ... on LocalizedCandidateRemovalReason {
        value
        label {
          localized
        }
      }
    }
    screeningStages: localizedEnumOptions(enumName: "ScreeningStage") {
      ... on LocalizedScreeningStage {
        value
        label {
          localized
        }
      }
    }
    suspendedFilters: localizedEnumOptions(
      enumName: "CandidateSuspendedFilter"
    ) {
      ... on LocalizedCandidateSuspendedFilter {
        value
        label {
          localized
        }
      }
    }
    workRegions: localizedEnumOptions(enumName: "WorkRegion") {
      ... on LocalizedWorkRegion {
        value
        label {
          localized
        }
      }
    }
  }
`);

export type PoolCandidateFilterDialogProps =
  CommonFilterDialogProps<FormValues> & {
    hidePoolFilter?: boolean;
    query?: FragmentType<typeof PoolCandidateFilterDialog_Query>;
    availableSteps?:
      | Pick<AssessmentStep, "id" | "type" | "sortOrder" | "title">[]
      | null;
  };

const PoolCandidateFilterDialog = ({
  query,
  onSubmit,
  resetValues,
  initialValues,
  hidePoolFilter,
  availableSteps,
}: PoolCandidateFilterDialogProps) => {
  const intl = useIntl();
  const data = getFragment(PoolCandidateFilterDialog_Query, query);
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  const assessmentSteps = unpackMaybes(availableSteps)
    .filter(
      (step) =>
        !!step.sortOrder &&
        step.sortOrder > 0 &&
        ![
          AssessmentStepType.ApplicationScreening,
          AssessmentStepType.ScreeningQuestionsAtApplication,
          null,
        ].includes(step.type?.value ?? null),
    )
    .sort((a, b) => (a?.sortOrder ?? 0) - (b?.sortOrder ?? 0));

  const equityOption = (value: string, message: MessageDescriptor) => ({
    value,
    label: intl.formatMessage(message),
  });

  return (
    <FilterDialog<FormValues>
      options={{ defaultValues: initialValues }}
      // Remove hidden pools filters from count
      {...(hidePoolFilter && {
        modifyFilterCount: -5,
      })}
      {...{ resetValues, onSubmit }}
    >
      {!hidePoolFilter ? (
        <>
          <Heading level="h3" size="h5" className="mt-0 mb-6 font-bold">
            {intl.formatMessage({
              defaultMessage: "Process filters",
              id: "+dlRCu",
              description:
                "Heading for filters associated with a candidates process",
            })}
          </Heading>
          <div className="mb-6 grid gap-6 xs:grid-cols-2">
            <Checklist
              idPrefix="publishingGroups"
              name="publishingGroups"
              legend={intl.formatMessage(adminMessages.publishingGroups)}
              items={narrowEnumType(
                unpackMaybes(data?.publishingGroups),
                "PublishingGroup",
              ).map((publishingGroup) => ({
                value: publishingGroup.value,
                label: publishingGroup.label?.localized ?? notAvailable,
              }))}
            />
            <Select
              id="community"
              name="community"
              enableNull
              label={intl.formatMessage(adminMessages.community)}
              nullSelection={intl.formatMessage(
                commonMessages.selectACommunity,
              )}
              options={unpackMaybes(data?.communities).map(({ id, name }) => ({
                value: id,
                label: name?.localized ?? notAvailable,
              }))}
            />
            <Combobox
              id="classifications"
              name="classifications"
              isMulti
              label={intl.formatMessage(adminMessages.classifications)}
              options={unpackMaybes(data?.classifications).map(
                ({ group, level }) => ({
                  value: `${group}-${level}`,
                  label: `${group}-${level < 10 ? "0" : ""}${level}`,
                }),
              )}
            />
            <Combobox
              id="stream"
              name="stream"
              isMulti
              label={intl.formatMessage(adminMessages.streams)}
              options={unpackMaybes(data?.workStreams).map((workStream) => ({
                value: workStream.id,
                label: workStream.name?.localized ?? notAvailable,
              }))}
            />
            <div className="xs:col-span-2">
              <PoolFilterInput />
            </div>
          </div>
        </>
      ) : (
        <HiddenInput name="pools" />
      )}

      <Heading
        level="h3"
        size="h5"
        className={`${!hidePoolFilter ? "mt-12" : "mt-0"} mb-6 font-bold`}
      >
        {intl.formatMessage({
          defaultMessage: "Application filters",
          id: "/eEV1T",
          description:
            "Heading for filters associated with an applications status",
        })}
      </Heading>

      <div className="mb-6 grid gap-6 xs:grid-cols-3">
        <Combobox
          id="statuses"
          name="statuses"
          isMulti
          label={intl.formatMessage(applicationMessages.finalDecision)}
          options={narrowEnumType(
            unpackMaybes(data?.statuses),
            "ApplicationStatus",
          ).map((status) => ({
            value: status.value,
            label: status.label?.localized ?? notAvailable,
          }))}
        />
        <Combobox
          id="screeningStages"
          name="screeningStages"
          isMulti
          label={intl.formatMessage(applicationMessages.screeningStage)}
          options={sortLocalizedEnumOptions(
            ENUM_SORT_ORDER.SCREENING_STAGE,
            narrowEnumType(
              unpackMaybes(data?.screeningStages),
              "ScreeningStage",
            ),
          ).map((screeningStage) => ({
            value: screeningStage.value,
            label: screeningStage.label?.localized ?? notAvailable,
          }))}
        />
        {assessmentSteps.length > 0 && (
          <Combobox
            id="assessmentSteps"
            name="assessmentSteps"
            isMulti
            label={intl.formatMessage(applicationMessages.assessmentStage)}
            doNotSort
            options={assessmentSteps.map((step) => ({
              value: String(step.sortOrder ?? 0),
              label:
                // NOTE: we do want to pass on empty strings
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                (step.title?.localized || step.type?.label.localized) ??
                notAvailable,
            }))}
          />
        )}
        <Combobox
          id="placementTypes"
          name="placementTypes"
          isMulti
          label={intl.formatMessage(commonMessages.jobPlacement)}
          options={narrowEnumType(
            unpackMaybes(data?.placements),
            "PlacementType",
          ).map((placementType) => ({
            value: placementType.value,
            label: placementType.label?.localized ?? notAvailable,
          }))}
        />
        <Combobox
          id="removalReasons"
          name="removalReasons"
          isMulti
          label={intl.formatMessage({
            defaultMessage: "Reason for removal",
            id: "mPxtB3",
            description: "Label for the reason a candidate was removed",
          })}
          options={narrowEnumType(
            unpackMaybes(data?.removalReasons),
            "CandidateRemovalReason",
          ).map((removalReason) => ({
            value: removalReason.value,
            label: removalReason.label?.localized ?? notAvailable,
          }))}
        />
        <RadioGroup
          idPrefix="expiryStatus"
          name="expiryStatus"
          legend={intl.formatMessage({
            defaultMessage: "Expiry status",
            description: "Label for the expiry status field",
            id: "HDiUEc",
          })}
          items={narrowEnumType(
            unpackMaybes(data?.expiryFilters),
            "CandidateExpiryFilter",
          ).map((expiryFilter) => ({
            value: expiryFilter.value,
            label: expiryFilter.label?.localized ?? notAvailable,
          }))}
        />
        <RadioGroup
          idPrefix="suspendedStatus"
          name="suspendedStatus"
          legend={intl.formatMessage(tableMessages.interestJobOffers)}
          items={candidateSuspendedFilterToCustomOptions(
            narrowEnumType(
              unpackMaybes(data?.suspendedFilters),
              "CandidateSuspendedFilter",
            ),
            intl,
          )}
        />
      </div>

      <Heading level="h3" size="h5" className="mt-12 mb-6 font-bold">
        {intl.formatMessage({
          defaultMessage: "Profile filters",
          id: "WqxVxb",
          description:
            "Heading for filters associated with a candidates profile",
        })}
      </Heading>

      <div className="grid gap-6 xs:grid-cols-3">
        <Select
          id="languageAbility"
          name="languageAbility"
          enableNull
          nullSelection={intl.formatMessage(commonMessages.anyLanguage)}
          label={intl.formatMessage(commonMessages.workingLanguageAbility)}
          options={narrowEnumType(
            unpackMaybes(data?.languageAbilities),
            "LanguageAbility",
          ).map((languageAbility) => ({
            value: languageAbility.value,
            label: languageAbility.label?.localized ?? notAvailable,
          }))}
        />
        <Checklist
          idPrefix="equity"
          name="equity"
          legend={intl.formatMessage(commonMessages.employmentEquity)}
          items={[
            equityOption("isWoman", getEmploymentEquityGroup("woman")),
            equityOption(
              "hasDisability",
              getEmploymentEquityGroup("disability"),
            ),
            equityOption(
              "isIndigenous",
              getEmploymentEquityGroup("indigenous"),
            ),
            equityOption(
              "isVisibleMinority",
              getEmploymentEquityGroup("minority"),
            ),
          ]}
        />
        <Checklist
          idPrefix="priorityWeight"
          name="priorityWeight"
          legend={intl.formatMessage(adminMessages.category)}
          items={sortLocalizedEnumOptions(
            ENUM_SORT_ORDER.PRIORITY_WEIGHT,
            narrowEnumType(
              unpackMaybes(data?.priorityWeights),
              "PriorityWeight",
            ),
          ).map((priorityWeight) => ({
            value: priorityWeight.value,
            label: priorityWeight.label?.localized ?? notAvailable,
          }))}
        />
        <Checklist
          idPrefix="operationalRequirement"
          name="operationalRequirement"
          legend={intl.formatMessage(navigationMessages.workPreferences)}
          items={narrowEnumType(
            unpackMaybes(data?.operationalRequirements),
            "OperationalRequirement",
          ).map((operationalRequirement) => ({
            value: operationalRequirement.value,
            label: operationalRequirement.label?.localized ?? notAvailable,
          }))}
        />
        <Checklist
          idPrefix="flexibleWorkLocations"
          name="flexibleWorkLocations"
          legend={intl.formatMessage(navigationMessages.flexibleWorkLocations)}
          items={sortLocalizedEnumOptions(
            ENUM_SORT_ORDER.FLEXIBLE_WORK_LOCATION,
            narrowEnumType(
              unpackMaybes(data?.flexibleWorkLocations),
              "FlexibleWorkLocation",
            ),
          ).map((flexibleWorkLocation) => ({
            value: flexibleWorkLocation.value,
            label: flexibleWorkLocation.label?.localized ?? notAvailable,
          }))}
        />
        <Checklist
          idPrefix="workRegion"
          name="workRegion"
          legend={intl.formatMessage(navigationMessages.workLocation)}
          items={sortLocalizedEnumOptions(
            ENUM_SORT_ORDER.WORK_REGION,
            narrowEnumType(unpackMaybes(data?.workRegions), "WorkRegion"),
          )
            /* remove 'Telework' enum from checklist of options */
            .filter((workRegion) => workRegion.value !== WorkRegion.Telework)
            .map((workRegion) => ({
              value: workRegion.value,
              label: workRegion.label?.localized ?? notAvailable,
            }))}
        />
        <div className="flex flex-col gap-6 xs:col-span-3">
          <SwitchInput
            id="govEmployee"
            name="govEmployee"
            color="secondary"
            value="true"
            label={intl.formatMessage(commonMessages.governmentEmployee)}
          />
          <Combobox
            id="departments"
            name="departments"
            isMulti
            label={intl.formatMessage(tableMessages.employeeDepartment)}
            options={unpackMaybes(data?.departments).map((dept) => ({
              value: dept.id,
              label:
                dept.name?.localized ??
                intl.formatMessage(commonMessages.notFound),
            }))}
          />
          <Combobox
            id="skills"
            name="skills"
            isMulti
            label={intl.formatMessage(adminMessages.skills)}
            options={unpackMaybes(data?.skills).map(({ id, name }) => ({
              value: id,
              label: name.localized ?? notAvailable,
            }))}
          />
        </div>
      </div>
    </FilterDialog>
  );
};

export default PoolCandidateFilterDialog;
