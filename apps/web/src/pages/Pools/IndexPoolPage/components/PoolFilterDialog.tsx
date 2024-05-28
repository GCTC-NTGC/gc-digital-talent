import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { Combobox, enumToOptions } from "@gc-digital-talent/forms";
import {
  PoolStatus,
  PoolStream,
  PublishingGroup,
  Scalars,
  graphql,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  getPoolStatus,
  getPoolStream,
  getPublishingGroup,
} from "@gc-digital-talent/i18n";

import FilterDialog, {
  CommonFilterDialogProps,
} from "~/components/FilterDialog/FilterDialog";
import adminMessages from "~/messages/adminMessages";

export type FormValues = {
  publishingGroups: PublishingGroup[];
  statuses: PoolStatus[];
  classifications: Scalars["UUID"]["output"][];
  streams: PoolStream[];
};

const PoolFilterDialog_Query = graphql(/* GraphQL */ `
  query PoolFilterDialog {
    classifications {
      group
      level
    }
  }
`);

const PoolFilterDialog = ({
  onSubmit,
  resetValues,
  initialValues,
}: CommonFilterDialogProps<FormValues>) => {
  const intl = useIntl();
  const [{ data, fetching }] = useQuery({
    query: PoolFilterDialog_Query,
  });

  return (
    <FilterDialog<FormValues>
      options={{ defaultValues: initialValues }}
      {...{ resetValues, onSubmit }}
    >
      <div
        data-h2-display="base(grid)"
        data-h2-gap="base(x1)"
        data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
      >
        <Combobox
          id="publishingGroups"
          name="publishingGroups"
          isMulti
          label={intl.formatMessage(adminMessages.publishingGroups)}
          options={enumToOptions(PublishingGroup).map(({ value }) => ({
            value,
            label: intl.formatMessage(getPublishingGroup(value)),
          }))}
        />{" "}
        <Combobox
          id="statuses"
          name="statuses"
          isMulti
          label={intl.formatMessage(commonMessages.status)}
          options={enumToOptions(PoolStatus).map(({ value }) => ({
            value,
            label: intl.formatMessage(getPoolStatus(value)),
          }))}
        />
        <Combobox
          id="streams"
          name="streams"
          isMulti
          label={intl.formatMessage(adminMessages.streams)}
          options={enumToOptions(PoolStream).map(({ value }) => ({
            value,
            label: intl.formatMessage(getPoolStream(value)),
          }))}
        />{" "}
        <Combobox
          id="classifications"
          name="classifications"
          {...{ fetching }}
          isMulti
          label={intl.formatMessage(adminMessages.classifications)}
          options={unpackMaybes(data?.classifications).map(
            ({ group, level }) => ({
              value: `${group}-${level}`,
              label: `${group}-0${level}`,
            }),
          )}
        />
      </div>
    </FilterDialog>
  );
};

export default PoolFilterDialog;
