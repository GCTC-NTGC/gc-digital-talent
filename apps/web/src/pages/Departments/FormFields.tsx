import { useIntl } from "react-intl";

import {
  DepartmentSize,
  FragmentType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { errorMessages, uiMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import Input from "@gc-digital-talent/forms/Input";
import Checklist from "@gc-digital-talent/forms/Checklist";
import Select from "@gc-digital-talent/forms/Select";
import { localizedEnumToOptions } from "@gc-digital-talent/forms/utils";

import adminMessages from "~/messages/adminMessages";

import labels from "./labels";

export const DepartmentFormOptions_Fragment = graphql(/* GraphQL */ `
  fragment DepartmentFormOptions on Query {
    departmentSize: localizedEnumStrings(enumName: "DepartmentSize") {
      value
      label {
        localized
      }
    }
  }
`);

interface FormFieldsProps {
  optionsQuery?: FragmentType<typeof DepartmentFormOptions_Fragment>;
}

const FormFields = ({ optionsQuery }: FormFieldsProps) => {
  const intl = useIntl();
  const options = getFragment(DepartmentFormOptions_Fragment, optionsQuery);

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="p-tablet(repeat(2, 1fr))"
      data-h2-gap="base(x1)"
    >
      <Input
        id="name_en"
        name="name.en"
        autoComplete="off"
        label={intl.formatMessage(adminMessages.nameEn)}
        type="text"
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
      />
      <Input
        id="name_fr"
        name="name.fr"
        autoComplete="off"
        label={intl.formatMessage(adminMessages.nameFr)}
        type="text"
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
      />
      <Input
        id="departmentNumber"
        name="departmentNumber"
        label={intl.formatMessage(labels.departmentNumber)}
        type="number"
        min="0"
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
      />
      <Input
        id="orgIdentifier"
        name="orgIdentifier"
        label={intl.formatMessage(labels.orgIdentifier)}
        type="number"
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        min="0"
      />
      <div data-h2-grid-column="p-tablet(span 2)">
        <Checklist
          idPrefix="departmentType"
          id="departmentType"
          name="departmentType"
          legend={intl.formatMessage(labels.departmentType)}
          items={[
            {
              value: "isCorePublicAdministration",
              label: intl.formatMessage(labels.corePublicAdmin),
            },
            {
              value: "isCentralAgency",
              label: intl.formatMessage(labels.centralAgency),
            },
            {
              value: "isScience",
              label: intl.formatMessage(labels.science),
            },
            {
              value: "isRegulatory",
              label: intl.formatMessage(labels.regulatory),
            },
          ]}
        />
      </div>
      <Select
        id="size"
        name="size"
        label={intl.formatMessage(labels.departmentSize)}
        nullSelection={intl.formatMessage(uiMessages.nullSelectionOption)}
        rules={{ required: intl.formatMessage(errorMessages.required) }}
        doNotSort
        options={localizedEnumToOptions(
          unpackMaybes(options?.departmentSize),
          intl,
          [
            DepartmentSize.Micro,
            DepartmentSize.Small,
            DepartmentSize.Medium,
            DepartmentSize.Large,
          ],
        )}
      />
    </div>
  );
};

export default FormFields;
