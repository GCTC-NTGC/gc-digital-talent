import { useIntl } from "react-intl";
import { useQuery } from "urql";

import {
  ActivityEvent,
  graphql,
  Maybe,
  Scalars,
} from "@gc-digital-talent/graphql";
import { commonMessages, narrowEnumType } from "@gc-digital-talent/i18n";
import { Heading } from "@gc-digital-talent/ui";
import { Combobox, DateInput } from "@gc-digital-talent/forms";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import FilterDialog, {
  CommonFilterDialogProps,
} from "~/components/FilterDialog/FilterDialog";

import CandidatesFilterInput from "./CandidatesFilterInput";
import AssessmentMembersFilterInput from "./AssessmentMembersFilterInput";

export interface FormValues {
  startDate?: Maybe<Scalars["Date"]["input"]>;
  endDate?: Maybe<Scalars["Date"]["input"]>;
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

const PoolActivityFilterDialog = ({
  onSubmit,
  resetValues,
  initialValues,
}: PoolActivityFilterDialogProps) => {
  const intl = useIntl();

  const notAvailable = intl.formatMessage(commonMessages.notAvailable);

  const [{ data }] = useQuery({
    query: PoolActivityFilterData_Query,
  });

  return (
    <FilterDialog<FormValues>
      options={{ defaultValues: initialValues }}
      {...{ onSubmit, resetValues }}
      subtitle={intl.formatMessage({
        defaultMessage:
          "Narrow down the activity log results by using the following filters.",
        id: "Ga0bmb",
        description: "Subtitle for activity log filter dialog",
      })}
    >
      <AssessmentMembersFilterInput />
      <Heading level="h3" size="h5" className="mt-12 mb-6 font-bold">
        {intl.formatMessage({
          defaultMessage: "Date range",
          id: "kTCdxh",
          description: "Heading for a start and end date",
        })}
      </Heading>
      <div className="grid gap-6 sm:grid-cols-2">
        <DateInput
          name="startDate"
          id="startDate"
          legend={intl.formatMessage({
            defaultMessage: "From",
            id: "JG1ssQ",
            description: "Label for a start date input in a range",
          })}
        />
        <DateInput
          name="endDate"
          id="endDate"
          legend={intl.formatMessage({
            defaultMessage: "To",
            id: "w265XR",
            description: "Label for an end date input in a range",
          })}
        />
      </div>
      <Heading level="h3" size="h5" className="mt-12 mb-6 font-bold">
        {intl.formatMessage({
          defaultMessage: "Candidate details",
          id: "sty2no",
          description: "Heading for filters directly related to the candidates",
        })}
      </Heading>
      <CandidatesFilterInput />
      <Heading level="h3" size="h5" className="mt-12 mb-6 font-bold">
        {intl.formatMessage({
          defaultMessage: "Process details",
          id: "XQCxDQ",
          description: "Heading for filters directly related to the process",
        })}
      </Heading>
      <Combobox
        id="events"
        name="events"
        isMulti
        label={intl.formatMessage({
          defaultMessage: "Action",
          id: "9zjyN4",
          description: "Label for the action filter for activity log",
        })}
        options={narrowEnumType(
          unpackMaybes(data?.activityEvents),
          "ActivityEvent",
        ).map((activityEvent) => ({
          value: activityEvent.value,
          label: activityEvent.label.localized ?? notAvailable,
        }))}
      />
    </FilterDialog>
  );
};

export default PoolActivityFilterDialog;
