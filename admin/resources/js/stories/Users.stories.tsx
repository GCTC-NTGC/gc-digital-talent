import React from "react";
import { storiesOf } from "@storybook/react";
import UserTable from "../components/UserTable";
import fakeUsers from "../fakeData/fakeUsers";

const stories = storiesOf("Components/User", module);

stories.add("Users Table", () => <UserTable users={fakeUsers} />);
