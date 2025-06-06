import { action } from "storybook/actions";
import { Meta, StoryObj } from "@storybook/react";

import Pagination from "./Pagination";

export default {
  component: Pagination,
  args: {
    ariaLabel: "Pagination table",
    onCurrentPageChange: action("Change page"),
    onPageSizeChange: action("Change page size"),
    color: "black",
    totalCount: 100,
    totalPages: 10,
    siblings: 1,
    currentPage: 1,
    pageSize: 10,
  },
  parameters: {
    controls: {
      include: [
        "ariaLabel",
        "totalCount",
        "totalPages",
        "siblings",
        "currentPage",
        "pageSize",
      ],
    },
    actions: {
      argTypesRegex: "^(onCurrentPageChange|onPageSizeChange)$",
    },
  },
} satisfies Meta<typeof Pagination>;

type Story = StoryObj<typeof Pagination>;

export const Default: Story = {};

export const NoDots: Story = {
  args: {
    totalPages: 5,
    totalCount: 50,
  },
};

export const BothDots: Story = {
  args: {
    currentPage: 5,
  },
};
