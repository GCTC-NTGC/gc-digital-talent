import React from "react";
import { useIntl } from "react-intl";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import uniqueId from "lodash/uniqueId";

import { fakeDepartments, fakePools } from "@gc-digital-talent/fake-data";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import BasicForm from "../BasicForm";
import Submit from "../Submit";
import MultiSelectField from "./MultiSelectField";

export default {
  component: MultiSelectField,
  title: "Form/MultiSelectField",
  decorators: [
    (Story) => {
      return (
        <BasicForm
          onSubmit={action("Submit Form")}
          options={{ defaultValues: { groups: [] } }}
        >
          {/* See: https://github.com/storybookjs/storybook/issues/12596#issuecomment-723440097 */}
          {Story() /* Can't use <Story /> for inline decorator. */}
          <Submit />
        </BasicForm>
      );
    },
  ],
} as ComponentMeta<typeof MultiSelectField>;

const Template: ComponentStory<typeof MultiSelectField> = (args) => {
  const intl = useIntl();
  const departments = fakeDepartments();
  const pools = fakePools();
  const groups = [
    {
      id: 1,
      label: {
        en: "Things",
        fr: "Choses",
      },
      options: [],
    },
    {
      id: 2,
      label: {
        en: "Departments",
        fr: "Ministères",
      },
      options: departments.map(({ id, name }) => ({
        value: id,
        label: getLocalizedName(name, intl) || "",
      })),
    },
    {
      id: 3,
      label: {
        en: "Pools",
        fr: "Bassins",
      },
      options: pools.map(({ id, name }) => ({
        value: id,
        label: getLocalizedName(name, intl) || "",
      })),
    },
  ];
  const groupOptions = groups.map((group) => ({
    label: getLocalizedName(group.label, intl),
    options: group.options,
  }));

  return <MultiSelectField {...args} options={groupOptions} />;
};

export const Default = Template.bind({});
Default.args = {
  id: uniqueId(),
  label: "Groups",
  name: "groups",
};

export const Required = Template.bind({});
Required.args = {
  ...Default.args,
  rules: { required: true },
};

export const RequiredWithCustomMessage = Template.bind({});
RequiredWithCustomMessage.args = {
  ...Default.args,
  rules: { required: "This must be accepted to continue." },
};

export const RequiredWithContextInfo = Template.bind({});
RequiredWithContextInfo.args = {
  ...Default.args,
  rules: { required: true },
  context: "We collect the above data for account purposes.",
};
