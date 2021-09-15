import React from "react";
import { storiesOf } from "@storybook/react";
import { createClient } from "urql";
import ClientProvider from "../components/ClientProvider";
import {
  DepartmentTable,
  DepartmentTableApi,
} from "../components/department/DepartmentTable";
import fakeDepartments from "../fakeData/fakeDepartments";

const stories = storiesOf("Departments", module);

stories.add("Departments Table", () => (
  <DepartmentTable departments={fakeDepartments()} editUrlRoot="#" />
));

const client = createClient({
  url: "http://localhost:8000/graphql",
});

stories.add("Departments Table with API data", () => (
  <ClientProvider client={client}>
    <DepartmentTableApi />
  </ClientProvider>
));
