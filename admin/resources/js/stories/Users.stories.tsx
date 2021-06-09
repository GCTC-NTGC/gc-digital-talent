import React from "react";
import { storiesOf } from "@storybook/react";
import UserTable from "../components/UserTable";
import { fakeUsers } from "../fakeData/fakeUsers";

storiesOf("Users", module).add("User Table", () => (
  <UserTable users={fakeUsers} />
));
