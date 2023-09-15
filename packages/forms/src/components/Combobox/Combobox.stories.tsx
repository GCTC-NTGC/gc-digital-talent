import React from "react";
import type { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { getStaticSkills } from "@gc-digital-talent/fake-data";

import BasicForm from "../BasicForm";
import Submit from "../Submit";
import Combobox, { ComboboxProps } from "./Combobox";
import { Option } from "./types";

const skills = getStaticSkills().map((skill) => ({
  value: skill.id,
  label: skill.name.en,
}));

const defaultArgs = {
  name: "skill",
  label: "Find a skill",
  options: skills,
};

type ComboboxType = ComboboxProps & {
  mockSearch?: (term: string) => Promise<Option[]>;
  defaultValue?: string;
};

export default {
  component: Combobox,
  title: "Form/Combobox",
};

const Template: StoryFn<ComboboxType> = (args) => {
  const { mockSearch, defaultValue, options, ...rest } = args;
  const [isSearching, setIsSearching] = React.useState<boolean>(false);
  const [filteredOptions, setFilteredOptions] =
    React.useState<Option[]>(options);

  const handleSearch = React.useMemo(() => {
    return mockSearch
      ? (term: string) => {
          setIsSearching(true);
          mockSearch(term)
            .then((newOptions) => {
              setFilteredOptions(newOptions);
            })
            .finally(() => {
              setIsSearching(false);
            });
        }
      : undefined;
  }, [mockSearch]);

  return (
    <BasicForm
      onSubmit={action("onSubmit")}
      options={{ defaultValues: { skill: defaultValue ?? "" } }}
    >
      <Combobox
        {...rest}
        onSearch={handleSearch}
        fetching={isSearching}
        options={mockSearch ? filteredOptions : options}
      />
      <p data-h2-margin-top="base(x1)">
        <Submit />
      </p>
    </BasicForm>
  );
};

export const Default = Template.bind({});
Default.args = defaultArgs;

export const Loading = Template.bind({});
Loading.args = {
  ...defaultArgs,
  fetching: true,
};

export const APIDriven = Template.bind({});
APIDriven.args = {
  ...defaultArgs,
  isExternalSearch: true,
  mockSearch: async (term: string): Promise<Option[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredOptions = defaultArgs.options.filter((option) => {
          return option.label
            ?.toLocaleString()
            .toLowerCase()
            .includes(term.toLowerCase());
        });
        resolve(filteredOptions);
      }, 1000);
    });
  },
};

export const Required = Template.bind({});
Required.args = {
  ...defaultArgs,
  rules: { required: "This field is required" },
};

export const DefaultValue = Template.bind({});
DefaultValue.args = {
  ...defaultArgs,
  defaultValue: skills[0].value,
};
