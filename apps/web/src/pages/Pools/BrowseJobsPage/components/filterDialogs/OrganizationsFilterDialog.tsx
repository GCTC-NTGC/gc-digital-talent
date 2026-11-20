import { type ReactNode } from "react";
import { useIntl } from "react-intl";

import { Combobox } from "@gc-digital-talent/forms";
import { commonMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  getFragment,
  graphql,
  type FragmentType,
} from "@gc-digital-talent/graphql";

import useBrowseJobsSearchParams from "../../useBrowseJobsSearchParams";
import FilterDialog from "./FilterDialog";

const OrganizationsFilterDialogOptions_Fragment = graphql(/* GraphQL */ `
  fragment OrganizationsFilterDialogOptions on Query {
    departments {
      id
      name {
        localized
      }
    }
  }
`);

interface FormValues {
  organizations: string[];
}

interface Props {
  optionsQuery: FragmentType<typeof OrganizationsFilterDialogOptions_Fragment>;
  children: ReactNode;
}

const OrganizationsFilterDialog = ({ optionsQuery, children }: Props) => {
  const intl = useIntl();
  const { departments } = getFragment(
    OrganizationsFilterDialogOptions_Fragment,
    optionsQuery,
  );
  const { getFilterValues, setFilters } = useBrowseJobsSearchParams();

  const organizationOptions = unpackMaybes(departments)
    .map((o) => ({
      value: o.id,
      label: o.name.localized ?? intl.formatMessage(commonMessages.notFound),
    }))
    .toSorted((a, b) => a.label.localeCompare(b.label));

  return (
    <FilterDialog<FormValues>
      title={intl.formatMessage({
        defaultMessage: "Organizations",
        id: "XmF74L",
        description: "Title for organizations filter dialog",
      })}
      subtitle={intl.formatMessage({
        defaultMessage: "Filter jobs by hiring organization.",
        id: "St94tY",
        description: "Subtitle for organizations filter dialog",
      })}
      trigger={children}
      getFormValues={() => ({
        organizations: getFilterValues("organizations"),
      })}
      onSave={(formValues) =>
        setFilters({ organizations: formValues.organizations })
      }
      onClear={() => setFilters({ organizations: null })}
    >
      <Combobox
        options={organizationOptions}
        id={"organizations"}
        label={intl.formatMessage({
          defaultMessage: "Hiring organizations",
          id: "LRR7iu",
          description: "Label for an organization picker",
        })}
        name={"organizations"}
        isMulti
      />
    </FilterDialog>
  );
};

export default OrganizationsFilterDialog;
