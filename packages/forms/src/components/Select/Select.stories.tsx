import { StoryFn } from "@storybook/react";
import { action } from "storybook/actions";
import uniqueId from "lodash/uniqueId";
import { useIntl } from "react-intl";

import { fakeDepartments, fakePools } from "@gc-digital-talent/fake-data";
import { getLocalizedName } from "@gc-digital-talent/i18n";
import { allModes } from "@gc-digital-talent/storybook-helpers";

import Form from "../BasicForm";
import Submit from "../Submit";
import Select, { type SelectProps } from "./Select";
import { OptGroup, Option } from "../../types";

export default {
  component: Select,
  argTypes: {
    contextToggleHandler: {
      table: {
        disable: true,
      },
    },
  },
};

const Template: StoryFn<SelectProps> = (args) => {
  const intl = useIntl();
  const departments = fakeDepartments();
  const departmentOptions: Option[] = departments.map(({ id, name }) => ({
    value: id,
    label: getLocalizedName(name, intl) || "",
  }));
  return (
    <Form
      onSubmit={action("Submit Form")}
      options={{ defaultValues: { groups: "" } }}
    >
      <Select {...args} options={departmentOptions} />
      <Submit data-h2-margin-top="base(x1)" />
    </Form>
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
        en: "Processes",
        fr: "Processus",
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
  );
};

export const Default = Template.bind({});
Default.args = {
  id: uniqueId(),
  label: "Departments",
  name: "departments",
  nullSelection: "Select an option",
};
Default.parameters = {
  chromatic: {
    modes: {
      light: allModes.light,
      "light mobile": allModes["light mobile"],
      dark: allModes.dark,
    },
  },
};

export const WithGroups = TemplateGroups.bind({});
WithGroups.args = {
  ...Default.args,
  label: "Groups",
  name: "groups",
};

export const RequiredWithErrorAndContext = Template.bind({});
RequiredWithErrorAndContext.args = {
  ...Default.args,
  context: "We collect the above data for account purposes.",
  rules: { required: "This must be accepted to continue." },
};
