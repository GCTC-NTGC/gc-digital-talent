import { useIntl } from "react-intl";
import type { OperationContext } from "urql";
import { useQuery } from "urql";

import { Combobox } from "@gc-digital-talent/forms";
import {
  commonMessages,
  ENUM_SORT_ORDER,
  narrowEnumType,
  sortLocalizedEnumOptions,
} from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { graphql } from "@gc-digital-talent/graphql";

import adminMessages from "~/messages/adminMessages";
import type { CommonFilterDialogProps } from "~/components/FilterDialog/FilterDialog";
import FilterDialog from "~/components/FilterDialog/FilterDialog";

import type { FormValues } from "./utils";

const TalentRequestFilterData_Query = graphql(/* GraphQL */ `
  query TalentRequestFilterData {
    classifications {
      id
      groupAndLevel
    }
    departments {
      id
      departmentNumber
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
    statuses: localizedEnumOptions(enumName: "TalentRequestStatus") {
      ... on LocalizedTalentRequestStatus {
        value
        label {
          localized
        }
      }
    }
  }
`);

const context: Partial<OperationContext> = {
  additionalTypenames: ["Classification", "Department"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
  requestPolicy: "cache-first",
};

type TalentRequestFilterDialogProps = CommonFilterDialogProps<FormValues>;

const TalentRequestFilterDialog = ({
  onSubmit,
  resetValues,
  initialValues,
}: TalentRequestFilterDialogProps) => {
  const intl = useIntl();

  const [{ data, fetching }] = useQuery({
    query: TalentRequestFilterData_Query,
    context,
  });

  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  return (
    <FilterDialog<FormValues>
      {...{ onSubmit, resetValues }}
      options={{ defaultValues: initialValues }}
    >
      <div className="grid gap-6 xs:grid-cols-2">
        <Combobox
          id="status"
          name="status"
          isMulti
          label={intl.formatMessage(commonMessages.status)}
          doNotSort
          fetching={fetching}
          options={sortLocalizedEnumOptions(
            ENUM_SORT_ORDER.TALENT_REQUEST_STATUS,
            narrowEnumType(unpackMaybes(data?.statuses), "TalentRequestStatus"),
          ).map((status) => ({
            value: status.value,
            label:
              status.label?.localized ??
              intl.formatMessage(commonMessages.notAvailable),
          }))}
        />
        <Combobox
          id="departments"
          name="departments"
          {...{ fetching }}
          isMulti
          label={intl.formatMessage(adminMessages.departments)}
          options={unpackMaybes(data?.departments).map((department) => ({
            value: department.id,
            label: department.name.localized ?? notAvailable,
          }))}
        />
        <Combobox
          id="classifications"
          name="classifications"
          {...{ fetching }}
          isMulti
          label={intl.formatMessage(adminMessages.classifications)}
          options={unpackMaybes(data?.classifications).map(
            ({ id, groupAndLevel }) => ({
              value: id,
              label: groupAndLevel,
            }),
          )}
        />
        <Combobox
          id="workStreams"
          name="workStreams"
          isMulti
          label={intl.formatMessage(adminMessages.streams)}
          options={unpackMaybes(data?.workStreams).map((workStream) => ({
            value: workStream.id,
            label: workStream.name?.localized ?? notAvailable,
          }))}
        />
      </div>
    </FilterDialog>
  );
};

export default TalentRequestFilterDialog;
