import React from "react";
import { Meta, Story } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { fakeUsers } from "@common/fakeData";
import { CreateUserInput, Language, User } from "../../api/generated";
import { CreateUserForm } from "./CreateUser";
import { UpdateUserForm } from "./UpdateUser";
import UserTable from "./UserTable";
import UserTableFilterDialogMeta from "./UserTableFilterDialog.stories";

const userData = fakeUsers();
// It is possible data may come back from api with missing data.
const flawedUserData = [
  { id: "100-bob", email: "bob@boop.com", lastName: null },
  null,
  ...userData,
];

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
  title: "Users",
  args: {},
} as Meta;

const UserTableTemplate: Story = () => {
  return <UserTable />;
};

export const UsersTableStory = UserTableTemplate.bind({});
UsersTableStory.storyName = "Users Table";
UsersTableStory.parameters = {
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

export const UsersTableWithFlawedDataStory = UserTableTemplate.bind({});
UsersTableWithFlawedDataStory.storyName = "Users Table with flawed data";
UsersTableWithFlawedDataStory.parameters = {
  apiResponses: {
    AllUsersPaginated: {
      data: {
        usersPaginated: {
          data: [...flawedUserData.slice(0, 4)],
          paginatorInfo: mockPaginatorInfo,
        },
      },
    },
  },
};

const CreateUserTemplate: Story = () => {
  return (
    <CreateUserForm
      handleCreateUser={async (data: CreateUserInput) => {
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
        action("Create User")(data);
        return null;
      }}
    />
  );
};

export const CreateUserFormStory = CreateUserTemplate.bind({});
CreateUserFormStory.storyName = "Create User Form";

const UpdateUserTemplate: Story = () => {
  const user: User = {
    id: "1",
    firstName: "Maura",
    lastName: "Attow",
    email: "mattow0@ning.com",
    telephone: "+867365373244",
    preferredLang: Language.En,
    preferredLanguageForExam: Language.En,
    preferredLanguageForInterview: Language.En,
  };
  return (
    <UpdateUserForm
      initialUser={user}
      handleUpdateUser={async (id, data) => {
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
        action("Create User")(data);
        return null;
      }}
    />
  );
};

export const UpdateUserFormStory = UpdateUserTemplate.bind({});
UpdateUserFormStory.storyName = "Update User Form";

const UpdateUserFailingTemplate: Story = () => {
  const user: User = {
    id: "1",
    firstName: "Maura",
    lastName: "Attow",
    email: "mattow0@ning.com",
    telephone: "+867365373244",
    preferredLang: Language.En,
  };
  return (
    <UpdateUserForm
      initialUser={user}
      handleUpdateUser={async (id, data) => {
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
        action("Submission failed User")(data);
        return Promise.reject(new Error("500"));
      }}
    />
  );
};

export const UpdateUserFormFailingStory = UpdateUserFailingTemplate.bind({});
UpdateUserFormFailingStory.storyName = "Update User Form with failing submit";
