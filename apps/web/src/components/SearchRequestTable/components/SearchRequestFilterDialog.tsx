import { useIntl } from "react-intl";
import type { OperationContext } from "urql";
import { useQuery } from "urql";

import { Combobox } from "@gc-digital-talent/forms";
import {
  commonMessages,
  ENUM_SORT_ORDER,
  getLocalizedName,
  narrowEnumType,
  sortLocalizedEnumOptions,
} from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { getFragment, graphql } from "@gc-digital-talent/graphql";

import adminMessages from "~/messages/adminMessages";
import type { CommonFilterDialogProps } from "~/components/FilterDialog/FilterDialog";
import FilterDialog from "~/components/FilterDialog/FilterDialog";

import type { FormValues } from "./utils";

const RequestFilterDepartment_Fragment = graphql(/* GraphQL */ `
  fragment RequestFilterDepartment on Department {
    id
    departmentNumber
    name {
      en
      fr
    }
  }
`);

const RequestFilterClassification_Fragment = graphql(/* GraphQL */ `
  fragment RequestFilterClassification on Classification {
    id
    groupAndLevel
  }
`);

const SearchRequestFilterData_Query = graphql(/* GraphQL */ `
  query SearchRequestFilterData {
    departments {
      ...RequestFilterDepartment
    }
    classifications {
      ...RequestFilterClassification
    }
    statuses: localizedEnumOptions(enumName: "TalentRequestStatus") {
      ... on LocalizedTalentRequestStatus {
        value
        label {
          localized
        }
      }
    }
    workStreams {
      id
      name {
        en
        fr
      }
    }
  }
`);

const context: Partial<OperationContext> = {
  additionalTypenames: ["Classification", "Department"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
  requestPolicy: "cache-first",
};

type SearchRequestFilterDialogProps = CommonFilterDialogProps<FormValues>;

const SearchRequestFilterDialog = ({
  onSubmit,
  resetValues,
  initialValues,
}: SearchRequestFilterDialogProps) => {
  const intl = useIntl();

  const [{ data, fetching }] = useQuery({
    query: SearchRequestFilterData_Query,
    context,
  });

  const departments = getFragment(
    RequestFilterDepartment_Fragment,
    unpackMaybes(data?.departments),
  );
  const classifications = getFragment(
    RequestFilterClassification_Fragment,
    unpackMaybes(data?.classifications),
  );

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
          options={departments.map((department) => ({
            value: department.id,
            label: getLocalizedName(department.name, intl),
          }))}
        />
        <Combobox
          id="classifications"
          name="classifications"
          {...{ fetching }}
          isMulti
          label={intl.formatMessage(adminMessages.classifications)}
          options={classifications.map(({ id, groupAndLevel }) => ({
            value: id,
            label: groupAndLevel,
          }))}
        />
        <Combobox
          id="workStreams"
          name="workStreams"
          isMulti
          label={intl.formatMessage(adminMessages.streams)}
          options={unpackMaybes(data?.workStreams).map((workStream) => ({
            value: workStream.id,
            label: getLocalizedName(workStream?.name, intl),
          }))}
        />
      </div>
    </FilterDialog>
  );
};

export default SearchRequestFilterDialog;
