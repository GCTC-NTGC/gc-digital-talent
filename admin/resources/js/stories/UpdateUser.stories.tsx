import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { UpdateUserForm } from "../components/UpdateUser";
import { Language, User } from "../api/generated";

const stories = storiesOf("Components/User", module);

stories.add("Update User Form", () => {
  const [user, setUser] = useState<User>({
    id: "1",
    firstName: "Maura",
    lastName: "Attow",
    email: "mattow0@ning.com",
    telephone: "+867365373244",
    preferredLang: Language.En,
  });
  return (
    <UpdateUserForm
      initialUser={user}
      handleUpdateUser={async (id, data) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Create User")(data);
        // const newUser = {
        //   ...user,
        //   id,
        //   ...data,
        // };
        // setUser(newUser);
        return data;
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
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Submission failed User")(data);
        return Promise.reject(new Error("500"));
      }}
    />
  );
});
