/* eslint-disable @typescript-eslint/no-unused-vars */
import type { StoryFn } from "@storybook/react-vite";
import { faker } from "@faker-js/faker/locale/en";

import {
  fakeClassifications,
  fakeCommunities,
  fakeDepartments,
} from "@gc-digital-talent/fake-data";
import { CreatePoolInput, makeFragmentData } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import {
  CreatePoolClassification_Fragment,
  CreatePoolCommunity_Fragment,
  CreatePoolDepartment_Fragment,
  CreatePoolForm,
} from "./CreatePoolPage";

faker.seed(0);

const classifications = fakeClassifications();
const departments = fakeDepartments();
const departmentsMapped = departments.map((department) => {
  return {
    ...department,
    departmentName: { localized: department.name?.localized ?? "" },
  };
});
const communities = fakeCommunities();

export default {
  component: CreatePoolForm,
};

const Template: StoryFn<typeof CreatePoolForm> = (args) => {
  return <CreatePoolForm {...args} />;
};

const handleCreatePool = (
  userId: string,
  communityId: string,
  pool: CreatePoolInput,
) => {
  return Promise.reject(new Error());
};

export const Default = Template.bind({});
Default.args = {
  userId: "",
  classificationsQuery: classifications.map((classification) =>
    makeFragmentData(classification, CreatePoolClassification_Fragment),
  ),
  departmentsQuery: departmentsMapped.map((department) =>
    makeFragmentData(department, CreatePoolDepartment_Fragment),
  ),
  communitiesQuery: communities.map((community) =>
    makeFragmentData(community, CreatePoolCommunity_Fragment),
  ),
  handleCreatePool: handleCreatePool,
  canToggleFunctionalCommunity: true,
  usersRelevantRoles: [
    {
      id: "123",
      displayName: "Department Admin",
      name: ROLE_NAME.DepartmentAdmin,
    },
  ],
};
