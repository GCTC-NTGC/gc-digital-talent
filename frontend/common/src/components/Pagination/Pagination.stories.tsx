import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react";
import React from "react";
import Pagination, { PaginationProps } from "./Pagination";

export default {
  component: Pagination,
  title: "Components/Pagination",
  args: {
    totalCount: 100,
    siblingCount: 2,
    currentPage: 1,
    pageSize: 10,
    handlePageChange: action("Change page"),
  },
} as Meta;

const TemplatePagination: Story<PaginationProps> = (args) => {
  return <Pagination {...args} />;
};

export const PaginationDefault = TemplatePagination.bind({});
