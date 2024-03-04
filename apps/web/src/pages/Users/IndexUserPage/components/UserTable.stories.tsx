import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

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
  title: "Tables/User Table",
  parameters: {
    apiResponses: {
      AllUsersPaginated: {
        data: {
          usersPaginated: {
            data: [...userData.slice(0, 4)],
            paginatorInfo: mockPaginatorInfo,
          },
        },
      },
      getFilterData: {
        data: {
          classifications: fakeClassifications(),
          pools: fakePools(),
          skills: fakeSkills(30),
          roles: fakeRoles(),
        },
      },
    },
  },
} as ComponentMeta<typeof UserTable>;

const Template: ComponentStory<typeof UserTable> = ({ title }) => {
  return <UserTable title={title} />;
};

export const Default = Template.bind({});
Default.args = { title: "Users" };
