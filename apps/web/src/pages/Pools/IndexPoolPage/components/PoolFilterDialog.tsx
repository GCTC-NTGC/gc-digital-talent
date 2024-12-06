import { useIntl } from "react-intl";

import { Combobox, localizedEnumToOptions } from "@gc-digital-talent/forms";
import {
  FragmentType,
  PoolStatus,
  PoolStream,
  PublishingGroup,
  Scalars,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages } from "@gc-digital-talent/i18n";

import FilterDialog, {
  CommonFilterDialogProps,
} from "~/components/FilterDialog/FilterDialog";
import adminMessages from "~/messages/adminMessages";

export interface FormValues {
  publishingGroups: PublishingGroup[];
  statuses: PoolStatus[];
  classifications: Scalars["UUID"]["output"][];
  streams: PoolStream[];
}

const PoolFilterDialogOptions_Fragment = graphql(/* GraphQL */ `
  fragment PoolFilterDialogOptions on Query {
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
  optionsQuery,
}: CommonFilterDialogProps<
  FormValues,
  FragmentType<typeof PoolFilterDialogOptions_Fragment>
>) => {
  const intl = useIntl();
  const data = getFragment(PoolFilterDialogOptions_Fragment, optionsQuery);

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
