import React from "react";
import { StoryFn } from "@storybook/react";
import { faker } from "@faker-js/faker";
import { action } from "@storybook/addon-actions";

import { Checkbox, Combobox } from "@gc-digital-talent/forms";
import { OverlayOrDialogDecorator } from "@gc-digital-talent/storybook-helpers";

import FilterDialog from "./FilterDialog";

faker.seed(0);

const mockOptions = Array.from({ length: 10 }).map(() => ({
  value: faker.string.uuid(),
  label: faker.animal.snake(),
}));

type FormValues = {
  multi?: string[];
  single?: string;
  boolean?: boolean;
};

export default {
  component: FilterDialog,
  title: "Components/Filter Dialog",
  decorators: [OverlayOrDialogDecorator],
  args: {
    defaultOpen: true,
  },
};

const Template: StoryFn<typeof FilterDialog> = (args) => {
  const handleSubmit = async (values: FormValues) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        action("Submit filters")(values);
        resolve(values);
      }, 1000);
    });
  };

  return (
    <FilterDialog<FormValues> {...args} onSubmit={handleSubmit}>
      <div
        data-h2-display="base(grid)"
        data-h2-grid-template-columns="l-tablet(1fr 1fr)"
        data-h2-gap="base(x1)"
      >
        <Combobox
          name="single"
          id="single"
          label="Single value"
          options={mockOptions}
        />
        <Checkbox
          id="boolean"
          name="boolean"
          label="Turn this filter on"
          boundingBox
          boundingBoxLabel="True/False"
        />
        <div data-h2-grid-column="base(span 2)">
          <Combobox
            name="multi"
            id="multi"
            isMulti
            label="Multiple values"
            options={mockOptions}
          />
        </div>
      </div>
    </FilterDialog>
  );
};

export const Default = Template.bind({});
Default.args = {
  options: {
    defaultValues: {
      single: mockOptions[1].value,
      multi: mockOptions.slice(2, 5).map((option) => option.value),
    },
  },
};

export const Null = Template.bind({});
