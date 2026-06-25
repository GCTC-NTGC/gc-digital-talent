import { useIntl } from "react-intl";
import type { OperationContext } from "urql";
import { useQuery } from "urql";

import { Combobox } from "@gc-digital-talent/forms";
import { commonMessages, narrowEnumType } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { graphql } from "@gc-digital-talent/graphql";

import type { CommonFilterDialogProps } from "~/components/FilterDialog/FilterDialog";
import FilterDialog from "~/components/FilterDialog/FilterDialog";

import type { FormValues } from "./utils";

const TalentRequestTrackedUsersFilterData_Query = graphql(/* GraphQL */ `
  query TalentRequestTrackedUsersFilterData {
    statuses: localizedEnumOptions(enumName: "TalentRequestTrackedUserStatus") {
      ... on LocalizedTalentRequestTrackedUserStatus {
        value
        label {
          localized
        }
      }
    }
  }
`);

const context: Partial<OperationContext> = {
  requestPolicy: "cache-first",
};

type TalentRequestTrackedUsersFilterDialogProps =
  CommonFilterDialogProps<FormValues>;

const TalentRequestTrackedUsersFilterDialog = ({
  onSubmit,
  resetValues,
  initialValues,
}: TalentRequestTrackedUsersFilterDialogProps) => {
  const intl = useIntl();

  const [{ data, fetching }] = useQuery({
    query: TalentRequestTrackedUsersFilterData_Query,
    context,
  });

  const notAvailable = intl.formatMessage(commonMessages.notAvailable);
  const statusOptions = narrowEnumType(
    unpackMaybes(data?.statuses),
    "TalentRequestTrackedUserStatus",
  ).map((status) => ({
    value: status.value,
    label: status.label?.localized ?? notAvailable,
  }));

  return (
    <FilterDialog<FormValues>
      {...{ onSubmit, resetValues }}
      options={{ defaultValues: initialValues }}
    >
      <Combobox
        id="status"
        name="status"
        isMulti
        fetching={fetching}
        label={intl.formatMessage(commonMessages.status)}
        options={statusOptions}
      />
    </FilterDialog>
  );
};

export default TalentRequestTrackedUsersFilterDialog;
