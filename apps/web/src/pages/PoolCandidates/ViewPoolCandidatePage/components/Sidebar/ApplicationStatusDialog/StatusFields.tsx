import { useFormContext } from "react-hook-form";
import { MessageDescriptor, useIntl } from "react-intl";

import {
  ApplicationStatus,
  CandidateRemovalReason,
  FragmentType,
  getFragment,
  graphql,
  PlacementType,
} from "@gc-digital-talent/graphql";
import {
  DateInput,
  objectsToSortedOptions,
  RadioGroup,
  Select,
  TextArea,
} from "@gc-digital-talent/forms";
import {
  commonMessages,
  ENUM_SORT_ORDER,
  errorMessages,
  getLocalizedEnumStringByValue,
  narrowEnumType,
  sortLocalizedEnumOptions,
} from "@gc-digital-talent/i18n";
import { strToFormDate } from "@gc-digital-talent/date-helpers";
import {
  hasRequiredRoles,
  ROLE_NAME,
  useAuthorization,
} from "@gc-digital-talent/auth";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Notice } from "@gc-digital-talent/ui";

import poolCandidateMessages from "~/messages/poolCandidateMessages";

import { FormValues } from "./types";

const placementContentMap = new Map<PlacementType, MessageDescriptor>([
  [
    PlacementType.UnderConsideration,
    poolCandidateMessages.underConsiderationDesc,
  ],
  [PlacementType.PlacedTentative, poolCandidateMessages.PlacedTentativeDesc],
]);

const PLACED_NOTICE_TYPES = [
  PlacementType.UnderConsideration,
  PlacementType.PlacedTerm,
  PlacementType.PlacedIndeterminate,
];

const QualifiedFieldsOptions_Fragment = graphql(/** GraphQL */ `
  fragment QualifiedFieldsOptions on Query {
    placementTypes: localizedEnumOptions(enumName: "PlacementType") {
      ... on LocalizedPlacementType {
        value
        label {
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

interface QualifiedFieldsProps {
  query: FragmentType<typeof QualifiedFieldsOptions_Fragment>;
}

export const QualifiedFields = ({ query }: QualifiedFieldsProps) => {
  const intl = useIntl();
  const { userAuthInfo } = useAuthorization();
  const { watch } = useFormContext<FormValues>();
  const options = getFragment(QualifiedFieldsOptions_Fragment, query);
  const [status, selectedType] = watch(["status", "placementType"]);
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  if (status !== ApplicationStatus.Qualified) return null;

  const isPlaced = selectedType && selectedType !== PlacementType.NotPlaced;
  const canPlace = hasRequiredRoles({
    toCheck: [{ name: ROLE_NAME.CommunityRecruiter }],
    userRoles: unpackMaybes(userAuthInfo?.roleAssignments),
  });

  const placementTypeOptions = sortLocalizedEnumOptions(
    ENUM_SORT_ORDER.PLACEMENT_TYPE,
    narrowEnumType(unpackMaybes(options?.placementTypes), "PlacementType"),
  ).map((placementType) => {
    const content = placementContentMap.get(placementType.value);

    return {
      value: placementType.value,
      label: placementType.label.localized ?? notAvailable,
      contentBelow: content ? intl.formatMessage(content) : undefined,
    };
  });

  const selectedTypeOption = placementTypeOptions.find(
    (option) => option.value === selectedType,
  );

  return (
    <>
      <DateInput
        id="expiryDate"
        name="expiryDate"
        legend={intl.formatMessage(commonMessages.expiryDate)}
        context={
          <p>
            {intl.formatMessage({
              defaultMessage:
                "This is the amount of time this candidate will be considered for placement based on the results of this process. The usual amount of time is two years.",
              id: "DXjJyD",
              description:
                "Text describing expiry dates for candidates, what it is for and a recommendation",
            })}
          </p>
        }
        rules={{
          required: intl.formatMessage(errorMessages.required),
          min: {
            value: strToFormDate(new Date().toISOString()),
            message: intl.formatMessage(errorMessages.futureDate),
          },
        }}
      />

      {canPlace && (
        <>
          <RadioGroup
            idPrefix="placementType"
            name="placementType"
            legend={intl.formatMessage({
              defaultMessage: "Job placement status",
              id: "dpO8Va",
              description: "Label for the job placement status field",
            })}
            items={placementTypeOptions}
          />

          {isPlaced && (
            <Select
              id="department"
              name="department"
              label={intl.formatMessage({
                defaultMessage: "Placed department",
                id: "G8JoCN",
                description: "Label for the placed department field",
              })}
              nullSelection={intl.formatMessage({
                defaultMessage: "Select a department",
                id: "y827h2",
                description:
                  "Null selection for department select input in the request form.",
              })}
              options={objectsToSortedOptions(
                unpackMaybes(options?.departments),
                intl,
              )}
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
          )}

          {selectedTypeOption &&
            PLACED_NOTICE_TYPES.includes(selectedTypeOption.value) && (
              <Notice.Root small>
                <Notice.Title>{selectedTypeOption.label}</Notice.Title>
                <Notice.Content>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "This candidate will not appear in talent request results based on this process.",
                      id: "dDrs39",
                      description:
                        "Notice that candidates under consideration do not appear in talent search requests",
                    })}
                  </p>
                </Notice.Content>
              </Notice.Root>
            )}
        </>
      )}
    </>
  );
};

const DisqualifiedFieldsOptions_Fragment = graphql(/** GraphQL */ `
  fragment DisqualifiedFieldsOptions on Query {
    disqualificationReasons: localizedEnumOptions(
      enumName: "DisqualificationReason"
    ) {
      ... on LocalizedDisqualificationReason {
        value
        label {
          localized
        }
      }
    }
  }
`);

interface DisqualifiedFieldsProps {
  query: FragmentType<typeof DisqualifiedFieldsOptions_Fragment>;
}

export const DisqualifiedFields = ({ query }: DisqualifiedFieldsProps) => {
  const intl = useIntl();
  const options = getFragment(DisqualifiedFieldsOptions_Fragment, query);
  const { watch } = useFormContext<FormValues>();
  const status = watch("status");

  if (status !== ApplicationStatus.Disqualified) return null;

  return (
    <RadioGroup
      idPrefix="disqualificationReason"
      name="disqualificationReason"
      legend={intl.formatMessage({
        defaultMessage: "Disqualified decision",
        description: "Disqualified decision input",
        id: "Ed+xy1",
      })}
      rules={{
        required: intl.formatMessage(errorMessages.required),
      }}
      items={narrowEnumType(
        unpackMaybes(options?.disqualificationReasons),
        "DisqualificationReason",
      ).map((reason) => ({
        value: reason.value,
        label:
          reason.label.localized ??
          intl.formatMessage(commonMessages.notAvailable),
      }))}
    />
  );
};

const RemovedFieldsOptions_Query = graphql(/** GraphQL */ `
  fragment RemovedFieldsOptions on Query {
    removalReasons: localizedEnumOptions(enumName: "CandidateRemovalReason") {
      ... on LocalizedCandidateRemovalReason {
        value
        label {
          localized
        }
      }
    }
  }
`);

interface RemovedFieldsProps {
  query: FragmentType<typeof RemovedFieldsOptions_Query>;
}

export const RemovedFields = ({ query }: RemovedFieldsProps) => {
  const intl = useIntl();
  const options = getFragment(RemovedFieldsOptions_Query, query);
  const { watch } = useFormContext<FormValues>();
  const [status, reason] = watch(["status", "removalReason"]);

  if (status !== ApplicationStatus.Removed) return null;

  const reasons = unpackMaybes(options?.removalReasons);

  return (
    <>
      <RadioGroup
        idPrefix="removalReason"
        name="removalReason"
        legend={intl.formatMessage({
          defaultMessage: "Reason",
          id: "4Ahswu",
          description: "Label for the reason why a candidate is being removed",
        })}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        items={sortLocalizedEnumOptions(
          ENUM_SORT_ORDER.REMOVAL_REASON,
          narrowEnumType(reasons, "CandidateRemovalReason"),
        ).map((reason) => ({
          value: reason.value,
          label:
            reason.label.localized ??
            intl.formatMessage(commonMessages.notAvailable),
        }))}
      />
      {reason === CandidateRemovalReason.Other && (
        <TextArea
          id="removalReasonOther"
          name="removalReasonOther"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          label={getLocalizedEnumStringByValue(
            CandidateRemovalReason.Other,
            reasons,
            intl,
          )}
        />
      )}
    </>
  );
};
