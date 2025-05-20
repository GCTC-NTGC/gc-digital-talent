import { useState, useMemo } from "react";
import debounce from "lodash/debounce";
import type { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { faker } from "@faker-js/faker/locale/en";

import { getStaticSkills } from "@gc-digital-talent/fake-data";
import { allModes } from "@gc-digital-talent/storybook-helpers";

import BasicForm from "../BasicForm";
import Submit from "../Submit/Submit";
import Combobox, { ComboboxProps } from "./Combobox";
import { Option } from "./types";

faker.seed(0);

const skills = getStaticSkills().map((skill) => ({
  value: skill.id,
  label: skill.name.en ?? "Not found",
}));

const defaultArgs = {
  name: "skill",
  label: "Find a skill",
  options: skills,
};

const defaultMultiArgs = {
  ...defaultArgs,
  isMulti: true,
};

type ComboboxType = ComboboxProps & {
  mockSearch?: (term: string) => Promise<Option[]>;
  defaultValue?: string | string[];
};

export default {
  component: Combobox,
};

const Template: StoryFn<ComboboxType> = (args) => {
  const { mockSearch, defaultValue, options, fetching, ...rest } = args;
  const [isSearching, setIsSearching] = useState<boolean>(fetching ?? false);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);

  const handleSearch = useMemo(() => {
    return mockSearch
      ? (term: string) => {
          setIsSearching(true);
          setFilteredOptions([]);
          mockSearch(term)
            .then((newOptions) => {
              setFilteredOptions(newOptions);
            })
            .catch((err) => action("error")(err))
            .finally(() => {
              setIsSearching(false);
            });
        }
      : undefined;
  }, [mockSearch]);

  const debouncedSearch = handleSearch
    ? debounce(handleSearch, 300)
    : undefined;

  return (
    <BasicForm
      onSubmit={action("onSubmit")}
      options={{ defaultValues: { skill: defaultValue ?? "" } }}
    >
      <Combobox
        {...rest}
        onSearch={debouncedSearch}
        fetching={isSearching}
        options={mockSearch ? filteredOptions : options}
      />
      <Submit data-h2-margin-top="base(x1)" />
    </BasicForm>
  );
};

export const Default = Template.bind({});
Default.args = defaultArgs;

Default.parameters = {
  chromatic: {
    modes: {
      light: allModes.light,
      dark: allModes.dark,
    },
  },
};

export const Loading = Template.bind({});
Loading.args = {
  ...defaultArgs,
  fetching: true,
  options: [],
};

export const APIDriven = Template.bind({});
APIDriven.args = {
  ...defaultArgs,
  isExternalSearch: true,
  total: defaultArgs.options.length,
  mockSearch: async (term: string): Promise<Option[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredOptions =
          term.length > 0
            ? defaultArgs.options.filter((option) => {
                return option.label
                  ?.toLocaleString()
                  .toLowerCase()
                  .includes(term.toLowerCase());
              })
            : defaultArgs.options;
        resolve(filteredOptions);
      }, 1000);
    });
  },
};

export const Required = Template.bind({});
Required.args = {
  ...defaultArgs,
  rules: { required: "This field is required" },
  context: "This field should error if nothing is selected.",
};

export const DefaultValue = Template.bind({});
DefaultValue.args = {
  ...defaultArgs,
  defaultValue: skills[0].value,
};

export const MultiDefault = Template.bind({});
MultiDefault.args = {
  ...defaultMultiArgs,
  defaultValue: faker.helpers
    .arrayElements(skills, 10)
    .map((skill) => skill.value),
};

export const MultiMinMax = Template.bind({});
MultiMinMax.args = {
  ...defaultMultiArgs,
  context: "Select between 1 and 3 items.",
  defaultValue: [],
  rules: {
    min: {
      value: 1,
      message: "Select at least 1 skill",
    },
    max: {
      value: 3,
      message: "Select 3 or fewer skills",
    },
  },
};
