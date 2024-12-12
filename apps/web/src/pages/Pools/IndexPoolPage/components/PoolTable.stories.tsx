import { Meta, StoryObj } from "@storybook/react";

import { fakePools } from "@gc-digital-talent/fake-data";

import PoolTable from "./PoolTable";

const mockPools = fakePools();

const mockPaginatorInfo = {
  count: 1,
  currentPage: 1,
  firstItem: 1,
  hasMorePages: true,
  lastItem: 1,
  lastPage: 1,
  perPage: 5,
  total: 100,
};

const meta = {
  component: PoolTable,
  parameters: {
    apiResponses: {
      PoolTable: {
        data: {
          poolsPaginated: {
            data: [...mockPools.slice(0, 3)],
            paginatorInfo: mockPaginatorInfo,
          },
          me: {
            poolBookmarks: [mockPools[0]],
          },
        },
      },
    },
  },
} satisfies Meta<typeof PoolTable>;
export default meta;

type Story = StoryObj<typeof PoolTable>;

export const Default: Story = {};
