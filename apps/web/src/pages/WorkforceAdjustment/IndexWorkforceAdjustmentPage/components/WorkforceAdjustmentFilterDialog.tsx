import { OperationContext, useQuery } from "urql";
import { useIntl } from "react-intl";

import {
  graphql,
  LanguageAbility,
  LocalizedLanguageAbility,
  OperationalRequirement,
  PositionDuration,
  WfaInterest,
  WorkRegion,
} from "@gc-digital-talent/graphql";
import {
  Checklist,
  Combobox,
  enumToOptions,
  RadioGroup,
  Select,
} from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  EmploymentDuration,
  getEmploymentDuration,
  getEmploymentEquityGroup,
  narrowEnumType,
  navigationMessages,
} from "@gc-digital-talent/i18n";
import { narrowTeambleType } from "@gc-digital-talent/auth";

import FilterDialog, {
  CommonFilterDialogProps,
} from "~/components/FilterDialog/FilterDialog";
import { getClassificationName } from "~/utils/poolUtils";
import pageTitles from "~/messages/pageTitles";
import adminMessages from "~/messages/adminMessages";
import profileMessages from "~/messages/profileMessages";

import { HasPriorityEntitlementValue } from "./utils";

export interface FormValues {
  classifications?: string[];
  departments?: string[];
  workStreams?: string[];
  communities?: string[];
  wfaInterests?: WfaInterest[];
  equity?: string[];
  languageAbility?: LanguageAbility;
  positionDuration?: PositionDuration;
  operationalRequirements?: OperationalRequirement[];
  workRegions?: WorkRegion[];
  skills?: string[];
  hasPriorityEntitlement?: HasPriorityEntitlementValue;
}

const context: Partial<OperationContext> = {
  requestPolicy: "cache-first", // The list of skills will rarely change, so we override default request policy to avoid unnecessary cache updates.
};

const WorkforceAdjustmentFilterData_Query = graphql(/* GraphQL */ `
  query WorkforceAdjustmentFilterData {
    me {
      authInfo {
        roleAssignments {
          teamable {
            __typename
            id
            ... on Community {
              name {
                localized
              }
            }
          }
        }
      }
    }
    skills {
      id
      key
      name {
        localized
      }
      category {
        value
      }
    }
    classifications {
      id
      group
      level
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

const WorkforceAdjustmentFilterDialog = ({
  onSubmit,
  resetValues,
  initialValues,
}: CommonFilterDialogProps<FormValues>) => {
  const intl = useIntl();
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  const [{ data }] = useQuery({
    query: WorkforceAdjustmentFilterData_Query,
    context,
  });

  const assignments = unpackMaybes(
    data?.me?.authInfo?.roleAssignments?.flatMap(
      (assignment) => assignment?.teamable,
    ),
  );

  const communities = narrowTeambleType(assignments, "Community");

  return (
    <FilterDialog<FormValues>
      options={{ defaultValues: initialValues }}
      {...{ onSubmit, resetValues }}
    >
      <div className="mb-6 grid gap-6 xs:grid-cols-2">
        <Combobox
          id="classifications"
          name="classifications"
          label={intl.formatMessage({
            defaultMessage: "Current employee classification",
            id: "68IS4M",
            description: "Label for employee classification input",
          })}
          isMulti
          options={unpackMaybes(data?.classifications).map(
            (classification) => ({
              value: classification.id,
              label: getClassificationName(classification, intl),
            }),
          )}
        />
        <Combobox
          id="departments"
          name="departments"
          label={intl.formatMessage({
            defaultMessage: "Current employee department",
            id: "kEtGY4",
            description: "Label for employee department input",
          })}
          isMulti
          options={unpackMaybes(data?.departments).map((dept) => ({
            value: dept.id,
            label: dept.name.localized ?? notAvailable,
          }))}
        />
        <Combobox
          id="workStreams"
          name="workStreams"
          label={intl.formatMessage(pageTitles.workStreams)}
          isMulti
          options={unpackMaybes(data?.workStreams).map((stream) => ({
            value: stream.id,
            label: stream.name?.localized ?? notAvailable,
          }))}
        />
        <Combobox
          id="communities"
          name="communities"
          label={intl.formatMessage(pageTitles.communities)}
          isMulti
          options={communities.map((community) => ({
            value: community.id,
            label: community.name?.localized ?? notAvailable,
          }))}
        />
      </div>
      <div className="grid gap-6 xs:grid-cols-3">
        <Checklist
          idPrefix="equity"
          name="equity"
          legend={intl.formatMessage(commonMessages.employmentEquity)}
          items={[
            {
              value: "isWoman",
              label: intl.formatMessage(getEmploymentEquityGroup("woman")),
            },
            {
              value: "hasDisability",
              label: intl.formatMessage(getEmploymentEquityGroup("disability")),
            },
            {
              value: "isIndigenous",
              label: intl.formatMessage(getEmploymentEquityGroup("indigenous")),
            },
            {
              value: "isVisibleMinority",
              label: intl.formatMessage(getEmploymentEquityGroup("minority")),
            },
          ]}
        />
        <RadioGroup
          idPrefix="hasPriorityEntitlement"
          name="hasPriorityEntitlement"
          legend={intl.formatMessage(profileMessages.priorityStatus)}
          items={[
            {
              value: "yes",
              label: intl.formatMessage({
                defaultMessage: "Yes, candidate has a priority entitlement",
                id: "Ez7YTI",
                description:
                  "Option label to filter employees by those who have priority enititlement",
              }),
            },
            {
              value: "no",
              label: intl.formatMessage({
                defaultMessage:
                  "No, candidate does not have a priority entitlement",
                id: "j4H1ff",
                description:
                  "Option label to filter employees by those who do not have priority enititlement",
              }),
            },
            {
              value: "both",
              label: intl.formatMessage(commonMessages.all),
            },
          ]}
        />
        <div className="flex flex-col gap-6">
          <Select
            id="languageAbility"
            name="languageAbility"
            enableNull
            nullSelection={intl.formatMessage(commonMessages.anyLanguage)}
            label={intl.formatMessage(commonMessages.workingLanguageAbility)}
            options={narrowEnumType(
              unpackMaybes(data?.languageAbilities),
              "LanguageAbility",
            ).map((ability: LocalizedLanguageAbility) => ({
              value: ability.value,
              label: ability.label.localized ?? notAvailable,
            }))}
          />
          <Select
            id="positionDuration"
            name="positionDuration"
            enableNull
            nullSelection={intl.formatMessage({
              defaultMessage: "Any duration",
              id: "Swq+OD",
              description: "Option label for allowing any employment duration",
            })}
            label={intl.formatMessage({
              defaultMessage: "Duration preferences",
              id: "2ingb6",
              description: "Label for the employment duration field",
            })}
            options={enumToOptions(EmploymentDuration).map(({ value }) => ({
              value,
              label: intl.formatMessage(getEmploymentDuration(value, "short")),
            }))}
          />
        </div>
        <Checklist
          idPrefix="operationalRequirements"
          name="operationalRequirements"
          legend={intl.formatMessage(navigationMessages.workPreferences)}
          items={narrowEnumType(
            unpackMaybes(data?.operationalRequirements),
            "OperationalRequirement",
          ).map((req) => ({
            value: req.value,
            label: req.label.localized ?? notAvailable,
          }))}
        />
        <Checklist
          idPrefix="workRegions"
          name="workRegions"
          legend={intl.formatMessage(navigationMessages.workLocation)}
          items={narrowEnumType(
            unpackMaybes(data?.workRegions),
            "WorkRegion",
          ).map((req) => ({
            value: req.value,
            label: req.label.localized ?? notAvailable,
          }))}
        />
        <div className="xs:col-span-3">
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

export default WorkforceAdjustmentFilterDialog;
