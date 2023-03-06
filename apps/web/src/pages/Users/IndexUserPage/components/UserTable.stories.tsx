import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { fakeUsers } from "@gc-digital-talent/fake-data";

import UserTable from "./UserTable";
import UserTableFilterDialogMeta from "./UserTableFilterDialog/UserTableFilterDialog.stories";

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
  title: "Tables/User Table",
  parameters: {
    themeKey: "admin",
  },
} as ComponentMeta<typeof UserTable>;

const Template: ComponentStory<typeof UserTable> = () => {
  return <UserTable />;
};

export const Default = Template.bind({});
Default.args = {
  apiResponses: {
    AllUsersPaginated: {
      data: {
        usersPaginated: {
          data: [...userData.slice(0, 4)],
          paginatorInfo: mockPaginatorInfo,
        },
      },
    },
    ...UserTableFilterDialogMeta.parameters?.apiResponses,
  },
};
