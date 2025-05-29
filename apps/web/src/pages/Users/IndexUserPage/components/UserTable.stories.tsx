import { Meta, StoryFn } from "@storybook/react";

import {
  fakeClassifications,
  fakePools,
  fakeRoles,
  fakeSkills,
  fakeUsers,
} from "@gc-digital-talent/fake-data";

import UserTable from "./UserTable";

const userData = fakeUsers(20);
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

export default {
  component: UserTable,
  parameters: {
    apiResponses: {
      UsersPaginated: {
        data: {
          usersPaginated: {
            data: [...userData.slice(0, 4)],
            paginatorInfo: mockPaginatorInfo,
          },
        },
      },
      UserFilterData: {
        data: {
          classifications: fakeClassifications(),
          pools: fakePools(),
          skills: fakeSkills(30),
          roles: fakeRoles(),
        },
      },
    },
  },
} as Meta<typeof UserTable>;

const Template: StoryFn<typeof UserTable> = ({ title }) => {
  return <UserTable title={title} />;
};

export const Default = {
  render: Template,
  args: { title: "Users" },
};
