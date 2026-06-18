import { useIntl } from "react-intl";

import { Combobox, localizedEnumToOptions } from "@gc-digital-talent/forms";
import type {
  FragmentType,
  PoolStatus,
  PublishingGroup,
} from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";

import type { CommonFilterDialogProps } from "~/components/FilterDialog/FilterDialog";
import FilterDialog from "~/components/FilterDialog/FilterDialog";
import adminMessages from "~/messages/adminMessages";

export interface FormValues {
  publishingGroups: PublishingGroup[];
  statuses: PoolStatus[];
  classifications: string[];
  workStreams: string[];
}

const PoolFilterDialogOptions_Fragment = graphql(/* GraphQL */ `
  fragment PoolFilterDialogOptions on Query {
    classifications {
      group
      level
      groupAndLevel
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
    workStreams {
      id
      name {
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
      <div className="grid gap-6 xs:grid-cols-2">
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
            ({ group, level, groupAndLevel }) => ({
              value: `${group}-${level}`,
              label: groupAndLevel,
            }),
          )}
        />
      </div>
    </FilterDialog>
  );
};

export default PoolFilterDialog;
