import React from "react";
import { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import uniqueId from "lodash/uniqueId";
import { useIntl } from "react-intl";

import { fakeDepartments, fakePools } from "@gc-digital-talent/fake-data";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import Form from "../BasicForm";
import Submit from "../Submit";
import Select from "./Select";
import { OptGroup, Option } from "../../types";

import type { SelectProps } from ".";

export default {
  component: Select,
  title: "Form/Select",
  argTypes: {
    contextToggleHandler: {
      table: {
        disable: true,
      },
    },
  },
};

const themes = ["light", "dark"];

const Template: StoryFn<SelectProps> = (args) => {
  const intl = useIntl();
  const departments = fakeDepartments();
  const departmentOptions: Option[] = departments.map(({ id, name }) => ({
    value: id,
    label: getLocalizedName(name, intl) || "",
  }));
  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="base(100%) l-tablet(50% 50%)"
    >
      {themes.map((theme) => (
        <div data-h2={theme} key={theme}>
          <div data-h2-background="base(background)" data-h2-padding="base(x2)">
            <Form
              onSubmit={action("Submit Form")}
              options={{ defaultValues: { groups: "" } }}
            >
              <Select {...args} options={departmentOptions} />
              <p data-h2-margin-top="base(x1)">
                <Submit />
              </p>
            </Form>
          </div>
        </div>
      ))}
    </div>
  );
};

const TemplateGroups: StoryFn<SelectProps> = (args) => {
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
  const groupOptions: OptGroup[] = groups.map((group) => ({
    value: group.id,
    label: getLocalizedName(group.label, intl),
    options: group.options,
  }));

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="base(100%) l-tablet(50% 50%)"
    >
      {themes.map((theme) => (
        <div data-h2={theme} key={theme}>
          <div data-h2-background="base(background)" data-h2-padding="base(x2)">
            <Form
              onSubmit={action("Submit Form")}
              options={{ defaultValues: { groups: "" } }}
            >
              <div>
                <Select {...args} options={groupOptions} />
                <p data-h2-margin-top="base(x1)">
                  <Submit />
                </p>
              </div>
            </Form>
          </div>
        </div>
      ))}
    </div>
  );
};

export const SelectDefault = Template.bind({});
SelectDefault.args = {
  id: uniqueId(),
  label: "Departments",
  name: "departments",
  nullSelection: "Select an option",
};

export const SelectWithGroups = TemplateGroups.bind({});
SelectWithGroups.args = {
  ...SelectDefault.args,
  label: "Groups",
  name: "groups",
};

export const SelectRequired = Template.bind({});
SelectRequired.args = {
  ...SelectDefault.args,
  rules: { required: "This must be accepted to continue." },
};

export const SelectRequiredWithInfo = Template.bind({});
SelectRequiredWithInfo.args = {
  ...SelectDefault.args,
  context: "We collect the above data for account purposes.",
  rules: { required: "This must be accepted to continue." },
};

export const SelectRequiredWithError = Template.bind({});
SelectRequiredWithError.args = {
  ...SelectDefault.args,
  rules: { required: "This must be accepted to continue." },
};

export const SelectRequiredWithErrorAndContext = Template.bind({});
SelectRequiredWithErrorAndContext.args = {
  ...SelectDefault.args,
  context: "We collect the above data for account purposes.",
  rules: { required: "This must be accepted to continue." },
};

export const SelectLabelElement = Template.bind({});
SelectLabelElement.args = {
  ...SelectDefault.args,
  label: <span data-h2-font-weight="base(700)">Bold Label</span>,
  name: "LabelElement",
};
