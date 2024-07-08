import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { Combobox, localizedEnumToOptions } from "@gc-digital-talent/forms";
import {
  PoolStatus,
  PoolStream,
  PublishingGroup,
  Scalars,
  graphql,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";

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
    publishingGroups: localizedEnumStrings(enumName: "PublishingGroup") {
      value
      label {
        en
        fr
      }
    }
    statuses: localizedEnumStrings(enumName: "PoolStatus") {
      value
      label {
        en
        fr
      }
    }
    streams: localizedEnumStrings(enumName: "PoolStream") {
      value
      label {
        en
        fr
      }
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
          fetching={fetching}
          label={intl.formatMessage(adminMessages.publishingGroups)}
          options={localizedEnumToOptions(data?.publishingGroups, intl)}
        />
        <Combobox
          id="statuses"
          name="statuses"
          isMulti
          label={intl.formatMessage(commonMessages.status)}
          options={localizedEnumToOptions(data?.statuses, intl)}
        />
        <Combobox
          id="streams"
          name="streams"
          isMulti
          label={intl.formatMessage(adminMessages.streams)}
          options={localizedEnumToOptions(data?.streams, intl)}
        />
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
