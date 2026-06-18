import { useIntl, type IntlShape } from "react-intl";
import { gql, useQuery } from "urql";

import type {
  TalentRequestTrackedUserNotReferredReason,
  TalentRequestTrackedUserNotSelectedReason,
} from "@gc-digital-talent/graphql";
import { BasicForm, Select } from "@gc-digital-talent/forms";
import { Button, Dialog } from "@gc-digital-talent/ui";
import {
  errorMessages,
  formMessages,
  uiMessages,
} from "@gc-digital-talent/i18n";

const labels = (intl: IntlShape) => ({
  notReferredReason: intl.formatMessage({
    defaultMessage: "Not referred reason",
    id: "pIbTze",
    description: "Label for the not referred reason select field",
  }),
  notSelectedReason: intl.formatMessage({
    defaultMessage: "Not selected reason",
    id: "s8WaQk",
    description: "Label for the not selected reason select field",
  }),
});

export const ChangeTrackedUserStatus_Query = gql`
  query ChangeTrackedUserStatus {
    notReferredReasons: localizedEnumStrings(
      enumName: "TalentRequestTrackedUserNotReferredReason"
    ) {
      value
      label {
        localized
      }
    }
    notSelectedReasons: localizedEnumStrings(
      enumName: "TalentRequestTrackedUserNotSelectedReason"
    ) {
      value
      label {
        localized
      }
    }
  }
`;

interface FormValues {
  reason:
    | TalentRequestTrackedUserNotReferredReason
    | TalentRequestTrackedUserNotSelectedReason;
}

interface ChangeTrackedUserStatusData {
  notReferredReasons:
    | {
        value: TalentRequestTrackedUserNotReferredReason;
        label?: {
          localized?: string | null;
        } | null;
      }[]
    | null;
  notSelectedReasons:
    | {
        value: TalentRequestTrackedUserNotSelectedReason;
        label?: {
          localized?: string | null;
        } | null;
      }[]
    | null;
}

export type StatusReasonType = "notReferred" | "notSelected";

interface ChangeStatusFormProps {
  reasonType: StatusReasonType;
  onUpdate: (
    reason:
      | TalentRequestTrackedUserNotReferredReason
      | TalentRequestTrackedUserNotSelectedReason,
  ) => Promise<void>;
  onCancel: () => void;
}

const ChangeStatusForm = ({
  reasonType,
  onUpdate,
  onCancel,
}: ChangeStatusFormProps) => {
  const intl = useIntl();
  const [{ data }] = useQuery<ChangeTrackedUserStatusData>({
    query: ChangeTrackedUserStatus_Query,
  });
  const isNotSelected = reasonType === "notSelected";
  const reasonLabel = isNotSelected
    ? labels(intl).notSelectedReason
    : labels(intl).notReferredReason;
  const reasons = isNotSelected
    ? (data?.notSelectedReasons ?? [])
    : (data?.notReferredReasons ?? []);
  const reasonOptions = reasons.map((reason) => ({
    value: reason.value,
    label: reason.label?.localized ?? reason.value,
  }));

  const handleSubmit = (values: FormValues) => {
    return onUpdate(values.reason);
  };

  return (
    <BasicForm labels={labels(intl)} onSubmit={handleSubmit}>
      <Select
        id="reason"
        name="reason"
        label={reasonLabel}
        nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
        rules={{ required: intl.formatMessage(errorMessages.required) }}
        options={reasonOptions}
      />
      <Dialog.Footer>
        <Button type="submit" color="primary">
          {intl.formatMessage(formMessages.saveChanges)}
        </Button>
        <Button type="button" mode="inline" color="warning" onClick={onCancel}>
          {intl.formatMessage(formMessages.cancelGoBack)}
        </Button>
      </Dialog.Footer>
    </BasicForm>
  );
};

export default ChangeStatusForm;
