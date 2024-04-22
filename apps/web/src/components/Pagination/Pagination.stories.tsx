import React from "react";
import { action } from "@storybook/addon-actions";
import { Meta, StoryFn } from "@storybook/react";

import Pagination from "./Pagination";
import type { PaginationProps } from "./Pagination";

export default {
  component: Pagination,
  title: "Components/Pagination",
  args: {
    ariaLabel: "Pagination table",
    handlePageChange: action("Change page"),
    handlePageSize: action("Change page size"),
    color: "black",
    mode: "outline",
  },
} as Meta;

const TemplatePagination: StoryFn<PaginationProps> = (args) => {
  return <Pagination {...args} />;
};

export const Default = TemplatePagination.bind({});
export const NoDots = TemplatePagination.bind({});
export const BothDots = TemplatePagination.bind({});

Default.args = {
  totalCount: 100,
  totalPages: 10,
  siblings: 1,
  currentPage: 1,
  pageSize: 10,
  color: "black",
};

NoDots.args = {
  ...Default.args,
  totalPages: 5,
  totalCount: 50,
};

BothDots.args = {
  ...Default.args,
  currentPage: 5,
};
