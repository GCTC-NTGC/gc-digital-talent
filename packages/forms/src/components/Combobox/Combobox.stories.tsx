import React from "react";
import type { Story, Meta } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { getStaticSkills } from "@gc-digital-talent/fake-data";

import BasicForm from "../BasicForm";
import Submit from "../Submit";

import Combobox, { Option, ComboboxProps } from "./Combobox";

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
};

export default {
  component: Combobox,
  title: "Components/Combobox",
} as Meta<ComboboxType>;

const Template: Story<ComboboxType> = (args) => {
  const { mockSearch, options, ...rest } = args;
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
      options={{ defaultValues: { skill: "" } }}
    >
      <Combobox
        {...rest}
        onSearch={handleSearch}
        fetching={isSearching}
        options={mockSearch ? filteredOptions : options}
      />
      <Submit />
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
  mockSearch: async (term): Promise<Option[]> => {
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
