import React from "react";
import debounce from "lodash/debounce";
import type { StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { faker } from "@faker-js/faker";

import { getStaticSkills } from "@gc-digital-talent/fake-data";

import BasicForm from "../BasicForm";
import Submit from "../Submit";
import Combobox, { ComboboxProps } from "./Combobox";
import { Option } from "./types";

faker.seed(0);

const skills = getStaticSkills().map((skill) => ({
  value: skill.id,
  label: skill.name.en,
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
  title: "Form/Combobox",
};

const themes = ["light", "dark"];

const Template: StoryFn<ComboboxType> = (args) => {
  const { mockSearch, defaultValue, options, fetching, ...rest } = args;
  const [isSearching, setIsSearching] = React.useState<boolean>(
    fetching ?? false,
  );
  const [filteredOptions, setFilteredOptions] =
    React.useState<Option[]>(options);

  const handleSearch = React.useMemo(() => {
    return mockSearch
      ? (term: string) => {
          setIsSearching(true);
          setFilteredOptions([]);
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

  const debouncedSearch = handleSearch
    ? debounce(handleSearch, 300)
    : undefined;

  return (
    <div
      data-h2-display="base(grid)"
      data-h2-grid-template-columns="base(100%) l-tablet(50% 50%)"
    >
      {themes.map((theme) => (
        <div data-h2={theme} key={theme}>
          <div data-h2-background="base(background)" data-h2-padding="base(x2)">
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
              <p className="mt-6">
                <Submit />
              </p>
            </BasicForm>
          </div>
        </div>
      ))}
    </div>
  );
};

export const Default = Template.bind({});
Default.args = defaultArgs;

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

export const Multi = Template.bind({});
Multi.args = defaultMultiArgs;

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
