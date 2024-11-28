import { useIntl } from "react-intl";

import { Combobox, localizedEnumToOptions } from "@gc-digital-talent/forms";
import {
  FragmentType,
  PoolStatus,
  PublishingGroup,
  Scalars,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";

import FilterDialog, {
  CommonFilterDialogProps,
} from "~/components/FilterDialog/FilterDialog";
import adminMessages from "~/messages/adminMessages";

export interface FormValues {
  publishingGroups: PublishingGroup[];
  statuses: PoolStatus[];
  classifications: Scalars["UUID"]["output"][];
  workStreams: Scalars["UUID"]["output"][];
}

const PoolFilterDialogOptions_Fragment = graphql(/* GraphQL */ `
  fragment PoolFilterDialogOptions on Query {
    classifications {
      group
      level
    }
    workStreams {
      id
      name {
        en
        fr
      }
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
          id="workStreams"
          name="workStreams"
          isMulti
          label={intl.formatMessage(adminMessages.streams)}
          options={unpackMaybes(data?.workStreams).map((workStream) => ({
            value: workStream.id,
            label: getLocalizedName(workStream.name, intl),
          }))}
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
