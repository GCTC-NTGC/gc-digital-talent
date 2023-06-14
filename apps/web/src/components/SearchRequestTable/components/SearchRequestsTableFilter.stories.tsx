import React from "react";

import { Meta, StoryFn } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import {
  fakeClassifications,
  fakeDepartments,
} from "@gc-digital-talent/fake-data";

import { SearchRequestsTableFilterDialog } from "./SearchRequestsTableFilterDialog";

const departments = fakeDepartments();
const classifications = fakeClassifications();

export default {
  title: "Components/Search Requests Table Filter Dialog",
  component: SearchRequestsTableFilterDialog,
  parameters: {
    themeKey: "admin",
    apiResponses: {
      getFilterDataForRequests: {
        data: {
          departments,
          classifications,
        },
      },
    },
  },
} as Meta<typeof SearchRequestsTableFilterDialog>;

const Template: StoryFn<typeof SearchRequestsTableFilterDialog> = (args) => {
  const { onSubmit, isOpen, onOpenChange, activeFilters } = args;

  return (
    <SearchRequestsTableFilterDialog
      onSubmit={onSubmit}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      activeFilters={activeFilters}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  onSubmit: action("submit"),
  isOpen: true,
  onOpenChange: action("toggle"),
  activeFilters: {
    status: [],
    classifications: [],
    departments: [departments[0].id],
    streams: [],
  },
};
