import { useIntl } from "react-intl";
import { useQuery } from "urql";

import {
  ActivityEvent,
  graphql,
  Maybe,
  Scalars,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Heading } from "@gc-digital-talent/ui";
import { DateInput } from "@gc-digital-talent/forms";

import FilterDialog, {
  CommonFilterDialogProps,
} from "~/components/FilterDialog/FilterDialog";

export interface FormValues {
  createdAt?: {
    start?: Maybe<Scalars["Date"]["input"]>;
    end?: Maybe<Scalars["Date"]["input"]>;
  };
  causers?: Scalars["UUID"]["input"][];
  candidates?: Scalars["UUID"]["input"][];
  events?: ActivityEvent[];
}

const PoolActivityFilterData_Query = graphql(/** GraphQL */ `
  query PoolActivityFilterData {
    activityEvents: localizedEnumOptions(enumName: "ActivityEvent") {
      ... on LocalizedActivityEvent {
        value
        label {
          localized
        }
      }
    }
  }
`);

type PoolActivityFilterDialogProps = CommonFilterDialogProps<FormValues>;

const PoolActiivtyFilterDialog = ({
  onSubmit,
  resetValues,
  initialValues,
}: PoolActivityFilterDialogProps) => {
  const intl = useIntl();
  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  const [{ data, fetching }] = useQuery({
    query: PoolActivityFilterData_Query,
  });

  return (
    <FilterDialog<FormValues>
      options={{ defaultValues: initialValues }}
      {...{ onSubmit, resetValues }}
    >
      <Heading level="h3" size="h5">
        {intl.formatMessage({
          defaultMessage: "Date range",
          id: "kTCdxh",
          description: "Heading for a start and end date",
        })}
      </Heading>
      <div className="gap:6 grid sm:grid-cols-2">
        <DateInput
          name="createdAt.start"
          id="startDate"
          legend={intl.formatMessage({
            defaultMessage: "From",
            id: "JG1ssQ",
            description: "Label for a start date input in a range",
          })}
        />
        <DateInput
          name="createdAt.end"
          id="endDate"
          legend={intl.formatMessage({
            defaultMessage: "To",
            id: "w265XR",
            description: "Label for an end date input in a range",
          })}
        />
      </div>
    </FilterDialog>
  );
};

export default PoolActiivtyFilterDialog;
