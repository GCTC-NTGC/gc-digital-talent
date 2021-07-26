import React from "react";
import { storiesOf } from "@storybook/react";
import { createClient } from "urql";
import { action } from "@storybook/addon-actions";
import {
  ClassificationTable,
  ClassificationTableApi,
} from "../components/classification/ClassificationTable";
import fakeClassifications from "../fakeData/fakeClassifications";
import ClientProvider from "../components/ClientProvider";
import {
  CreateClassification,
  CreateClassificationForm,
} from "../components/classification/CreateClassification";
import {
  Classification,
  CreateClassificationInput,
  UpdateClassificationInput,
} from "../api/generated";
import {
  UpdateClassification,
  UpdateClassificationForm,
} from "../components/classification/UpdateClassification";

const classificationData = fakeClassifications();
// Its possible data may come back from api with missing data.

const stories = storiesOf("Classifications", module);

stories.add("Classifications Table", () => (
  <ClassificationTable classifications={classificationData} editUrlRoot="#" />
));
const client = createClient({
  url: "http://localhost:8000/graphql",
});
stories.add("Classifications Table with API data", () => (
  <ClientProvider client={client}>
    <ClassificationTableApi />
  </ClientProvider>
));

stories.add("Create Classification Form", () => (
  <CreateClassificationForm
    handleCreateClassification={async (data: CreateClassificationInput) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      action("Create Classification")(data);
      return data;
    }}
  />
));

stories.add("Update Classification Form", () => {
  const initialClassification: Classification = {
    id: "1",
    name: {
      en: "Computer Systems",
      fr: "Computer Systems FR",
    },
    group: "CS",
    level: 1,
    minSalary: 50000,
    maxSalary: 100000,
  };

  return (
    <UpdateClassificationForm
      initialClassification={initialClassification}
      handleUpdateClassification={async (
        id: string,
        data: UpdateClassificationInput,
      ) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        action("Create Classification")(data);
        return data;
      }}
    />
  );
});

stories.add("Create Classification Form with API", () => {
  return (
    <ClientProvider client={client}>
      <CreateClassification />
    </ClientProvider>
  );
});

stories.add("Update Classification Form with API", () => {
  return (
    <ClientProvider client={client}>
      <UpdateClassification classificationId="2" />
    </ClientProvider>
  );
});
