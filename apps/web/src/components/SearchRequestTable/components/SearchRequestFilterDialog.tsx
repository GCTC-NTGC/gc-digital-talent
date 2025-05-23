import { useIntl } from "react-intl";
import { OperationContext, useQuery } from "urql";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import Combobox from "@gc-digital-talent/forms/Combobox";
import { localizedEnumToOptions } from "@gc-digital-talent/forms/utils";

import adminMessages from "~/messages/adminMessages";
import FilterDialog, {
  CommonFilterDialogProps,
} from "~/components/FilterDialog/FilterDialog";

import { FormValues } from "./utils";

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
    name {
      en
      fr
    }
    group
    level
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
    searchStatuses: localizedEnumStrings(
      enumName: "PoolCandidateSearchStatus"
    ) {
      value
      label {
        en
        fr
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
      <div
        data-h2-display="base(grid)"
        data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
        data-h2-gap="base(x1)"
      >
        <Combobox
          id="status"
          name="status"
          isMulti
          label={intl.formatMessage(commonMessages.status)}
          doNotSort
          fetching={fetching}
          options={localizedEnumToOptions(data?.searchStatuses, intl)}
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
          options={classifications.map((classification) => ({
            value: classification.id,
            label: `${classification.group}-${classification.level < 10 ? "0" : ""}${classification.level}`,
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
