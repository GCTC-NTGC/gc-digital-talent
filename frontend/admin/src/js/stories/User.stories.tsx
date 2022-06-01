import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { fakeUsers } from "@common/fakeData";
import { UserTable } from "../components/user/UserTable";
import { CreateUserInput, Language, User } from "../api/generated";
import { CreateUserForm } from "../components/user/CreateUser";
import { UpdateUserForm } from "../components/user/UpdateUser";

const userData = fakeUsers();
// It is possible data may come back from api with missing data.
const flawedUserData = [
  { id: "100-bob", email: "bob@boop.com", lastName: null },
  null,
  ...userData,
];

const stories = storiesOf("Users", module);

stories.add("Users Table", () => (
  <UserTable users={userData} editUrlRoot="#" />
));
stories.add("Users Table with flawed data", () => (
  <UserTable users={flawedUserData} editUrlRoot="#" />
));

stories.add("Create User Form", () => {
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
});

stories.add("Update User Form", () => {
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
        action("Create User")(data);
        return null;
      }}
    />
  );
});
stories.add("Update User Form with failing submit", () => {
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
});
