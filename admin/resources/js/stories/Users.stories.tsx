import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { createClient } from "urql";
import UserTable from "../components/UserTable";
import fakeUsers from "../fakeData/fakeUsers";
import { CreateUserInput, useAllUsersQuery } from "../api/generated";
import ClientProvider from "../components/ClientProvider";
import { CreateUserForm } from "../components/CreateUser";

const userData = fakeUsers();
// Its possible data may come back from api with missing data.
const flawedUserData = [
  { id: "100-bob", email: "bob@boop.com", lastName: null },
  null,
  ...userData,
];

const stories = storiesOf("Users", module);

stories.add("User Table", () => <UserTable users={userData} />);
stories.add("Users Table with flawed data", () => (
  <UserTable users={flawedUserData} />
));

const client = createClient({
  url: "http://localhost:8000/graphql",
});
const ApiUserTable = () => {
  const [result, _reexecuteQuery] = useAllUsersQuery();
  const { data, fetching, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return <UserTable users={data?.users ?? []} />;
};
stories.add("Users Table with API data", () => (
  <ClientProvider client={client}>
    <ApiUserTable />
  </ClientProvider>
));

stories.add("Create User Form", () => {
  return (
    <CreateUserForm
      handleCreateUser={async (data: CreateUserInput) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      action("Create User")(data);
      return data;
    }}
    />
  );
});
