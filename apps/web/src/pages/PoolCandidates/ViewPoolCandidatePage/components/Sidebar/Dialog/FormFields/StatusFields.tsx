import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

import {
  ApplicationStatus,
  CandidateRemovalReason,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { DateInput, RadioGroup, TextArea } from "@gc-digital-talent/forms";
import {
  commonMessages,
  ENUM_SORT_ORDER,
  errorMessages,
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

import applicationMessages from "~/messages/applicationMessages";

import { FormValues } from "../types";
import JobPlacementFormFields from "../FormFields/JobPlacementFormFields";

const QualifiedFieldsOptions_Fragment = graphql(/** GraphQL */ `
  fragment QualifiedFieldsOptions on Query {
    ...JobPlacementFormFields
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
  const status = watch("status");

  if (status !== ApplicationStatus.Qualified) return null;

  const canPlace = hasRequiredRoles({
    toCheck: [{ name: ROLE_NAME.CommunityRecruiter }],
    userRoles: unpackMaybes(userAuthInfo?.roleAssignments),
  });

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

      {canPlace && <JobPlacementFormFields query={options} />}
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
  const [status, removalReason] = watch(["status", "removalReason"]);

  if (status !== ApplicationStatus.Removed) return null;

  return (
    <>
      <RadioGroup
        idPrefix="removalReason"
        name="removalReason"
        legend={intl.formatMessage(applicationMessages.reason)}
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        items={sortLocalizedEnumOptions(
          ENUM_SORT_ORDER.REMOVAL_REASON,
          narrowEnumType(
            unpackMaybes(options?.removalReasons),
            "CandidateRemovalReason",
          ),
        ).map((reason) => ({
          value: reason.value,
          label:
            reason.label.localized ??
            intl.formatMessage(commonMessages.notAvailable),
        }))}
      />
      {removalReason === CandidateRemovalReason.Other && (
        <TextArea
          id="removalReasonOther"
          name="removalReasonOther"
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          label={intl.formatMessage({
            defaultMessage: "Other reason",
            id: "aLAl+r",
            description: "Label for the other reason a decision was made",
          })}
        />
      )}
    </>
  );
};
