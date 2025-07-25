import { Meta, StoryObj } from "@storybook/react-vite";

import { fakePools, fakeTeams } from "@gc-digital-talent/fake-data";

import PoolTable from "./PoolTable";

const mockPools = fakePools();
const mockTeams = fakeTeams();

const mockPoolsWithTeam = mockPools.flatMap((pool, index) => {
  return {
    ...pool,
    team: mockTeams[index],
  };
});

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
            data: [...mockPoolsWithTeam.slice(0, 3)],
            paginatorInfo: mockPaginatorInfo,
          },
          me: {
            poolBookmarks: [mockPoolsWithTeam[0]],
          },
        },
      },
    },
  },
} satisfies Meta<typeof PoolTable>;
export default meta;

type Story = StoryObj<typeof PoolTable>;

export const Default: Story = {};
